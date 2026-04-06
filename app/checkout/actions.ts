"use server";

import prisma from "@/lib/prisma";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";
import { getOrderConfirmationEmailHtml } from "@/lib/email-templates";

export async function initiateRazorpayOrder(amount: number, isCOD?: boolean) {
  if (isCOD) {
    return { isCashOnDelivery: true };
  }

  const settings = await prisma.storeSettings.findUnique({ where: { id: "global" } });
  
  if (!settings?.razorpayKeyId || !settings?.razorpaySecret) {
    return { error: "Razorpay not configured", isCashOnDelivery: true };
  }

  const razorpay = new Razorpay({
    key_id: settings.razorpayKeyId,
    key_secret: settings.razorpaySecret,
  });

  const options = {
    amount: Math.round(amount * 100), // in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return { orderId: order.id, keyId: settings.razorpayKeyId };
  } catch (error) {
    console.error("Razorpay initiation failed", error);
    return { error: "Payment initiation failed", isCashOnDelivery: true };
  }
}

export async function verifyAndCompleteOrder(
  paymentData: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string } | null,
  checkoutData: any, // Renamed from formData and changed type slightly for cleaner pass
  cartItems: {id: string, price: number, quantity: number, title: string}[],
  affiliateId?: string | null
) {
  const { firstName, lastName, email, phone, address: baseAddress, apartment, city, state, pincode } = checkoutData;
  const name = firstName ? `${firstName} ${lastName}`.trim() : lastName;
  const address = apartment ? `${baseAddress}, ${apartment}` : baseAddress;

  if (!email || cartItems.length === 0) {
    throw new Error("Invalid checkout data.");
  }

  const settings = await prisma.storeSettings.findUnique({ where: { id: "global" } });
  let paymentId = null;

  // Verify Razorpay signature if payment is made
  if (paymentData && settings?.razorpaySecret) {
    const body = paymentData.razorpay_order_id + "|" + paymentData.razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', settings.razorpaySecret).update(body.toString()).digest('hex');
    if (expectedSignature !== paymentData.razorpay_signature) {
      throw new Error("Invalid payment signature");
    }
    paymentId = paymentData.razorpay_payment_id;
  }

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Use a transaction
  const order = await prisma.$transaction(async (tx: any) => {
    let user = await tx.user.findUnique({ where: { email } });
    if (!user) {
      user = await tx.user.create({ data: { name, email } });
    }

    const newOrder = await tx.order.create({
      data: {
        total,
        userId: user.id,
        status: paymentId ? "paid" : "pending",
        paymentId: paymentId,
        affiliateId: affiliateId || null,
        items: {
          create: cartItems.map(item => ({
            productId: item.id,
            price: item.price,
            quantity: item.quantity,
          }))
        },
        address: {
          create: { fullName: name, phone, address, city, state, pincode }
        }
      },
      include: {
        address: true,
        items: true
      }
    });

    // Handle Affiliate Commission if applicable
    if (affiliateId) {
      const affiliate = await tx.affiliate.findUnique({ where: { id: affiliateId } });
      if (affiliate) {
        const commission = (total * affiliate.commissionRate) / 100;
        await tx.affiliate.update({
          where: { id: affiliateId },
          data: {
            totalSales: { increment: total },
            totalEarnings: { increment: commission }
          }
        });
      }
    }

    // Mark Abandoned Checkout as Recovered
    const orConditions = [];
    if (email) orConditions.push({ email });
    if (phone) orConditions.push({ phone });

    if (orConditions.length > 0) {
      await tx.abandonedCheckout.updateMany({
        where: { 
          OR: orConditions,
          recovered: false
        },
        data: {
          recovered: true,
          recoveredAt: new Date()
        }
      });
    }

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return newOrder;
  }, {
    timeout: 15000 // 15 seconds timeout to avoid transaction not found on slower connections
  });

  if (settings?.shiprocketEmail && settings?.shiprocketPassword) {
    try {
      // 1. Get Auth Token
      const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: settings.shiprocketEmail, password: settings.shiprocketPassword })
      });
      
      if (authRes.ok) {
        const { token } = await authRes.json();
        
        // 2. Create Order in Shiprocket
        const srOrder = {
          order_id: order.id,
          order_date: new Date().toISOString().slice(0, 10),
          pickup_location: "Primary", // Requires proper valid pickup location assigned in SR Dashboard
          billing_customer_name: name,
          billing_last_name: "",
          billing_address: address,
          billing_city: city,
          billing_pincode: pincode,
          billing_state: state,
          billing_country: "India",
          billing_email: email,
          billing_phone: phone,
          shipping_is_billing: true,
          order_items: cartItems.map(item => ({
            name: item.title,
            sku: item.id,
            units: item.quantity,
            selling_price: item.price
          })),
          payment_method: paymentId ? "Prepaid" : "COD",
          sub_total: total,
          length: 10, breadth: 10, height: 10, weight: 0.5 // Default dimensions
        };

        const createRes = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
           method: "POST",
           headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
           body: JSON.stringify(srOrder)
        });

        if (createRes.ok) {
           const srData = await createRes.json();
           await prisma.order.update({
             where: { id: order.id },
             data: { shiprocketOrderId: srData.order_id?.toString() || srData.shipment_id?.toString() }
           });
        }
      }
    } catch (err) {
      console.error("Shiprocket sync failed:", err);
      // Fails silently for user, but order is saved
    }
  }

  // --- Send Notifications ---
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.SUPPORT_EMAIL || settings?.supportEmail || "Deeksha Candles <orders@deekshacandles.com>",
        to: email,
        subject: `Order Confirmation #${order.id.slice(-6).toUpperCase()}`,
        html: getOrderConfirmationEmailHtml(order.id, name, cartItems, total),
      });
      console.log("Confirmation email sent to:", email);
    } catch (err) {
      console.error("Email notification failed:", err);
    }
  }

  revalidatePath("/admin", "layout");
  return order.id;
}

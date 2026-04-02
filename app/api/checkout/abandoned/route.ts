import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      email, phone, firstName, lastName, 
      address, apartment, city, state, pincode,
      cartItems, total, discountAmount, couponCode,
      lastStep 
    } = body;

    // We need at least email or phone to identify the checkout
    if (!email && !phone) {
      return NextResponse.json({ error: "Missing contact info" }, { status: 400 });
    }

    // Try to find an existing abandoned checkout by email or phone
    const existing = await prisma.abandonedCheckout.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          phone ? { phone } : undefined
        ].filter(Boolean) as any,
        recovered: false
      }
    });

    let suggestedCoupon = couponCode;
    if (total >= 2000 && !couponCode) {
      suggestedCoupon = "RECOVERY20"; // 20% OFF suggestion for andmin/automated mail
    }

    const data = {
      email, phone, firstName, lastName,
      address, apartment, city, state, pincode,
      cartItems, total, discountAmount, 
      couponCode: suggestedCoupon,
      lastStep,
      updatedAt: new Date()
    };

    if (existing) {
      const updated = await prisma.abandonedCheckout.update({
        where: { id: existing.id },
        data
      });
      return NextResponse.json({ id: updated.id, token: updated.recoveryToken });
    } else {
      const created = await prisma.abandonedCheckout.create({
        data
      });
      return NextResponse.json({ id: created.id, token: created.recoveryToken });
    }

  } catch (error) {
    console.error("Abandoned checkout save error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

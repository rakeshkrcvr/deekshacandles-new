import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, cartTotal, items = [] } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      // Check if it's an Affiliate Code
      const affiliate = await prisma.affiliate.findUnique({
        where: { code: code.toUpperCase() },
      });

      if (affiliate && affiliate.status === 'active') {
        const discountAmount = (cartTotal * 10) / 100; // Flat 10% discount for affiliate code users
        return NextResponse.json({
          success: true,
          isAffiliate: true,
          affiliateId: affiliate.id,
          coupon: {
            id: affiliate.id,
            code: affiliate.code,
            discountType: "PERCENTAGE",
            discountValue: 10,
            discountAmount,
          },
        });
      }

      return NextResponse.json({ error: "Invalid coupon or affiliate code" }, { status: 404 });
    }

    if (!coupon.active) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    // Product Restriction Check
    let eligibleSubtotal = cartTotal;
    const hasProductRestrictions = coupon.productIds && coupon.productIds.length > 0;
    
    if (hasProductRestrictions) {
      // Filter items that are in the coupon.productIds list
      const eligibleItems = items.filter((item: any) => coupon.productIds.includes(item.id));
      
      if (eligibleItems.length === 0) {
        return NextResponse.json({ 
          error: "This coupon is not applicable to any items in your cart." 
        }, { status: 400 });
      }
      
      // Calculate subtotal ONLY for eligible products
      eligibleSubtotal = eligibleItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    }

    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return NextResponse.json(
        { error: `Minimum purchase of ₹${coupon.minPurchase} required` },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      // Apply percentage ONLY on eligible subtotal
      discountAmount = (eligibleSubtotal * (coupon.discountValue || 0)) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === "FIXED_AMOUNT") {
      discountAmount = coupon.discountValue || 0;
      // Ensure discount doesn't exceed eligible subtotal
      if (discountAmount > eligibleSubtotal) {
        discountAmount = eligibleSubtotal;
      }
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        buyQuantity: coupon.buyQuantity,
        getQuantity: coupon.getQuantity,
        maxDiscount: coupon.maxDiscount,
        discountAmount,
      },
    });
  } catch (error) {
    console.error("Apply Coupon Error:", error);
    return NextResponse.json({ error: "Failed to apply coupon" }, { status: 500 });
  }
}

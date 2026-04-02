import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

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

    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return NextResponse.json(
        { error: `Minimum purchase of ₹${coupon.minPurchase} required` },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (cartTotal * (coupon.discountValue || 0)) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === "FIXED_AMOUNT") {
      discountAmount = coupon.discountValue || 0;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    console.error("Apply Coupon Error:", error);
    return NextResponse.json({ error: "Failed to apply coupon" }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const discounts = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(discounts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Ensure all parsing matches Prisma types
    const discount = await prisma.coupon.create({
      data: {
        code: body.code.toUpperCase().replace(/\s+/g, ''),
        discountType: body.discountType,
        discountValue: body.discountValue ? parseFloat(body.discountValue) : null,
        description: body.description,
        minPurchase: body.minPurchase ? parseFloat(body.minPurchase) : null,
        maxDiscount: body.maxDiscount ? parseFloat(body.maxDiscount) : null,
        buyQuantity: body.buyQuantity ? parseInt(body.buyQuantity) : null,
        getQuantity: body.getQuantity ? parseInt(body.getQuantity) : null,
        isBundle: body.isBundle || false,
        targetCustomer: body.targetCustomer || 'ALL',
        bankName: body.bankName || null,
        usageLimit: body.usageLimit ? parseInt(body.usageLimit) : null,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        productIds: body.productIds || [],
        categoryIds: body.categoryIds || [],
        active: body.active !== undefined ? body.active : true
      }
    });

    return NextResponse.json(discount, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Discount code already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error creating discount', details: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        code: body.code ? body.code.toUpperCase().replace(/\s+/g, '') : undefined,
        discountType: body.discountType,
        discountValue: body.discountValue !== undefined ? (body.discountValue ? parseFloat(body.discountValue) : null) : undefined,
        description: body.description,
        minPurchase: body.minPurchase !== undefined ? (body.minPurchase ? parseFloat(body.minPurchase) : null) : undefined,
        maxDiscount: body.maxDiscount !== undefined ? (body.maxDiscount ? parseFloat(body.maxDiscount) : null) : undefined,
        buyQuantity: body.buyQuantity !== undefined ? (body.buyQuantity ? parseInt(body.buyQuantity) : null) : undefined,
        getQuantity: body.getQuantity !== undefined ? (body.getQuantity ? parseInt(body.getQuantity) : null) : undefined,
        isBundle: body.isBundle,
        targetCustomer: body.targetCustomer,
        bankName: body.bankName,
        usageLimit: body.usageLimit !== undefined ? (body.usageLimit ? parseInt(body.usageLimit) : null) : undefined,
        expiresAt: body.expiresAt !== undefined ? (body.expiresAt ? new Date(body.expiresAt) : null) : undefined,
        productIds: body.productIds,
        categoryIds: body.categoryIds,
        active: body.active
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT Discount Error:", error);
    return NextResponse.json({ error: 'Failed to update discount', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

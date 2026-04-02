import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        ...updateData,
        code: updateData.code ? updateData.code.toUpperCase().replace(/\s+/g, '') : undefined,
        discountValue: updateData.discountValue ? parseFloat(updateData.discountValue) : null,
        minPurchase: updateData.minPurchase ? parseFloat(updateData.minPurchase) : null,
        maxDiscount: updateData.maxDiscount ? parseFloat(updateData.maxDiscount) : null,
        buyQuantity: updateData.buyQuantity ? parseInt(updateData.buyQuantity) : null,
        getQuantity: updateData.getQuantity ? parseInt(updateData.getQuantity) : null,
        usageLimit: updateData.usageLimit ? parseInt(updateData.usageLimit) : null,
        expiresAt: updateData.expiresAt ? new Date(updateData.expiresAt) : null,
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 });
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

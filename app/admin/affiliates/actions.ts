"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAffiliates() {
  return await prisma.affiliate.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  });
}

export async function submitAffiliateApplication(formData: { name: string, email: string, phone: string, youtubeUrl: string, instagramUrl: string, password?: string }) {
  try {
    const affiliate = await prisma.affiliate.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        youtubeUrl: formData.youtubeUrl,
        instagramUrl: formData.instagramUrl,
        password: formData.password || null,
        status: "pending"
      }
    });

    revalidatePath("/admin/affiliates");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Application with this email already exists" };
    }
    return { success: false, error: "Failed to submit application" };
  }
}

export async function approveAffiliate(id: string, code: string, commissionRate: number) {
  try {
    await prisma.affiliate.update({
      where: { id },
      data: {
        code: code.toUpperCase().trim(),
        commissionRate,
        status: "approved"
      }
    });

    revalidatePath("/admin/affiliates");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "This affiliate code is already taken" };
    }
    return { success: false, error: "Failed to approve affiliate" };
  }
}

export async function rejectAffiliate(id: string) {
  try {
    await prisma.affiliate.update({
      where: { id },
      data: { status: "rejected" }
    });

    revalidatePath("/admin/affiliates");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to reject affiliate" };
  }
}

export async function createAffiliate(formData: { name: string, email: string, code: string, commissionRate: number, payoutInfo?: string }) {
  try {
    const affiliate = await prisma.affiliate.create({
      data: {
        name: formData.name,
        email: formData.email,
        code: formData.code.toUpperCase().trim(),
        commissionRate: formData.commissionRate,
        payoutInfo: formData.payoutInfo || ""
      }
    });

    revalidatePath("/admin/affiliates");
    return { success: true, data: affiliate };
  } catch (error: any) {
    console.error("Create affiliate error:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "Affiliate code or Email already exists" };
    }
    return { success: false, error: "Failed to create affiliate" };
  }
}

export async function updateAffiliate(id: string, formData: any) {
  try {
    const updateData: any = {
      name: formData.name,
      email: formData.email,
      code: formData.code?.toUpperCase().trim(),
      commissionRate: Number(formData.commissionRate),
      payoutInfo: formData.payoutInfo
    };

    if (formData.password && formData.password.trim() !== "") {
      updateData.password = formData.password;
    }

    await prisma.affiliate.update({
      where: { id },
      data: updateData
    });

    revalidatePath("/admin/affiliates");
    return { success: true };
  } catch (error: any) {
    console.error("Update affiliate error:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "Affiliate code or Email already exists" };
    }
    return { success: false, error: error.message || "Failed to update affiliate" };
  }
}

export async function deleteAffiliate(id: string) {
  try {
    await prisma.affiliate.delete({
      where: { id }
    });

    revalidatePath("/admin/affiliates");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete affiliate" };
  }
}

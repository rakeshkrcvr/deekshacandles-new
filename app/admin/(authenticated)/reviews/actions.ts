"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteReviewAction(id: string) {
  try {
    await prisma.review.delete({
      where: { id }
    });
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateReviewAction(id: string, data: any) {
  try {
    await prisma.review.update({
      where: { id },
      data: {
        rating: data.rating,
        comment: data.comment,
      }
    });
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReviewAction(formData: FormData) {
  try {
    const productId = formData.get("productId") as string;
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!productId || !rating || !comment || !name || !email) {
      return { success: false, error: "All fields are required" };
    }

    // Since our schema requires a userId, and we want to allow anonymous reviews (as per the UI screenshot),
    // we have two options: 
    // 1. Update schema to make userId optional.
    // 2. Create/Find a "Guest" user.
    // Given the prompt "live dikhna chahiye jaise dikhte h", I'll implement a robust way.
    
    // For now, let's find or create a placeholder user for this email to satisfy Prisma
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
        }
      });
    }

    await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating,
        comment,
      }
    });

    revalidatePath(`/products/[slug]`);
    return { success: true };
  } catch (error: any) {
    console.error("Review submission error:", error);
    return { success: false, error: error.message || "Failed to submit review" };
  }
}

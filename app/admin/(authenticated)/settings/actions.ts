"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStoreSettings(formData: FormData) {
  const razorpayKeyId = formData.get("razorpayKeyId") as string;
  const razorpaySecret = formData.get("razorpaySecret") as string;
  const shiprocketEmail = formData.get("shiprocketEmail") as string;
  const shiprocketPassword = formData.get("shiprocketPassword") as string;
  const supportEmail = formData.get("supportEmail") as string;

  // Build the update data object only with fields we want to change
  const updateData: any = {
    razorpayKeyId,
    razorpaySecret,
    shiprocketEmail,
    shiprocketPassword,
    supportEmail
  };

  await prisma.storeSettings.update({
    where: { id: "global" },
    data: updateData
  });

  revalidatePath("/admin/settings");
}

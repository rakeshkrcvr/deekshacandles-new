"use server";

import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAffiliate(email: string, password: string) {
  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { email }
    });

    if (!affiliate) {
      return { success: false, error: "Account not found" };
    }

    if (affiliate.status === "pending") {
      return { success: false, error: "Your application is still pending review" };
    }

    if (affiliate.status === "rejected") {
      return { success: false, error: "Your application was not approved" };
    }

    if (affiliate.password !== password) {
      return { success: false, error: "Invalid password" };
    }

    // Set cookie session (Simple version for now)
    const cookieStore = await cookies();
    cookieStore.set("affiliate_id", affiliate.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/"
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Something went wrong" };
  }
}

export async function getAffiliateSession() {
  const cookieStore = await cookies();
  const id = cookieStore.get("affiliate_id")?.value;
  if (!id) return null;

  return await prisma.affiliate.findUnique({
    where: { id },
    include: {
      _count: {
        select: { orders: true }
      },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true
        }
      }
    }
  });
}

export async function logoutAffiliate() {
  const cookieStore = await cookies();
  cookieStore.delete("affiliate_id");
  redirect("/affiliate/login");
}

export async function impersonateAffiliate(id: string) {
  const cookieStore = await cookies();
  cookieStore.set("affiliate_id", id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour for impersonation
    path: "/"
  });
  redirect("/affiliate/dashboard");
}

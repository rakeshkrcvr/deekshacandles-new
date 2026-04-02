import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const checkout = await prisma.abandonedCheckout.findUnique({
      where: { recoveryToken: token },
    });

    if (!checkout) {
      return NextResponse.json({ error: "Checkout not found" }, { status: 404 });
    }

    // You could also mark it as 'recovered' here or wait for order completion
    return NextResponse.json({ checkout });

  } catch (error) {
    console.error("Recovery error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

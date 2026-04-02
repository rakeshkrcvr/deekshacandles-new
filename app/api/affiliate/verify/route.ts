import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const affiliate = await prisma.affiliate.findUnique({
      where: { code: code.toUpperCase() },
      select: {
        id: true,
        code: true,
        name: true,
        status: true
      }
    });

    if (!affiliate || affiliate.status !== 'active') {
      return NextResponse.json({ error: "Invalid or inactive affiliate" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      affiliateId: affiliate.id,
      affiliateName: affiliate.name
    });
  } catch (error) {
    console.error("Verify Affiliate Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

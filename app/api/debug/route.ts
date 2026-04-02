import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const pages = await prisma.content.findMany();
  return NextResponse.json(pages);
}

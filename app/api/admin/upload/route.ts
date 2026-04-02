import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = (file as any).name || 'upload.png';
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '');
    const finalName = `${uniqueSuffix}-${sanitizedName}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {}

    const filepath = path.join(uploadDir, finalName);
    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${finalName}` });
  } catch (error: any) {
    console.error("API Upload Error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}

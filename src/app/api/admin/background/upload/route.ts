import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validate Mimetype
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Only JPEG, PNG, WEBP, and GIF are allowed." },
        { status: 400 }
      );
    }

    // 4. Validate File Size (Max 8MB for larger high-res backgrounds)
    const maxSize = 8 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Max size allowed is 8MB for backgrounds." },
        { status: 400 }
      );
    }

    // 5. Setup Save Directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", "backgrounds");
    await mkdir(uploadDir, { recursive: true });

    // 6. Generate Safe & Unique Filename
    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `background-${session.userId}-${Date.now()}.${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // 7. Write File to Local Disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/backgrounds/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (err) {
    console.error("Background Upload API Error:", err);
    return NextResponse.json({ error: "Upload failed on server side" }, { status: 500 });
  }
}

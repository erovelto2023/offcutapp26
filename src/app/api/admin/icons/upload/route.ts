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

    // 3. Validate Mimetype (allow images and SVGs)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Only JPEG, PNG, WEBP, GIF, and SVG are allowed." },
        { status: 400 }
      );
    }

    // 4. Validate File Size (Max 5MB for icons)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Max size allowed is 5MB for icons." },
        { status: 400 }
      );
    }

    // 5. Setup Save Directory (outside public folder)
    const uploadDir = path.join(process.cwd(), "uploads", "icons");
    await mkdir(uploadDir, { recursive: true });

    // 6. Generate Safe & Unique Filename
    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `icon-${session.userId}-${Date.now()}.${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // 7. Write File to Local Disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const publicUrl = `/api/uploads/icons/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (err) {
    console.error("Icon Upload API Error:", err);
    return NextResponse.json({ error: "Upload failed on server side" }, { status: 500 });
  }
}

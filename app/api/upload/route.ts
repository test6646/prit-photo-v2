import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const storySlug = formData.get("storySlug") as string;

    if (!file || !storySlug) {
      return NextResponse.json({ error: "File and storySlug are required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const folder = `stories/${storySlug}`;
    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-]/g, "-");
    
    const publicId = `${folder}/${timestamp}-${originalName}`;

    const result = await cloudinary.uploader.upload(base64, {
      public_id: publicId,
      folder: folder,           // ensures folder structure
      resource_type: "image",
      overwrite: false,
    });

    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,   // ← Full public_id with folder
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { public_id, folder } = await req.json();

    if (public_id) {
      // Delete single image
      await cloudinary.uploader.destroy(public_id, { invalidate: true });
      return NextResponse.json({ success: true, type: "asset" });
    }

    if (folder) {
      const folderPath = folder.endsWith('/') ? folder : `${folder}/`;

      // Step 1: Delete ALL assets under this folder (including subfolders like gallery/)
      await cloudinary.api.delete_resources_by_prefix(folderPath);

      // Step 2: Small delay to let Cloudinary process (very important)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: Delete the folder itself
      try {
        await cloudinary.api.delete_folder(folderPath);
      } catch (folderErr: any) {
        // If still not empty, try one more time after extra delay
        if (folderErr.message?.includes("not empty") || folderErr.http_code === 400) {
          await new Promise(resolve => setTimeout(resolve, 1200));
          await cloudinary.api.delete_folder(folderPath);
        } else {
          throw folderErr;
        }
      }

      return NextResponse.json({ success: true, type: "folder" });
    }

    return NextResponse.json({ success: false, error: "Missing public_id or folder" }, { status: 400 });
  } catch (err: any) {
    console.error("Cloudinary delete error:", err);
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Delete failed" 
    }, { status: 500 });
  }
}
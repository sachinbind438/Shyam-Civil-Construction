// src/app/api/admin/delete-file/route.ts

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

function extractPublicId(url: string): string | null {
  try {
    const pathParts = new URL(url).pathname.split('/');
    const uploadIndex = pathParts.findIndex(p => p === 'upload');
    if (uploadIndex === -1 || uploadIndex + 2 >= pathParts.length) return null;
    const rawPublicId = pathParts.slice(uploadIndex + 2).join('/').replace(/\.[^/.]+$/, '');
    return decodeURIComponent(rawPublicId); // ← fixes %20 → space
  } catch {
    return null;
  }
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url) || url.includes('/video/upload/');
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, error: "No file URL provided" }, { status: 400 });
    }

    if (!url.includes("res.cloudinary.com")) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const publicId = extractPublicId(url);
    if (!publicId) {
      return NextResponse.json({ success: false, error: "Invalid Cloudinary URL" }, { status: 400 });
    }

    const resourceType = isVideoUrl(url) ? "video" : "image";

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    console.log("Cloudinary destroy:", publicId, resourceType, result.result);

    if (result.result !== 'ok' && result.result !== 'not found') {
      return NextResponse.json({ success: false, error: "Failed to delete file" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete file" },
      { status: 500 }
    );
  }
}
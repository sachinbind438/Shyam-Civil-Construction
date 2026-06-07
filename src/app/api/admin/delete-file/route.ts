// src/app/api/admin/delete-file/route.ts
// Deletes a file from Cloudinary when a project is deleted

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// ── Extract public_id from Cloudinary URL ────────────────────────────────────
function extractPublicId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Find the index after 'upload'
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1 || uploadIndex + 2 >= pathParts.length) {
      return null;
    }
    
    // Skip the version number (v1234) and get everything after it
    const pathAfterUpload = pathParts.slice(uploadIndex + 2);
    
    // Join the remaining parts and remove file extension
    const publicIdWithExt = pathAfterUpload.join('/');
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch {
    return null;
  }
}

// ── Delete file from Cloudinary ─────────────────────────────────────────────
async function deleteFileFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

// ── POST handler ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { success: false, error: "No file URL provided" },
        { status: 400 }
      );
    }

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234/folder/filename.ext
    const publicId = extractPublicId(url);
    
    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "Invalid Cloudinary URL" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    const success = await deleteFileFromCloudinary(publicId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to delete file" },
        { status: 500 }
      );
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
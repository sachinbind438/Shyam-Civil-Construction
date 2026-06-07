// src/app/api/admin/upload/route.ts
// ── Cloudinary upload ─────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";

// ── Verify JWT token ─────────────────────────────────────────────────────────
async function verifyToken(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';
  
  if (!token) {
    return { success: false, error: "No authentication token" };
  }
  
  try {
    jwt.verify(token, JWT_SECRET);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Invalid token" };
  }
}


// ── POST handler ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    
    // Verify JWT token
    const auth = await verifyToken(request);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Allowed: JPG, PNG, WEBP, MP4, WebM" },
        { status: 400 }
      );
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 50MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const fileName = `${Date.now()}.${fileExt}`;

    // Determine folder based on context (default to 'general' if not specified)
    const folder = 'general';

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString('base64')}`,
      {
        folder: folder,
        public_id: fileName.split('.')[0],
        resource_type: file.type.startsWith('video/') ? 'video' : 'image',
      }
    );

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      fileName: fileName,
    });

  } catch (error: any) {
    console.error("Cloudinary Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
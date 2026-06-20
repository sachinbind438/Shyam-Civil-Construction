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

// ── Helper: slugify a project title for folder naming ────────────────────────
function slugifyFolderName(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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
    const projectTitle = formData.get("projectTitle") as string | null;
    const projectSlugInput = formData.get("projectSlug") as string | null;
    const type = formData.get("type") as string | null; // "cover" | "gallery" | "video"
    const context = formData.get("context") as string | null; // "project" | "gallery-page"

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Only require projectTitle for project uploads — gallery page skips this check
    const isProjectUpload = context !== "gallery-page";

    if (isProjectUpload && (!projectTitle || !projectTitle.trim())) {
      return NextResponse.json(
        { success: false, error: "Project title is required before uploading" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Allowed: JPG, PNG, WEBP, MP4, WebM" },
        { status: 400 }
      );
    }

    const isVideo = file.type.startsWith("video/");

    // Validate file size — 50MB for images, 100MB for videos
    const maxSize = isVideo ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size is ${isVideo ? "100MB" : "50MB"}`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── Folder + public_id resolution ──────────────────────────────────────
    let folder: string;
    let publicId: string;

    if (isProjectUpload) {
      // Use existing slug if provided (editing existing project), else slugify title
      const projectSlug = projectSlugInput?.trim()
        ? projectSlugInput.trim()
        : slugifyFolderName(projectTitle!);
      folder = `projects/${projectSlug}`;

      if (type === "cover") {
        publicId = "Cover";
      } else if (isVideo) {
        publicId = `video-${Date.now()}`;
      } else {
        publicId = `image-${Date.now()}`;
      }
    } else {
      // Standalone gallery page — fixed folder, no project association
      folder = "Gallery";
      publicId = `${Date.now()}`;
    }

    // Upload to Cloudinary — videos get compressed via eager transformation
    const uploadOptions: any = {
      folder,
      public_id: publicId,
      resource_type: isVideo ? "video" : "image",
      overwrite: isProjectUpload && type === "cover",
    };

    if (isVideo) {
      uploadOptions.eager = [
        {
          quality: "auto:good",
          fetch_format: "mp4",
          video_codec: "auto",
          width: 1280,
          crop: "limit",
        },
      ];
      uploadOptions.eager_async = false;
    }

    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      uploadOptions
    );

    const finalUrl =
      isVideo && result.eager && result.eager[0]
        ? result.eager[0].secure_url
        : result.secure_url;

    return NextResponse.json({
      success: true,
      url: finalUrl,
      publicId: result.public_id,
      resourceType: isVideo ? "video" : "image",
      folder,
    });
  } catch (error: any) {
    console.error("Cloudinary Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
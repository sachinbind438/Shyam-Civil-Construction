// src/app/api/admin/upload/route.ts
// ── Backblaze B2 upload — replaces Cloudinary ─────────────────────────────────
// No SDK needed — uses B2 REST API directly (no querySelector error ever)
//
// .env.local vars required:
//   B2_KEY_ID              → Backblaze applicationKeyId
//   B2_APP_KEY             → Backblaze applicationKey
//   B2_BUCKET_ID           → Backblaze bucket ID (from bucket page)
//   B2_BUCKET_NAME         → Backblaze bucket name  e.g. shyam-civil
//   NEXT_PUBLIC_CDN_URL    → Public base URL
//                            Without Cloudflare: https://f005.backblazeb2.com/file/shyam-civil
//                            With Cloudflare:    https://cdn.shyamcivil.com/file/shyam-civil

import { NextRequest, NextResponse } from "next/server";
import crypto                        from "crypto";

// ── Authorize with B2 ─────────────────────────────────────────────────────────
async function authorizeB2() {
  const credentials = Buffer
    .from(`${process.env.B2_KEY_ID}:${process.env.B2_APP_KEY}`)
    .toString("base64");

  const res = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`B2 auth failed: ${err.message}`);
  }

  return res.json() as Promise<{ authorizationToken: string; apiUrl: string }>;
}

// ── Get upload URL ────────────────────────────────────────────────────────────
async function getUploadUrl(apiUrl: string, token: string) {
  const res = await fetch(`${apiUrl}/b2api/v3/b2_get_upload_url`, {
    method:  "POST",
    headers: {
      Authorization:  token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bucketId: process.env.B2_BUCKET_ID }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`B2 get upload URL failed: ${err.message}`);
  }

  return res.json() as Promise<{ uploadUrl: string; authorizationToken: string }>;
}

// ── Upload file buffer to B2 ──────────────────────────────────────────────────
async function uploadFile(
  uploadUrl:   string,
  uploadToken: string,
  fileName:    string,
  buffer:      Buffer,
  contentType: string
) {
  const sha1 = crypto.createHash("sha1").update(buffer).digest("hex");

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization:       uploadToken,
      "X-Bz-File-Name":    encodeURIComponent(fileName),
      "Content-Type":      contentType,
      "Content-Length":    String(buffer.length),
      "X-Bz-Content-Sha1": sha1,
    },
    // @ts-expect-error — Node fetch supports Buffer as body
    body:   buffer,
    duplex: "half",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`B2 upload failed: ${err.message}`);
  }

  return res.json() as Promise<{ fileId: string; fileName: string }>;
}

// ── POST handler (same signature as your Cloudinary route) ───────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file     = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate — image or video only
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return NextResponse.json(
        { success: false, error: "Only image and video files are allowed" },
        { status: 400 }
      );
    }

    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File too large. Max 50MB." },
        { status: 400 }
      );
    }

    // Convert File → Buffer (same as your Cloudinary route)
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe unique filename
    // e.g. shyam-civil/2025/01/1735000000000-bathroom-sink.jpg
    const now      = new Date();
    const year     = now.getFullYear();
    const month    = String(now.getMonth() + 1).padStart(2, "0");
    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const fileName = `shyam-civil/${year}/${month}/${Date.now()}-${safeName}`;

    // ── Upload to B2 ──────────────────────────────────────────────────────────
    const { authorizationToken, apiUrl } = await authorizeB2();
    const { uploadUrl, authorizationToken: uploadToken } =
      await getUploadUrl(apiUrl, authorizationToken);

    const uploaded = await uploadFile(
      uploadUrl,
      uploadToken,
      fileName,
      buffer,
      file.type
    );

    // ── Build public URL ──────────────────────────────────────────────────────
    const cdnBase = process.env.NEXT_PUBLIC_CDN_URL ??
      `https://f005.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}`;

    // ✅ cleanUrl prevents any \n sneaking into stored URLs
    const url = `${cdnBase}/${uploaded.fileName}`
      .replace(/[\n\r\t]/g, "")
      .trim();

    return NextResponse.json({
      success:  true,
      url,                          // ← same field name as Cloudinary route
      fileId:   uploaded.fileId,    // ← extra: useful for deletion later
      fileName: uploaded.fileName,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
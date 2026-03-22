// src/app/api/admin/upload/route.ts
// ── Cloudflare R2 upload — replaces Backblaze B2 ─────────────────────────────
// Uses AWS S3 compatible API with proper signature

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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

// ── AWS Signature v4 Helper ────────────────────────────────────────────────
function createAWS4Signature(
  method: string,
  path: string,
  host: string,
  region: string,
  service: string,
  accessKeyId: string,
  secretAccessKey: string,
  payload: Buffer,
  contentType: string
): string {
  const amzDate = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substr(0, 8);
  
  // Create payload hash
  const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');
  
  // Create canonical request
  const canonicalHeaders = [
    `content-type:${contentType}`,
    `host:${host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
    ''
  ].join('\n');
  
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';
  
  const canonicalRequest = [
    method,
    path,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');
  
  // Create string to sign
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');
  
  // Calculate signature
  const kDate = crypto.createHmac('sha256', `AWS4${secretAccessKey}`).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
  
  // Create authorization header
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  
  return authorization;
}

// ── Upload to R2 ────────────────────────────────────────────────────────────
async function uploadToR2(
  endpoint: string,
  bucket: string,
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<{ url: string }> {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;
  const region = 'auto';
  const service = 's3';
  
  const host = new URL(endpoint).hostname;
  const path = `/${bucket}/${fileName}`;
  
  // Create authorization header
  const authorization = createAWS4Signature(
    'PUT',
    path,
    host,
    region,
    service,
    accessKeyId,
    secretAccessKey,
    buffer,
    contentType
  );
  
  // Get date for headers
  const amzDate = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
  const payloadHash = crypto.createHash('sha256').update(buffer).digest('hex');
  
  // Upload file
  const uploadUrl = `${endpoint}/${bucket}/${fileName}`;
  
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Authorization': authorization,
      'Content-Type': contentType,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
      'Content-Length': buffer.length.toString(),
    },
    body: buffer as any, // Type assertion for Node.js fetch
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`R2 upload failed: ${response.status} ${errorText}`);
  }
  
  // Return public URL
  const cdnBase = process.env.NEXT_PUBLIC_CDN_URL!;
  return { url: `${cdnBase}/${fileName}` };
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

    // Upload to R2
    const endpoint = process.env.R2_ENDPOINT!;
    const bucket = process.env.R2_BUCKET_NAME!;
    
    const result = await uploadToR2(
      endpoint,
      bucket,
      fileName,
      buffer,
      file.type
    );

    return NextResponse.json({
      success: true,
      url: result.url,
      fileName: fileName,
    });

  } catch (error: any) {
    console.error("R2 Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
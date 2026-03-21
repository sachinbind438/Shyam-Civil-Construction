// src/app/api/admin/delete-file/route.ts
// Deletes a file from Cloudflare R2 when a project is deleted

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// ── AWS S3 signature helpers (R2 compatible) ─────────────────────────────────
function getSignatureKey(key: string, date: string, region: string, service: string): string {
  const kDate = crypto.createHmac('sha256', 'AWS4' + key).update(date).digest('hex');
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest('hex');
  const kService = crypto.createHmac('sha256', kRegion).update(service).digest('hex');
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest('hex');
  return kSigning;
}

function getStringToSign(date: string, credentialScope: string, canonicalRequestHash: string): string {
  return [
    'AWS4-HMAC-SHA256',
    date,
    credentialScope,
    canonicalRequestHash
  ].join('\n');
}

// ── Delete file from R2 ─────────────────────────────────────────────────────
async function deleteFileFromR2(fileName: string): Promise<boolean> {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;
  const region = 'auto';
  const service = 's3';
  
  const amzDate = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substr(0, 8);
  
  const host = new URL(process.env.R2_ENDPOINT!).hostname;
  const bucket = process.env.R2_BUCKET_NAME!;
  const canonicalPath = `/${bucket}/${fileName}`;
  
  // Create payload hash (empty for DELETE)
  const payloadHash = crypto.createHash('sha256').update('').digest('hex');
  
  // Create canonical request
  const canonicalHeaders = [
    `host:${host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
    ''
  ].join('\n');
  
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
  
  const canonicalRequest = [
    'DELETE',
    canonicalPath,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');
  
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = getStringToSign(
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  );
  
  // Calculate signature
  const signingKey = getSignatureKey(secretAccessKey, dateStamp, region, service);
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');
  
  // Create authorization header
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  
  // Delete file
  const deleteUrl = `${process.env.R2_ENDPOINT!}/${bucket}/${fileName}`;
  
  const response = await fetch(deleteUrl, {
    method: 'DELETE',
    headers: {
      'Authorization': authorization,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
    },
  });
  
  return response.ok;
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

    // Extract filename from URL
    // URL format: https://pub-xxx.r2.dev/year/month/filename.ext
    const urlObj = new URL(url);
    const fileName = urlObj.pathname.slice(1); // Remove leading '/'
    
    if (!fileName) {
      return NextResponse.json(
        { success: false, error: "Invalid file URL" },
        { status: 400 }
      );
    }

    // Delete from R2
    const success = await deleteFileFromR2(fileName);
    
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
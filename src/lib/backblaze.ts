// Backblaze B2 helper functions
// Replaces Cloudinary SDK for direct B2 API usage

export interface B2UploadResult {
  fileId: string;
  fileName: string;
}

export interface B2DeleteResult {
  success: boolean;
}

// Authorize with B2
export async function authorizeB2() {
  const credentials = Buffer.from(
    `${process.env.B2_KEY_ID}:${process.env.B2_APP_KEY}`
  ).toString("base64");

  const res = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`B2 auth failed: ${err.message}`);
  }

  const data = await res.json();
  return {
    authorizationToken: data.authorizationToken,
    apiUrl: data.apiUrl,
  };
}

// Get upload URL
export async function getUploadUrl(apiUrl: string, token: string) {
  const res = await fetch(`${apiUrl}/b2api/v3/b2_get_upload_url`, {
    method: "POST",
    headers: {
      Authorization: token,
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

// Upload file to B2
export async function uploadFile(
  uploadUrl: string,
  uploadToken: string,
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<B2UploadResult> {
  const sha1 = require('crypto').createHash("sha1").update(buffer).digest("hex");

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: uploadToken,
      "X-Bz-File-Name": encodeURIComponent(fileName),
      "Content-Type": contentType,
      "Content-Length": String(buffer.length),
      "X-Bz-Content-Sha1": sha1,
    },
    // @ts-expect-error - Node fetch supports Buffer as body
    body: buffer,
    duplex: "half",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`B2 upload failed: ${err.message}`);
  }

  return res.json() as Promise<B2UploadResult>;
}

// Delete file from B2
export async function deleteFile(fileId: string, fileName: string): Promise<B2DeleteResult> {
  const { authorizationToken, apiUrl } = await authorizeB2();

  const res = await fetch(`${apiUrl}/b2api/v3/b2_delete_file_version`, {
    method: "POST",
    headers: {
      Authorization: authorizationToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileId, fileName }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }

  return { success: true };
}

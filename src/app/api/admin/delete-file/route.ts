// src/app/api/admin/delete-file/route.ts
// Deletes a file from Backblaze B2 when a project is deleted

import { NextRequest, NextResponse } from "next/server";
import { auth }                      from "@/auth";

async function authorizeB2() {
  const credentials = Buffer.from(
    `${process.env.B2_KEY_ID}:${process.env.B2_APP_KEY}`
  ).toString("base64");

  const res = await fetch(
    "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
    { headers: { Authorization: `Basic ${credentials}` } }
  );
  return res.json();
}

// DELETE /api/admin/delete-file
// Body: { fileId: string, fileName: string }
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { fileId, fileName } = await req.json() as {
      fileId:   string;
      fileName: string;
    };

    const { authorizationToken, apiUrl } = await authorizeB2();

    const res = await fetch(`${apiUrl}/b2api/v3/b2_delete_file_version`, {
      method:  "POST",
      headers: {
        Authorization:  authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileId, fileName }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
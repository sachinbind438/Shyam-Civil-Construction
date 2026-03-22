// src/app/api/admin/clear-projects/route.ts
// ── Delete all existing projects ─────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";

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

// ── DELETE handler ───────────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  try {
    // Verify JWT token
    const auth = await verifyToken(request);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Delete all projects
    const result = await Project.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} projects successfully`,
      deletedCount: result.deletedCount
    });

  } catch (error: any) {
    console.error("Clear projects error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to clear projects" },
      { status: 500 }
    );
  }
}

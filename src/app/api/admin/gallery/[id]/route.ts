import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { GalleryImage } from "@/backend/db/models/GalleryImage"

// ── Verify JWT token ─────────────────────────────────────────────────
async function verifyToken(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret'
  
  if (!token) {
    return { success: false, error: "No authentication token" }
  }
  
  try {
    const jwt = require('jsonwebtoken')
    jwt.verify(token, JWT_SECRET)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Invalid token" }
  }
}

// ── DELETE handler ─────────────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check
    const auth = await verifyToken(request)
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      )
    }

    const { id } = await params
    
    await connectDB()
    await GalleryImage.findByIdAndDelete(id)
    
    return NextResponse.json({
      success: true
    })

  } catch (error: any) {
    console.error("Gallery DELETE error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete image" },
      { status: 500 }
    )
  }
}

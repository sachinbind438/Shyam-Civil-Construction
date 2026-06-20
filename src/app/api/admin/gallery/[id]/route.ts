import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/mongodb"
import { GalleryImage } from "@/backend/db/models/GalleryImage"
import cloudinary from "@/lib/cloudinary"

async function verifyToken(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret'
  if (!token) return { success: false, error: "No authentication token" }
  try {
    const jwt = require('jsonwebtoken')
    jwt.verify(token, JWT_SECRET)
    return { success: true }
  } catch {
    return { success: false, error: "Invalid token" }
  }
}

function extractPublicId(url: string): string | null {
  try {
    const pathParts = new URL(url).pathname.split('/')
    const uploadIndex = pathParts.findIndex(p => p === 'upload')
    if (uploadIndex === -1 || uploadIndex + 2 >= pathParts.length) return null
    return pathParts.slice(uploadIndex + 2).join('/').replace(/\.[^/.]+$/, '')
  } catch {
    return null
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyToken(request)
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    // Fetch first so we have the URL before deleting
    const image = await (GalleryImage as any).findById(id)
    if (!image) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 })
    }

    // Delete from Cloudinary
    if (image.url?.includes("res.cloudinary.com")) {
      const publicId = extractPublicId(image.url)
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: "image" })
      }
    }

    // Delete from MongoDB
    await (GalleryImage as any).findByIdAndDelete(id)

    revalidatePath("/")
    revalidatePath("/gallery")

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("Gallery DELETE error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete image" },
      { status: 500 }
    )
  }
}
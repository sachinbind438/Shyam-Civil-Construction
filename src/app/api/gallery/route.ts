import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { GalleryImage } from "@/backend/db/models/GalleryImage"

// ── Public GET handler — no auth required ─────────────────────────────
export async function GET(request: NextRequest) {
  try {
    // Handle build-time requests gracefully
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: { page: 1, limit: 50, total: 0, pages: 0 }
      })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    await connectDB()

    const images = await (GalleryImage as any).find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean() as any[]

    const total = await GalleryImage.countDocuments()

    // Clean URLs before returning
    const clean = (url: string) => (url ?? "").replace(/[\n\r\t]/g, "").trim()
    const cleanedImages = images.map((img: any) => ({
      ...img,
      id: img._id.toString(),
      url: clean(img.url)
    }))

    return NextResponse.json({
      success: true,
      data: cleanedImages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error("Public Gallery GET error:", error)
    
    // Return empty data instead of 500 error for build-time failures
    return NextResponse.json({
      success: true,
      data: [],
      pagination: { page: 1, limit: 50, total: 0, pages: 0 }
    })
  }
}

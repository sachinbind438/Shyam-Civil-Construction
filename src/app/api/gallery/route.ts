import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { GalleryImage } from "@/backend/db/models/GalleryImage"

// ── Public GET handler — no auth required ─────────────────────────────
export async function GET(request: NextRequest) {
  try {
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
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch gallery" },
      { status: 500 }
    )
  }
}

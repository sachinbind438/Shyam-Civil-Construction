import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { GalleryImage } from "@/backend/db/models/GalleryImage"

// ── Public GET handler ─────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const images = await GalleryImage.find({}).sort({ createdAt: -1 }).lean<any[]>()
    
    // Clean all URLs before returning:
    const clean = (url: string) => (url ?? "").replace(/[\n\r\t]/g, "").trim()
    const cleanedImages = images.map(img => ({ 
      ...img, 
      id: img._id.toString(), 
      url: clean(img.url) 
    }))
    
    return NextResponse.json({
      success: true,
      data: cleanedImages
    })

  } catch (error: any) {
    console.error("Public Gallery GET error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch gallery" },
      { status: 500 }
    )
  }
}

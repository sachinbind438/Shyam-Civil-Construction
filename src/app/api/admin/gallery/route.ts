import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { GalleryImage } from "@/backend/db/models/GalleryImage"
import { Project } from "@/backend/db/models/Project"

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

// ── GET handler ───────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    // Auth check
    const auth = await verifyToken(request)
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    await connectDB()
    
    // Use lean() and limit for better performance
    const images = await GalleryImage.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean<any[]>()
    
    // Get total count for pagination
    const total = await GalleryImage.countDocuments()
    
    return NextResponse.json({
      success: true,
      data: images,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error("Gallery GET error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch gallery" },
      { status: 500 }
    )
  }
}

// ── POST handler ──────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const auth = await verifyToken(request)
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Required fields: url
    const { url } = body
    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      )
    }

    // Clean url: body.url.replace(/[\n\r\t]/g,"").trim()
    const cleanedUrl = body.url.replace(/[\n\r\t]/g, "").trim()
    
    await connectDB()
    
    // Check for duplicate image in gallery
    const existingGalleryImage = await GalleryImage.findOne({ url: cleanedUrl })
    if (existingGalleryImage) {
      return NextResponse.json(
        { success: false, error: "This image already exists in the gallery" },
        { status: 409 }
      )
    }
    
    // Check for duplicate image in projects (coverImage or gallery)
    const existingProjectImage = await Project.findOne({
      $or: [
        { coverImage: cleanedUrl },
        { gallery: cleanedUrl }
      ]
    })
    if (existingProjectImage) {
      return NextResponse.json(
        { success: false, error: "This image already exists in a project" },
        { status: 409 }
      )
    }
    
    const image = await GalleryImage.create({ 
      url: cleanedUrl, 
      key: body.key ?? "" 
    })

    return NextResponse.json({
      success: true,
      data: image
    }, { status: 201 })

  } catch (error: any) {
    console.error("Gallery POST error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create gallery image" },
      { status: 500 }
    )
  }
}

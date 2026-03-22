// src/app/api/admin/import-projects/route.ts
// ── Import projects from Framer website ───────────────────────────────────────

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

// ── Project data from Framer website ───────────────────────────────────────────
const framerProjects = [
  {
    title: "Artistic Vessel Sink",
    slug: "artistic-vessel-sink",
    category: "Interior",
    description: "A sculptural vessel sink that combines artistic form with functional elegance. The sink features organic curves with a matte ceramic or brushed stone finish, creating a timeless centerpiece that serves as both a functional piece and a statement artwork. Contrasting smooth interior and textured exterior surfaces bring depth and character, emphasizing craftsmanship while maintaining contemporary appeal.",
    location: "Modern Bathroom",
    year: 2024,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      "https://images.unsplash.com/photo-1549611015-78affdd2a3d6?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ac7c9b67?w=800&q=80"
    ]
  },
  {
    title: "Sleek & Bright Kitchen Design",
    slug: "sleek-bright-kitchen-design",
    category: "Residential",
    description: "A modern kitchen characterized by sleek cabinetry with matte-finish panels in soft neutral tones, complemented by subtle wood accents and a waterfall-edge quartz countertop. The lighting design features recessed ceiling lights, pendant fixtures, and under-cabinet LED strips that create both functional illumination and ambient mood. Large windows flood the space with natural light, while integrated appliances and a central island with casual seating optimize the space for modern living.",
    location: "Residential Kitchen",
    year: 2024,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753426-3ab5b3a5f9ea?w=800&q=80"
    ]
  },
  {
    title: "Textured Rustic Wash Basin",
    slug: "textured-rustic-wash-basin",
    category: "Interior",
    description: "A rustic wash basin that combines textured natural materials with functional design. The basin features organic textures and earthy tones that bring warmth and character to the space, while maintaining practical functionality for daily use. The design balances rustic charm with modern convenience.",
    location: "Rustic Bathroom",
    year: 2024,
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      "https://images.unsplash.com/photo-1549611015-78affdd2a3d6?w=800&q=80"
    ]
  },
  {
    title: "ModernMint Kitchen",
    slug: "modernmint-kitchen",
    category: "Residential",
    description: "A contemporary kitchen featuring fresh mint accents and clean lines. The design combines modern functionality with a refreshing color palette, creating a vibrant yet sophisticated cooking space. Custom cabinetry, integrated appliances, and thoughtful storage solutions maximize efficiency while maintaining aesthetic appeal.",
    location: "Modern Home",
    year: 2024,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753426-3ab5b3a5f9ea?w=800&q=80"
    ]
  },
  {
    title: "Cozy Dining Lounge",
    slug: "cozy-dining-lounge",
    category: "Commercial",
    description: "An intimate dining space that combines comfort with elegance. The lounge features warm lighting, comfortable seating, and thoughtful details that create an inviting atmosphere for gatherings. The design balances intimacy with sophistication, making it perfect for both casual meals and formal entertaining.",
    location: "Commercial Dining Area",
    year: 2024,
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
      "https://images.unsplash.com/photo-1414235075426-7488c1200a7f?w=800&q=80"
    ]
  },
  {
    title: "Glass-Shower Serenity",
    slug: "glass-shower-serenity",
    category: "Interior",
    description: "A luxurious bathroom featuring a frameless glass shower design that creates a sense of openness and serenity. The space combines clean lines with premium materials, including high-end fixtures and thoughtful lighting that enhances the spa-like atmosphere. The design emphasizes both functionality and relaxation.",
    location: "Master Bathroom",
    year: 2024,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
      "https://images.unsplash.com/photo-1549611015-78affdd2a3d6?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ac7c9b67?w=800&q=80"
    ]
  },
  {
    title: "Minimalist Bedroom",
    slug: "minimalist-bedroom",
    category: "Residential",
    description: "A serene bedroom that embraces minimalist principles while maintaining warmth and comfort. The design features clean lines, neutral colors, and carefully selected furniture that creates a peaceful retreat. Thoughtful storage solutions and soft lighting enhance the sense of calm and order.",
    location: "Master Bedroom",
    year: 2024,
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1615529322900-f3b73a69227f?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1615529322900-f3b73a69227f?w=800&q=80",
      "https://images.unsplash.com/photo-1595576885985-3cd2a4e453c5?w=800&q=80"
    ]
  },
  {
    title: "Luxe Marble Living Room",
    slug: "luxe-marble-living-room",
    category: "Commercial",
    description: "An elegant living room featuring luxurious marble accents and sophisticated design elements. The space combines high-end materials with comfortable furnishings, creating a perfect balance between opulence and livability. Custom lighting and thoughtful details enhance the sense of luxury and refinement.",
    location: "Commercial Living Room",
    year: 2024,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1540518614846-7488c1200a7f?w=800&q=80",
      "https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80"
    ]
  },
  {
    title: "Marbled Modern Kitchen",
    slug: "marbled-modern-kitchen",
    category: "Commercial",
    description: "A sophisticated kitchen featuring marble countertops and backsplashes that define the space's luxurious character. The design combines modern functionality with classic materials, creating a timeless aesthetic. Custom cabinetry, high-end appliances, and thoughtful layout optimize both beauty and performance.",
    location: "Commercial Kitchen",
    year: 2024,
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1600566753426-3ab5b3a5f9ea?w=800&q=80"
    ]
  },
  {
    title: "Modern Kitchen with Open Shelves",
    slug: "modern-kitchen-with-open-shelves",
    category: "Residential",
    description: "A contemporary kitchen that incorporates open shelving for both functionality and visual interest. The design balances storage needs with display opportunities, featuring carefully arranged items that add personality to the space. Clean lines, modern appliances, and thoughtful lighting create a cohesive and practical cooking environment.",
    location: "Contemporary Kitchen",
    year: 2024,
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    ]
  }
];

// ── POST handler ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
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

    // Clear existing projects
    await Project.deleteMany({});

    // Import new projects
    const createdProjects = [];
    
    for (const projectData of framerProjects) {
      const project = await Project.create({
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      createdProjects.push({
        ...project.toObject(),
        id: project._id.toString()
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${createdProjects.length} projects from Framer`,
      projects: createdProjects
    });

  } catch (error: any) {
    console.error("Import projects error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to import projects" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";
import { verifyAuth } from "@/backend/middleware/auth";
import { validateProjectInput } from "@/backend/middleware/validate";
import { createProject } from "@/backend/services/projectService";

// ── GET paginated projects list ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "8"), 50);

    await connectDB();

    // Only select needed fields for list view - major performance boost
    const selectFields = "title slug category coverImage createdAt";

    const [projects, total] = await Promise.all([
      (Project as any)
        .find({})
        .select(selectFields)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Project.countDocuments(),
    ]);

    // Transform for JSON serialization
    const serializedProjects = projects.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      projects: serializedProjects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Admin projects GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// ── POST create new project ───────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      );
    }

    // Parse JSON body (not FormData - client sends JSON)
    const body = await request.json();
    
    // Validate input
    const validation = validateProjectInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    // Create project using service
    const project = await createProject(body);

    return NextResponse.json({
      success: true,
      data: project
    });

  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}

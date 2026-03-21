import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/backend/middleware/auth";
import { validateProjectInput } from "@/backend/middleware/validate";
import { createProject } from "@/backend/services/projectService";

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

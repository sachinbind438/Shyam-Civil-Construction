import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/backend/middleware/auth";
import { updateProject, deleteProject, getProjectById } from "@/backend/services/projectService";
import { validateProjectInput } from "@/backend/middleware/validate";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";

// ── GET project by ID ────────────────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
    }

    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// ── PATCH update project ──────────────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const validation = validateProjectInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    const project = await updateProject(id, body);

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

// ── DELETE project OR remove a single asset from project ──────────────────────
// If body contains { videoUrl } or { imageUrl } → remove that asset from the array
// If body is empty → delete the entire project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
    }

    const { id } = await params;

    // Try to parse body — may be empty for full project delete
    let body: { videoUrl?: string; imageUrl?: string } = {};
    try {
      body = await request.json();
    } catch {
      // no body — full delete
    }

    // ── Remove single asset ───────────────────────────────────────────────────
    if (body.videoUrl || body.imageUrl) {
      await connectDB();

      if (body.videoUrl) {
        await (Project as any).findByIdAndUpdate(id, {
          $pull: { videos: body.videoUrl },
        });
      }
      if (body.imageUrl) {
        await (Project as any).findByIdAndUpdate(id, {
          $pull: { gallery: body.imageUrl },
        });
      }

      return NextResponse.json({ success: true });
    }

    // ── Full project delete ───────────────────────────────────────────────────
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    await deleteProject(id);

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete project" },
      { status: 500 }
    );
  }
}
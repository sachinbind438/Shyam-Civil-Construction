import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";
import { GalleryImage } from "@/backend/db/models/GalleryImage";

// ── Clean URL helper ───────────────────────────────────────────────
function cleanUrl(url: string): string {
  return url.replace(/[\n\r\t]/g, "").trim();
}

// ── Generate slug from title ─────────────────────────────────────────
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Create new project ───────────────────────────────────────────────────
export async function createProject(data: any): Promise<any> {
  await connectDB();

  const slug = data.slug ? data.slug : generateSlug(data.title);

  const existingProject = await (Project as any).findOne({
    $or: [{ title: data.title }, { slug }],
  });

  if (existingProject) {
    throw new Error("A project with this title or URL slug already exists");
  }

  const coverImage    = cleanUrl(data.coverImage ?? "");
  const galleryImages = (data.gallery ?? []).map(cleanUrl).filter(Boolean);

  if (coverImage) {
    const existingGalleryImage = await (GalleryImage as any).findOne({ url: coverImage });
    if (existingGalleryImage) {
      throw new Error("The cover image already exists in the gallery");
    }
  }

  for (const galleryImage of galleryImages) {
    const existingGalleryImage = await (GalleryImage as any).findOne({ url: galleryImage });
    if (existingGalleryImage) {
      throw new Error(`An image already exists in the gallery: ${galleryImage}`);
    }
  }

  const cleanData = {
    ...data,
    slug,
    coverImage,
    gallery: galleryImages,
    videos: (data.videos ?? []).map(cleanUrl).filter(Boolean), // ← array
  };

  const project = await Project.create(cleanData);
  return { ...project.toObject(), id: project._id.toString() };
}

// ── Get project by ID ───────────────────────────────────────────────────
export async function getProjectById(id: string): Promise<any> {
  await connectDB();

  const project = await (Project as any).findById(id);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

// ── Update project ───────────────────────────────────────────────────────
export async function updateProject(id: string, data: any): Promise<any> {
  await connectDB();

  const project = await (Project as any).findById(id);

  if (!project) {
    throw new Error("Project not found");
  }

  if (data.title       !== undefined) project.title       = data.title;
  if (data.slug        !== undefined) project.slug        = data.slug;
  if (data.category    !== undefined) project.category    = data.category;
  if (data.description !== undefined) project.description = data.description;
  if (data.location    !== undefined) project.location    = data.location;
  if (data.year        !== undefined) project.year        = data.year;
  if (data.coverImage  !== undefined) project.coverImage  = cleanUrl(data.coverImage);
  if (data.gallery     !== undefined) project.gallery     = data.gallery.map(cleanUrl).filter(Boolean);

  // videos — replaces entire array; use $pull route for single removal
  if (data.videos !== undefined) {
    project.videos = data.videos.map(cleanUrl).filter(Boolean);
  }

  await project.save();

  return { ...project.toObject(), id: project._id.toString() };
}

// ── Delete project ───────────────────────────────────────────────────────
export async function deleteProject(id: string): Promise<void> {
  await connectDB();

  const project = await (Project as any).findById(id);

  if (!project) {
    throw new Error("Project not found");
  }

  await (Project as any).findByIdAndDelete(id);
}
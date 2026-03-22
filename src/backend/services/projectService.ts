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
  
  // Check for duplicate project by title or slug
  const existingProject = await Project.findOne({
    $or: [
      { title: data.title },
      { slug: slug }
    ]
  });
  
  if (existingProject) {
    throw new Error("A project with this title or URL slug already exists");
  }

  // Check for duplicate images in gallery
  const coverImage = cleanUrl(data.coverImage ?? "");
  const galleryImages = (data.gallery ?? []).map(cleanUrl).filter(Boolean);
  
  if (coverImage) {
    const existingGalleryImage = await GalleryImage.findOne({ url: coverImage });
    if (existingGalleryImage) {
      throw new Error("The cover image already exists in the gallery");
    }
  }

  for (const galleryImage of galleryImages) {
    const existingGalleryImage = await GalleryImage.findOne({ url: galleryImage });
    if (existingGalleryImage) {
      throw new Error(`An image already exists in the gallery: ${galleryImage}`);
    }
  }

  const cleanData = {
    ...data,
    slug: slug,
    coverImage: coverImage,
    gallery: galleryImages,
    video: data.video ? cleanUrl(data.video) : undefined,
  };

  const project = await Project.create(cleanData);

  return { ...project.toObject(), id: project._id.toString() };
}

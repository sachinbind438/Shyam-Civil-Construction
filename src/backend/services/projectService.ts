// src/backend/services/projectService.ts
import { connectDB } from "../db/connection";
import { Project }   from "../db/models/Project";

// ── Helpers ───────────────────────────────────────────────────────────────────
const cleanUrl = (url: string): string =>
  (url ?? "").replace(/[\n\r\t]/g, "").trim();

const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, "")
    .trim()
    .replace(/\s+/g, "-");

// ── Get all projects ──────────────────────────────────────────────────────────
export async function getAllProjects(options?: {
  category?: string;
  page?:     number;
  limit?:    number;
  featured?: boolean;
}): Promise<{ projects: any[]; total: number; pages: number }> {
  await connectDB();

  const { category, page = 1, limit = 10, featured } = options ?? {};

  // Build query object
  const query: any = {};
  if (category && category !== "all") query.category = category;
  if (featured !== undefined)         query.featured  = featured;

  // Get total count and projects in parallel
  const [total, projects] = await Promise.all([
    Project.countDocuments(query),
    Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<any[]>()
  ]);

  return {
    projects: projects.map(p => ({
      ...p,
      id:         p._id.toString(),
      coverImage: cleanUrl(p.coverImage ?? ""),
      gallery:    (p.gallery ?? []).map(cleanUrl).filter(Boolean),
      video:      p.video ? cleanUrl(p.video) : undefined,
    })),
    total,
    pages: Math.ceil(total / limit),
  };
}

// ── Get project by slug ───────────────────────────────────────────────────────
export async function getProjectBySlug(slug: string): Promise<any> {
  await connectDB();

  const p = await Project.findOne({ slug }).lean<any>();
  if (!p) return null;

  return {
    ...p,
    id:         p._id.toString(),
    coverImage: cleanUrl(p.coverImage ?? ""),
    gallery:    (p.gallery ?? []).map(cleanUrl).filter(Boolean),
    video:      p.video ? cleanUrl(p.video) : undefined,
  };
}

// ── Get project by ID ─────────────────────────────────────────────────────────
export async function getProjectById(id: string): Promise<any> {
  await connectDB();

  const p = await Project.findById(id).lean<any>();
  if (!p) return null;

  return {
    ...p,
    id:         p._id.toString(),
    coverImage: cleanUrl(p.coverImage ?? ""),
    gallery:    (p.gallery ?? []).map(cleanUrl).filter(Boolean),
    video:      p.video ? cleanUrl(p.video) : undefined,
  };
}

// ── Create project ────────────────────────────────────────────────────────────
export async function createProject(data: any): Promise<any> {
  await connectDB();

  const cleanData = {
    ...data,
    // ✅ Always generate slug from title (removed pre-save hook)
    slug:       data.slug ? data.slug : generateSlug(data.title),
    coverImage: cleanUrl(data.coverImage ?? ""),
    gallery:    (data.gallery ?? []).map(cleanUrl).filter(Boolean),
    video:      data.video ? cleanUrl(data.video) : undefined,
  };

  const project = await Project.create(cleanData);
  return { ...project.toObject(), id: project._id.toString() };
}

// ── Update project ────────────────────────────────────────────────────────────
export async function updateProject(id: string, data: any): Promise<any> {
  await connectDB();

  const cleanData = {
    ...data,
    coverImage: data.coverImage ? cleanUrl(data.coverImage) : undefined,
    gallery:    (data.gallery ?? []).map(cleanUrl).filter(Boolean),
    video:      data.video ? cleanUrl(data.video) : undefined,
  };

  const p = await Project.findByIdAndUpdate(
    id,
    cleanData,
    { new: true, runValidators: true }
  ).lean<any>();

  if (!p) return null;

  return { ...p, id: p._id.toString() };
}

// ── Delete project ────────────────────────────────────────────────────────────
export async function deleteProject(id: string): Promise<void> {
  await connectDB();
  await Project.findByIdAndDelete(id);
}

// ── Get featured projects ─────────────────────────────────────────────────────
export async function getFeaturedProjects(limit = 6): Promise<any[]> {
  await connectDB();

  // Build query object for featured projects
  const query = { featured: true };
  
  const projects = await Project.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<any[]>();

  return projects.map(p => ({
    ...p,
    id:         p._id.toString(),
    coverImage: cleanUrl(p.coverImage ?? ""),
    gallery:    (p.gallery ?? []).map(cleanUrl).filter(Boolean),
    video:      p.video ? cleanUrl(p.video) : undefined,
  }));
}

// ── Get project stats ─────────────────────────────────────────────────────────
export async function getProjectStats(): Promise<{
  total:      number;
  byCategory: Record<string, number>;
}> {
  await connectDB();

  const [total, categoryStats] = await Promise.all([
    Project.countDocuments(),
    Project.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]),
  ]);

  const byCategory = categoryStats.reduce(
    (acc: Record<string, number>, s: any) => {
      acc[s._id] = s.count;
      return acc;
    },
    {}
  );

  return { total, byCategory };
}
/**
 * src/data/projects.ts
 * Client-side types + serialiser for MongoDB → frontend
 */

export interface Section {
  id:      string;
  heading: string;
  body:    string;
  images:  string[];
}

export interface Project {
  id:               string;
  title:            string;
  slug:             string;
  category:         FilterCategory;
  description:      string;
  fullDescription?: string;
  thumbnail:        string;
  heroImage?:       string;
  images?:          string[];
  video?:           string;
  sections?:        Section[];
  featured?:        boolean;
}

export type FilterCategory =
  | "All"
  | "Residential"
  | "Commercial"
  | "Interior";

export const filterCategories: FilterCategory[] = [
  "All",
  "Residential",
  "Commercial",
  "Interior",
];

export function getFilteredProjects(
  projects: Project[],
  category: FilterCategory
): Project[] {
  if (category === "All") return projects;
  return projects.filter((p) => p.category === category);
}

// ── Strip \n \r \t from a URL ─────────────────────────────────────────────────
const cleanUrl = (url: string): string =>
  (url ?? "").replace(/[\n\r\t]/g, "").trim();

// ── Serialiser: MongoDB doc → Project ────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serialiseProject(doc: any): Project {

  const categoryMap: Record<string, FilterCategory> = {
    "residential":        "Residential",
    "Residential":        "Residential",
    "Residential Design": "Residential",
    "commercial":         "Commercial",
    "Commercial":         "Commercial",
    "Commercial Design":  "Commercial",
    "interior":           "Interior",
    "Interior":           "Interior",
    "Interior Design":    "Interior",
    "renovation":         "Commercial",
    "exterior":           "Commercial",
    "other":              "Commercial",
  };

  const mappedCategory = categoryMap[doc.category] ?? "Commercial";

  // ✅ Read both field names — admin form saves "thumbnail", old API saves "coverImage"
  const rawThumbnail =
    doc.thumbnail  ||
    doc.coverImage ||
    doc.heroImage  ||
    "/assets/projects-1.jpg";

  // ✅ cleanUrl strips any \n — THIS fixes the querySelector error
  const thumbnail = cleanUrl(rawThumbnail);

  // ✅ Clean all image URLs in the gallery array
  const rawImages: string[] = doc.images ?? doc.gallery ?? [];
  const images = rawImages.map(cleanUrl).filter(Boolean);

  return {
    id:              doc._id.toString(),
    title:           doc.title           ?? "",
    slug:            doc.slug            ?? "",
    category:        mappedCategory,
    description:     doc.description     ?? "",
    fullDescription: doc.fullDescription ?? doc.description ?? "",
    thumbnail,
    heroImage:       thumbnail,
    images,
    video:           doc.video ? cleanUrl(doc.video) : undefined,
    sections:        doc.sections ?? [],
    featured:        doc.featured ?? false,
  };
}
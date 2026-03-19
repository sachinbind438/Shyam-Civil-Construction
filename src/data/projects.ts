/**
 * data/projects.ts
 *
 * ─ Client-side: exports types, FilterCategory, filterCategories
 * ─ Server-side: use the helper functions below to fetch from MongoDB
 *
 * The static `projects` array has been REMOVED.
 * All data now lives in MongoDB (shyamcivil.projects collection).
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Section {
  id:      string;
  heading: string;
  body:    string;
  images:  string[];
}

/**
 * Project — the shape components expect.
 * Matches what ProjectCard, AllProjects, and ProjectDetail consume.
 */
export interface Project {
  id:               string;   // MongoDB _id serialised to string
  title:            string;
  slug:             string;
  category:         FilterCategory;
  description:      string;
  fullDescription?: string;
  thumbnail:        string;   // card image + hero fallback
  heroImage?:       string;
  images?:          string[]; // detail gallery
  video?:           string;
  sections?:        Section[];
  featured?:        boolean;
}

// ── Filter categories — used by FilterTabs & AllProjects ──────────────────────

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

// ── Client-side filter helper (used inside AllProjects.tsx) ───────────────────
// projects array is passed in from the server component — no DB call here.

export function getFilteredProjects(
  projects: Project[],
  category: FilterCategory
): Project[] {
  if (category === "All") return projects;
  return projects.filter((p) => p.category === category);
}

// ── Serialiser: converts Mongoose lean doc → Project ─────────────────────────
// Call this in server components after fetching with .lean<any[]>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serialiseProject(doc: any): Project {
  // Map database categories to frontend display categories
  const categoryMap: Record<string, FilterCategory> = {
    'residential': 'Residential',
    'commercial': 'Commercial', 
    'interior': 'Interior',
    'renovation': 'Commercial', // Map renovation to commercial for now
    'exterior': 'Commercial',   // Map exterior to commercial for now
    'other': 'Commercial'       // Map other to commercial for now
  };
  
  const mappedCategory = categoryMap[doc.category] || 'Commercial';
  
  return {
    id:              doc._id.toString(),
    title:           doc.title,
    slug:            doc.slug,
    category:        mappedCategory,
    description:     doc.description,
    fullDescription: doc.description, // Use description as fullDescription
    thumbnail:       doc.coverImage || "/assets/projects-1.jpg",
    heroImage:       doc.coverImage,
    images:          doc.gallery || [],
    video:           doc.video,
    sections:        [],
    featured:        false,
  };
}

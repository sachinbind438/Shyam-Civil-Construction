export interface Project {
  id:          string;
  title:       string;
  slug:        string;
  category:    ProjectCategory;
  description: string;
  location:    string;
  year:        number;
  coverImage:  string;
  gallery:     string[];
  video?:      string;
  featured:    boolean;
  views:       number;
  createdAt:   string;
  updatedAt:   string;
}

export type ProjectCategory = "Residential" | "Commercial" | "Interior";

export type FilterCategory = "All" | ProjectCategory;

export interface CreateProjectInput {
  title:       string;
  category:    string;
  description: string;
  location:    string;
  year:        number;
  coverImage:  string;
  gallery?:    string[];
  video?:      string;
  featured?:   boolean;
}

export function serialiseProject(doc: any): Project {
  const clean = (url: string) => (url ?? "").replace(/[\n\r\t]/g,"").trim()
  return {
    id:          doc._id.toString(),
    title:       doc.title ?? "",
    slug:        doc.slug  ?? "",
    category:    doc.category as ProjectCategory,
    description: doc.description ?? "",
    location:    doc.location ?? "",
    year:        doc.year ?? new Date().getFullYear(),
    coverImage:  clean(doc.coverImage ?? doc.thumbnail ?? ""),
    gallery:     (doc.gallery ?? doc.images ?? []).map(clean).filter(Boolean),
    video:       doc.video ? clean(doc.video) : undefined,
    featured:    doc.featured ?? false,
    views:       doc.views ?? 0,
    createdAt:   doc.createdAt?.toString() ?? "",
    updatedAt:   doc.updatedAt?.toString() ?? "",
  }
}

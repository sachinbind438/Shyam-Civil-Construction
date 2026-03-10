/**
 * CMS Collection: Projects
 * This data structure represents projects from a CMS like Webflow, Contentful, etc.
 * Fields: title, slug, category, thumbnail, description
 */

export type ProjectCategory = "Interior Design" | "Residential Design" | "Commercial Design";

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  thumbnail: string;
  description?: string;
}

// Mock CMS data - Replace with real CMS fetches
export const projectsData: Project[] = [
  {
    id: "1",
    title: "Modern Minimalist Penthouse",
    slug: "modern-minimalist-penthouse",
    category: "Residential Design",
    thumbnail: "/assets/Service.avif",
    description: "A sleek urban penthouse with minimalist interiors and panoramic city views.",
  },
  {
    id: "2",
    title: "Luxury Spa & Wellness Center",
    slug: "luxury-spa-wellness",
    category: "Commercial Design",
    thumbnail: "/assets/Service.avif",
    description: "Contemporary spa design with natural materials and calming aesthetics.",
  },
  {
    id: "3",
    title: "Elegant Master Suite Renovation",
    slug: "elegant-master-suite",
    category: "Interior Design",
    thumbnail: "/assets/Service.avif",
    description: "Complete bedroom renovation with custom lighting and upholstered accents.",
  },
  {
    id: "4",
    title: "Corporate Office Headquarters",
    slug: "corporate-office",
    category: "Commercial Design",
    thumbnail: "/assets/Service.avif",
    description: "Multi-floor office space with collaborative zones and executive areas.",
  },
  {
    id: "5",
    title: "Coastal Villa Design",
    slug: "coastal-villa",
    category: "Residential Design",
    thumbnail: "/assets/Service.avif",
    description: "Oceanfront villa with open-plan living and seamless indoor-outdoor flow.",
  },
  {
    id: "6",
    title: "Kitchen & Dining Transformation",
    slug: "kitchen-dining-transform",
    category: "Interior Design",
    thumbnail: "/assets/Service.avif",
    description: "Contemporary kitchen remodel with premium finishes and custom cabinetry.",
  },
  {
    id: "7",
    title: "Boutique Hotel Lobby",
    slug: "boutique-hotel-lobby",
    category: "Commercial Design",
    thumbnail: "/assets/Service.avif",
    description: "Luxurious hotel entrance with artistic installations and ambient lighting.",
  },
  {
    id: "8",
    title: "Smart Home Living Room",
    slug: "smart-home-living",
    category: "Residential Design",
    thumbnail: "/assets/Service.avif",
    description: "Integrated smart home technology with modern furniture and automation.",
  },
  {
    id: "9",
    title: "Retail Store Branding Experience",
    slug: "retail-store-branding",
    category: "Commercial Design",
    thumbnail: "/assets/Service.avif",
    description: "Branded retail space with custom displays and immersive customer experience.",
  },
];

export const filterCategories = [
  "All Projects",
  "Interior Design",
  "Residential Design",
  "Commercial Design",
] as const;

export type FilterCategory = (typeof filterCategories)[number];

/**
 * Get projects filtered by category
 */
export function getFilteredProjects(
  category: FilterCategory
): Project[] {
  if (category === "All Projects") {
    return projectsData;
  }
  return projectsData.filter((project) => project.category === category);
}

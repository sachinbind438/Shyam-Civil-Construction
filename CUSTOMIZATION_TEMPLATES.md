/**
 * CUSTOMIZATION TEMPLATES
 * 
 * Copy these code snippets to customize the Projects component
 * for your specific design needs
 */

// ============================================
// 1. CUSTOM COLOR SCHEME
// ============================================

/*
 * File: src/components/Projects/FilterTabs.tsx
 * 
 * Replace the className in the button with:
 */

// DARK MODE (dark gray text, blue underline)
className={`
  relative pb-2 text-sm md:text-base font-medium transition-colors duration-300 ${
    isActive
      ? "text-white font-bold"
      : "text-gray-400 hover:text-gray-100"
  }
`}

// Underline color change:
// className="absolute -bottom-[22px] left-0 right-0 h-1 bg-blue-500 rounded-full"

// ============================================
// 2. CUSTOM GRID LAYOUT
// ============================================

/*
 * File: src/components/Projects/AllProjects.tsx
 * 
 * 4 columns on desktop, 2 on tablet, 1 on mobile:
 */

className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"

// Masonry layout (using CSS columns):
className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8"

// With auto layout and min size:
className="grid auto-cols-minmax(250px, 1fr) gap-6"

// ============================================
// 3. CUSTOM CARD ANIMATIONS
// ============================================

/*
 * File: src/components/Projects/ProjectCard.tsx
 * 
 * Slower stagger animation:
 */

initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8, delay: index * 0.1 }}  // Changed from .5s to .8s and .05 to .1

// Slide in from left:
initial={{ opacity: 0, x: -30 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.5, delay: index * 0.05 }}

// Pop/bounce animation:
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ 
  duration: 0.5, 
  delay: index * 0.05,
  type: "spring",
  stiffness: 200,
  damping: 20
}}

// ============================================
// 4. CUSTOM HOVER EFFECTS
// ============================================

/*
 * File: src/components/Projects/ProjectCard.tsx
 * 
 * Brighten image on hover (no scale):
 */

className="relative h-full w-full group-hover:brightness-110 transition-all duration-500"

// Blur/Focus effect:
className="relative h-full w-full group-hover:blur-sm transition-all duration-500"

// Sepia tint on hover:
<motion.div
  initial={{ opacity: 0 }}
  whileHover={{ opacity: 1 }}
  className="absolute inset-0 bg-amber-700/30"
/>

// Custom overlay gradient:
className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-700 to-black"

// ============================================
// 5. CUSTOM CARD HEIGHT & ASPECT RATIO
// ============================================

/*
 * File: src/components/Projects/ProjectCard.tsx
 * 
 * Use aspect ratio instead of fixed height:
 */

className="group relative aspect-square overflow-hidden rounded-[16px] bg-gray-100"

// 16:9 aspect ratio:
className="group relative aspect-video overflow-hidden rounded-[16px] bg-gray-100"

// 4:3 aspect ratio:
className="group relative aspect-[4/3] overflow-hidden rounded-[16px] bg-gray-100"

// Fixed height that's responsive:
className="group relative h-[250px] md:h-[360px] lg:h-[450px] overflow-hidden rounded-[16px]"

// ============================================
// 6. CUSTOM TEXT STYLING
// ============================================

/*
 * File: src/components/Projects/AllProjects.tsx
 * 
 * Different heading style:
 */

// San-serif heading:
<h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-black text-gray-900">

// Smaller heading with different weight:
<h1 className="text-3xl md:text-4xl font-serif font-normal text-black tracking-wide">

// Subtitle styling:
<p className="text-sm md:text-base text-gray-500 max-w-3xl leading-relaxed">

// ============================================
// 7. CUSTOM TAB STYLING
// ============================================

/*
 * File: src/components/Projects/FilterTabs.tsx
 * 
 * Rounded pill-style tabs:
 */

className="px-4 py-2 rounded-full bg-gray-100 text-gray-700"

// Solid underline instead of border:
className="pb-3 border-b-2 border-transparent group-hover:border-gray-300"

// Top line instead of bottom:
<motion.div
  layoutId="topline"
  className="absolute -top-[22px] left-0 right-0 h-1 bg-black rounded-full"
/>

// Full width underline:
<motion.div
  layoutId="underline"
  className="absolute -bottom-[22px] left-0 right-0 h-2 bg-black"
/>

// ============================================
// 8. ADD PAGINATION
// ============================================

/*
 * File: src/components/Projects/AllProjects.tsx
 * 
 * Add to component state:
 */

import { useState, useMemo } from "react";

const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 6;

const paginatedProjects = useMemo(() => {
  const startIdx = (currentPage - 1) * itemsPerPage;
  return filteredProjects.slice(startIdx, startIdx + itemsPerPage);
}, [filteredProjects, currentPage]);

const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

// Add pagination controls:
{totalPages > 1 && (
  <div className="flex justify-center gap-4 mt-12">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(p => p - 1)}
      className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
    >
      Previous
    </button>
    <span className="flex items-center">{currentPage} of {totalPages}</span>
    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(p => p + 1)}
      className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

// ============================================
// 9. ADD SEARCH FUNCTIONALITY
// ============================================

/*
 * File: src/components/Projects/AllProjects.tsx
 */

const [searchQuery, setSearchQuery] = useState("");

const filteredProjects = useMemo(() => {
  let projects = getFilteredProjects(activeFilter);
  
  if (searchQuery) {
    projects = projects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  return projects;
}, [activeFilter, searchQuery]);

// Add search input:
<motion.div className="mb-8">
  <input
    type="text"
    placeholder="Search projects..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
  />
</motion.div>

// ============================================
// 10. CUSTOM "EMPTY STATE" MESSAGE
// ============================================

/*
 * File: src/components/Projects/AllProjects.tsx
 */

{filteredProjects.length === 0 && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20"
  >
    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <p className="text-lg text-gray-500">No projects found</p>
    <p className="text-sm text-gray-400">Try adjusting your filters</p>
  </motion.div>
)}

// ============================================
// 11. ADD LOADING SKELETON
// ============================================

/*
 * Create: src/components/Projects/ProjectSkeleton.tsx
 */

export const ProjectSkeleton = () => (
  <div className="h-[360px] rounded-[16px] bg-gray-200 animate-pulse" />
);

// Use in AllProjects.tsx:
{isLoading && (
  <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {[...Array(9)].map((_, i) => <ProjectSkeleton key={i} />)}
  </motion.div>
)}

// ============================================
// 12. ADD CATEGORY BADGES ON CARDS
// ============================================

/*
 * File: src/components/Projects/ProjectCard.tsx
 * 
 * Add before title overlay:
 */

<motion.div
  initial={{ opacity: 0 }}
  whileHover={{ opacity: 1 }}
  className="absolute top-4 right-4 z-10 px-3 py-1 bg-white/90 rounded-full text-xs font-semibold text-black"
>
  {project.category}
</motion.div>

// ============================================
// 13. BLUR BACKGROUND ON FILTER CHANGE
// ============================================

/*
 * File: src/components/Projects/AllProjects.tsx
 */

<motion.div
  initial={{ opacity: 1 }}
  animate={{ opacity: filterTransitioning ? 0.5 : 1 }}
  transition={{ duration: 0.3 }}
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
>
  {/* Grid content */}
</motion.div>

// ============================================
// 14. REDIRECT TO PROJECT DETAIL PAGE
// ============================================

/*
 * File: src/components/Projects/ProjectCard.tsx
 * 
 * Wrap with Link:
 */

import Link from "next/link";

<Link href={`/projects/${project.slug}`}>
  <motion.article
    // ... rest of card component
  >
    {/* Card content */}
  </motion.article>
</Link>

// ============================================
// 15. LAZY LOAD IMAGES
// ============================================

/*
 * File: src/components/Projects/ProjectCard.tsx
 * 
 * Add loading="lazy" to Image:
 */

<Image
  src={project.thumbnail}
  alt={project.title}
  fill
  className="object-cover transition-transform duration-500 group-hover:scale-110"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
  priority={index < 3}
/>

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilterCategory,
  getFilteredProjects,
  Project,
} from "./../../data/projects";
import { ProjectCard } from "./ProjectCard";
import { FilterTabs } from "./FilterTabs";
import { Pagination } from "./Pagination";

interface AllProjectsProps {
  projects: Project[];
}

export const AllProjects = ({ projects }: AllProjectsProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = useMemo(
    () => getFilteredProjects(projects, activeFilter),
    [projects, activeFilter]
  );

  // Pagination logic
  const PROJECTS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: FilterCategory) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of projects grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  return (
    <section className="bg-white">
      <div className="px-4 md:px-8 lg:px-12 flex flex-col gap-8 md:gap-10 lg:gap-12">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 md:gap-6 max-w-3xl"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-semibold text-black">
            All Projects
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Explore our diverse portfolio of innovative and inspiring architectural designs.
          </p>
        </motion.div>

        {/* FILTER */}
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        {/* PROJECTS COUNT */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {Math.min(startIndex + 1, filteredProjects.length)}-{Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} projects
            {activeFilter !== "All" && ` in ${activeFilter}`}
          </p>
        </div>

        {/* GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {currentProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* EMPTY STATE */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <p className="text-sm md:text-base text-gray-500">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
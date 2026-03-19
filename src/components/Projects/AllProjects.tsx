"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilterCategory,
  filterCategories,
  getFilteredProjects,
  Project,
} from "./../../data/projects";
import { ProjectCard } from "./ProjectCard";
import { FilterTabs } from "./FilterTabs";

interface AllProjectsProps {
  /** Passed in from the server page component — already fetched from MongoDB */
  projects: Project[];
}

export const AllProjects = ({ projects }: AllProjectsProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");

  // Filter on the client — no extra DB call needed
  const filteredProjects = useMemo(
    () => getFilteredProjects(projects, activeFilter),
    [projects, activeFilter]
  );

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  return (
    <section className="bg-white">
      <div className="px-12 gap-12 flex flex-col">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="gap-6 flex flex-col"
        >
          <h2 className="text-[48px] md:text-[72px] text-left! leading-tight font-Raleway! text-black">
            All Projects
          </h2>
          <p className="text-[18px]! md:text-[18px] text-gray-600 max-w-[700px]">
            Explore our diverse portfolio of innovative and inspiring
            architectural designs.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <p className="text-lg text-gray-500">
              No projects found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
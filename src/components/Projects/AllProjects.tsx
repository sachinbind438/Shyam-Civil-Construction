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

interface AllProjectsProps {
  projects: Project[];
}

export const AllProjects = ({ projects }: AllProjectsProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");

  const filteredProjects = useMemo(
    () => getFilteredProjects(projects, activeFilter),
    [projects, activeFilter]
  );

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
          onFilterChange={setActiveFilter}
        />

        {/* GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

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
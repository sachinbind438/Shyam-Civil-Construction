"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterCategory, getFilteredProjects } from "./../../data/projects";
import { ProjectCard } from "./ProjectCard";
import { FilterTabs } from "./FilterTabs";

export const AllProjects = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All Projects");

  // Get filtered projects based on active category
  const filteredProjects = useMemo(
    () => getFilteredProjects(activeFilter),
    [activeFilter]
  );

  const handleFilterChange = (category: FilterCategory) => {
    setActiveFilter(category);
  };

  // Stagger container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section className="min-h-screen bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-black mb-4 leading-tight">
            All Projects
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Explore our diverse portfolio of innovative and inspiring
            architectural designs.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="mb-12 md:mb-16">
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
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

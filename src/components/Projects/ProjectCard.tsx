"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "./../../data/projects";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export const ProjectCard = ({ project, index = 0 }: ProjectCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative h-[360px] overflow-hidden rounded-2xl bg-gray-100"
    >
      {/* Image Container */}
      <motion.div className="relative h-full w-full">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={index < 3}
        />

        {/* Dark Gradient Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"
        />

        {/* Title Overlay - Appears on Hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 flex flex-col justify-end p-6"
        >
          <h3 className="text-lg md:text-xl font-bold text-white">
            {project.title}
          </h3>
          {project.description && (
            <p className="mt-2 text-sm text-gray-200 line-clamp-2">
              {project.description}
            </p>
          )}
        </motion.div>
      </motion.div>
    </motion.article>
  );
};

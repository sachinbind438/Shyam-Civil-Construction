"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "./../../data/projects";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export const ProjectCard = ({ project, index = 0 }: ProjectCardProps) => {
  const wrapperRounded =
    "rounded-tr-[72px] rounded-bl-[72px] group-hover:rounded-[72px]";

  return (
    <Link href={`/projects/${project.slug}`} className="block">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className={`group relative isolate cursor-pointer transition-all duration-300 transform-gpu 
        h-[260px] sm:h-[300px] md:h-[340px] lg:h-[360px] ${wrapperRounded}`}
      >
        {/* IMAGE */}
        <div
          className={`relative w-full h-full overflow-hidden ${wrapperRounded}`}
        >
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105`}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={index < 3}
          />
        </div>

        {/* OVERLAY (always visible on mobile, hover on desktop) */}
        <div
          className={`absolute inset-0 bg-black/40 md:bg-black/50 
          opacity-100 md:opacity-0 md:group-hover:opacity-100 
          transition-opacity duration-300 ${wrapperRounded}`}
        />

        {/* TITLE */}
        <div
          className="
          absolute inset-0 flex items-center justify-center text-white font-semibold 
          text-base sm:text-lg md:text-xl px-4 text-center
          
          opacity-100 md:opacity-0 md:group-hover:opacity-100
          transition-opacity duration-300
        "
        >
          {project.title}
        </div>

        {/* ARROW */}
        <div
          className="
          absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-10 md:right-10
          w-10 h-10 md:w-12 md:h-12 
          bg-white rounded-full flex items-center justify-center text-black shadow-md
          
          opacity-100 md:opacity-0 
          md:translate-x-6 md:translate-y-6
          md:group-hover:translate-x-0 md:group-hover:translate-y-0 md:group-hover:opacity-100
          
          transition-all duration-300
        "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4 md:w-5 md:h-5"
          >
            <path d="M5 12h14" strokeLinecap="round" />
            <path d="M12 5l7 7-7 7" strokeLinecap="round" />
          </svg>
        </div>
      </motion.article>
    </Link>
  );
};
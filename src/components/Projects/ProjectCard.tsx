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
  // re-use same rounded corner shape as ImageCard
  const wrapperRounded = "rounded-tr-[72px] rounded-bl-[72px] group-hover:rounded-[72px]";

  return (
    <Link href={`/projects/${project.slug}`} className="contents">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className={`group relative isolate cursor-pointer transition-all duration-300 transform-gpu h-[360px] ${wrapperRounded}`}
      >
      {/* Image wrapper */}
      <div
        className={`relative w-full h-full overflow-hidden ${wrapperRounded} z-0 transition-transform duration-300 transform-gpu`}
      >
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className={`object-cover z-0 transition-all duration-300 group-hover:scale-105 ${wrapperRounded}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={index < 3}
        />
      </div>

      {/* Dark overlay */}
      <div
        className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-shadow duration-300 ${wrapperRounded}`}
      />

      {/* Title & description centered */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white! text-lg md:text-xl  opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
        {project.title}
       
      </div>

      {/* Circular arrow button (bottom-right) */}
      <div className="absolute bottom-10 right-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-md opacity-0 translate-x-6 translate-y-6 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
        >
          <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M12 5l7 7-7 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </motion.article>
    </Link>
  );
};

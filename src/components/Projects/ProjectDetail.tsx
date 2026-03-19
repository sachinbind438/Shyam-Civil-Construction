"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "../../data/projects";
import Button from "../button/button";

interface ProjectDetailProps {
  project: Project;
}

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {/* Hero Section with Main Image */}
      <section className="relative w-full  h-[calc(100vh-48px)] overflow-hidden">
        {project.thumbnail && (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
      </section>

      {/* Project Info Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <motion.div {...fadeInUp} className="mb-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Projects
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-black mb-4">
                {project.title}
              </h1>
              <p className="text-gray-600 text-lg">{project.category}</p>
            </div>


          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-12">
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              {project.fullDescription || project.description}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Image Gallery Section */}
      {project.images && project.images.length > 1 && (
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-7xl font-Raleway! font-bold text-black mb-12"
            >
              Project Gallery
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.images?.filter(Boolean).map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative h-[400px] rounded-tr-[72px] rounded-bl-[72px] overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {project.video && (
        <section className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-7xl font-Raleway! font-bold text-black mb-12"
          >
            Project Video
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative w-full aspect-video rounded-tr-[72px] rounded-bl-[72px] overflow-hidden bg-black"
          >
            <iframe
              src={project.video}
              title={`${project.title} - Project Video`}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </motion.div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-black text-white rounded-tr-[72px] rounded-bl-[72px] p-12 md:p-16 text-center"
        >
          <h2 className="text-white! text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-gray-300! text-lg mb-8 max-w-2xl mx-auto">
            Let's create something extraordinary together. Get in touch with our
            team today.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 bg-white text-black  rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            <Button text="Get In Touch" className="p-3 " size="md" />
          </Link>
        </motion.div>
      </section>
    </motion.main>
  );
};

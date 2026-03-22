"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "../../data/projects";
import Button from "../button/button";
import { useState } from "react";

interface ProjectDetailProps {
  project: Project;
}

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!project.images || selectedImageIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex((prev) => 
        prev === 0 ? project.images!.length - 1 : prev! - 1
      );
    } else {
      setSelectedImageIndex((prev) => 
        prev === project.images!.length - 1 ? 0 : prev! + 1
      );
    }
  };

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
      <section className="max-w-6xl mx-auto p-10">
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

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-5">
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
        <section className="bg-gray-50 p-15">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-7xl font-Raleway! font-bold text-black mb-12"
            >
              Project Gallery
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {project.images?.filter(Boolean).map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative h-[400px] rounded-tr-[72px] rounded-bl-[72px] overflow-hidden group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Hover overlay with zoom icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg 
                        className="w-6 h-6 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {project.video && (
        <section className="max-w-6xl mx-auto p-5">
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
      <section className="max-w-6xl mx-auto p-5">
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

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && project.images && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation buttons */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image counter */}
          {project.images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {selectedImageIndex + 1} / {project.images.length}
            </div>
          )}

          {/* Main image */}
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <Image
              src={project.images[selectedImageIndex]}
              alt={`${project.title} - Image ${selectedImageIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </motion.main>
  );
};

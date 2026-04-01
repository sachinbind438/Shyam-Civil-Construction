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

// 🔥 shimmer blur (BEST PRACTICE)
const shimmer = `
<svg width="700" height="475" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f3f3"/>
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);

  const navigateImage = (direction: "prev" | "next") => {
    if (!project.images || selectedImageIndex === null) return;

    if (direction === "prev") {
      setSelectedImageIndex((prev) =>
        prev === 0 ? project.images!.length - 1 : prev! - 1
      );
    } else {
      setSelectedImageIndex((prev) =>
        prev === project.images!.length - 1 ? 0 : prev! + 1
      );
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white"
    >
      {/* 🔥 HERO */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer)}`}
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </section>

      {/* 📌 INFO */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 py-10 md:py-16">
        <Link
          href="/projects"
          className="text-gray-600 hover:text-black mb-6 inline-block"
        >
          ← Back to Projects
        </Link>

        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
          {project.title}
        </h1>

        <p className="text-gray-500 mb-6">{project.category}</p>

        <p className="text-gray-700 leading-relaxed max-w-3xl text-sm md:text-base">
          {project.fullDescription || project.description}
        </p>
      </section>

      {/* 🖼️ GALLERY */}
      {project.images && project.images.length > 1 && (
        <section className="bg-gray-50 py-10 md:py-16 px-4 md:px-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-10">
              Project Gallery
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className="relative h-[250px] md:h-[400px] rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover hover:scale-105 transition duration-500"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer)}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🎥 VIDEO */}
      {project.video && (
        <section className="max-w-6xl mx-auto px-4 md:px-10 py-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Project Video
          </h2>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
            <iframe
              src={project.video}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* 🚀 CTA */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 lg:py-20">
        <div className="bg-black text-white rounded-4xl p-8 md:p-10 lg:p-14 text-center">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>

          <p className="text-gray-300 mb-6 text-base md:text-xl">
            Let's create something extraordinary together.
          </p>

          <Button text="Get In Touch" href="/contact" variant="light" />
        </div>
      </section>

      {/* 🔍 LIGHTBOX */}
      {selectedImageIndex !== null && project.images && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* IMAGE WITH SWIPE */}
          <motion.div
            className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100) navigateImage("prev");
              if (info.offset.x < -100) navigateImage("next");
            }}
          >
            <Image
              src={project.images[selectedImageIndex]}
              alt=""
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer)}`}
            />
          </motion.div>

          {/* CLOSE */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-2xl z-50"
          >
            ✕
          </button>

          {/* NAV */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("prev");
                }}
                className="absolute left-4 text-white text-3xl"
              >
                ‹
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("next");
                }}
                className="absolute right-4 text-white text-3xl"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </motion.main>
  );
};
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "../../data/projects";
import Button from "../button/button";
import { ProjectCard } from "./ProjectCard";
import { useState, useRef, useEffect, useCallback } from "react";

interface ProjectDetailProps {
  project: Project;
  otherProjects?: Project[];
}

const shimmer = `
<svg width="700" height="475" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f3f3"/>
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

// ─── 🎵 Cloudinary audio URL ───────────────────────────────────────────────
const THEME_AUDIO_URL =
  "https://res.cloudinary.com/dkj5mg4a0/video/upload/v1781795976/creative-industry-corporate-electronic-synth-pop_og5ego.mp3";

export const ProjectDetail = ({
  project,
  otherProjects,
}: ProjectDetailProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const pausingAllRef = useRef(false);

  const pauseOthers = useCallback((exceptIndex: number) => {
    if (pausingAllRef.current) return;
    pausingAllRef.current = true;
    videoRefs.current.forEach((v, i) => {
      if (i !== exceptIndex && v && !v.paused) {
        v.pause();
      }
    });
    pausingAllRef.current = false;
  }, []);

  useEffect(() => {
    const audio = new Audio(THEME_AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.5;
    audio.muted = false;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    if (!videos.length || !audioRef.current) return;

    const cleanups: (() => void)[] = [];

    videos.forEach((video, index) => {
      const onPlay = () => {
        pauseOthers(index);
        setActiveVideoIndex(index);
        audioRef.current?.play().catch(() => {});
      };

      const onPause = () => {
        if (pausingAllRef.current) return;
        const anyPlaying = videoRefs.current.some((v) => v && !v.paused);
        if (!anyPlaying) {
          audioRef.current?.pause();
          if (audioRef.current) audioRef.current.currentTime = 0;
          setActiveVideoIndex(-1);
        }
      };

      const onEnded = () => {
        audioRef.current?.pause();
        if (audioRef.current) audioRef.current.currentTime = 0;
        setActiveVideoIndex(-1);
      };

      video.addEventListener("play", onPlay);
      video.addEventListener("pause", onPause);
      video.addEventListener("ended", onEnded);
      cleanups.push(() => {
        video.removeEventListener("play", onPlay);
        video.removeEventListener("pause", onPause);
        video.removeEventListener("ended", onEnded);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [project.videos, pauseOthers]);

  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);
  const navigateImage = (direction: "prev" | "next") => {
    if (!project.images || selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      direction === "prev"
        ? prev === 0
          ? project.images!.length - 1
          : prev! - 1
        : prev === project.images!.length - 1
          ? 0
          : prev! + 1,
    );
  };

  const hasVideos = project.videos && project.videos.length > 0;

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white"
    >
      {/* HERO */}
      <section className="relative w-full h-[45vh] sm:h-[55vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer)}`}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </section>

      {/* INFO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-16">
        <Link
          href="/projects"
          className="text-sm sm:text-base text-gray-600 hover:text-black mb-4 sm:mb-6 inline-block"
        >
          ← Back to Projects
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
          {project.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
          {project.category}
        </p>
        <p className="text-gray-700 leading-relaxed max-w-3xl text-sm sm:text-base">
          {project.fullDescription || project.description}
        </p>
      </section>

      {/* GALLERY + VIDEOS */}
      {((project.images && project.images.length > 1) || hasVideos) && (
        <section className="bg-gray-50 py-8 sm:py-10 md:py-16 px-4 sm:px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            {project.images && project.images.length > 1 && (
              <>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-10">
                  Project Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
                  {project.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-[220px] sm:h-[280px] md:h-[350px] lg:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer"
                      onClick={() => openLightbox(index)}
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        className="object-cover hover:scale-105 transition duration-500"
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer)}`}
                        sizes="(max-width: 840px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {hasVideos && (
              <div
                className={
                  project.images && project.images.length > 1
                    ? "mt-12 sm:mt-16 md:mt-24"
                    : ""
                }
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-10">
                  Project {project.videos!.length > 1 ? "Videos" : "Video"}
                </h2>

                {/* Video list — one plays at a time */}
                <div className="space-y-5 sm:space-y-6 md:space-y-8 max-w-3xl mx-auto">
                  {project.videos!.map((video, index) => {
                    const isEmbed =
                      video.includes("youtube") || video.includes("vimeo");
                    const isActive = activeVideoIndex === index;

                    return (
                      <div
                        key={index}
                        className={`relative w-full rounded-xl sm:rounded-2xl overflow-hidden ring-2 transition-all duration-300 ${
                          isActive ? "ring-black" : "ring-transparent"
                        }`}
                      >
                        {isEmbed ? (
                          <div className="relative w-full aspect-video">
                            <iframe
                              src={video}
                              className="absolute inset-0 w-full h-full"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <video
                            ref={(el) => {
                              videoRefs.current[index] = el;
                            }}
                            src={video}
                            controls
                            muted
                            playsInline
                            className="w-full max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] object-contain bg-black"
                          />
                        )}

                        {/* "Now playing" badge */}
                        {isActive && (
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/70 text-white text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            Now playing
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* OTHER PROJECTS RECOMMENDATIONS */}
      {otherProjects && otherProjects.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 pt-8 sm:pt-1 md:pt-16 pb-4 sm:pb-1 md:pb-6">
          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            <div className="text-start space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold">
                View Our Other Projects
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl">
                Explore more of our exceptional work and discover how we
                transform spaces into extraordinary experiences.
              </p>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
              {otherProjects.slice(0, 3).map((proj, index) => (
                <ProjectCard key={proj.id} project={proj} index={index} />
              ))}
            </div>

            {/* View All Button */}
            <div className="flex justify-center pt-4 sm:pt-6 md:pt-8">
              <Button text="View All Projects" href="/projects" variant="dark" />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-10 lg:pb-15">
        <div className="bg-black text-white rounded-2xl sm:rounded-3xl md:rounded-4xl p-6 sm:p-8 md:p-10 lg:p-14 text-center">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-gray-300 mb-5 sm:mb-6 text-sm sm:text-base md:text-xl">
            Let's create something extraordinary together.
          </p>
          <Button text="Get In Touch" href="/contact" variant="light" />
        </div>
      </section>

      {/* LIGHTBOX */}
      {selectedImageIndex !== null && project.images && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <motion.div
            className="relative w-full h-full flex items-center justify-center px-2 sm:px-4 md:px-16 lg:px-20 py-12 sm:py-14 md:py-12"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) navigateImage("prev");
              if (info.offset.x < -100) navigateImage("next");
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-5xl mx-auto">
              <Image
                src={project.images[selectedImageIndex]}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer)}`}
              />
            </div>
          </motion.div>

          <button
            onClick={closeLightbox}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 text-white text-2xl sm:text-3xl z-50 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            ✕
          </button>

          {project.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("prev");
                }}
                className="absolute left-1 sm:left-2 md:left-6 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-4xl md:text-5xl z-50 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("next");
                }}
                className="absolute right-1 sm:right-2 md:right-6 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-4xl md:text-5xl z-50 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                ›
              </button>
            </>
          )}

          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs sm:text-sm z-50">
            {selectedImageIndex + 1} / {project.images.length}
          </div>
        </div>
      )}
    </motion.main>
  );
};

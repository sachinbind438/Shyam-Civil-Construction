"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import { Pagination } from "@/components/Projects/Pagination";

interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  coverImage?: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const PAGE_SIZE = 8;

// Memoized project row for performance
const ProjectRow = memo(function ProjectRow({
  project,
  index,
  isLast,
}: {
  project: Project;
  index: number;
  isLast: boolean;
}) {
  return (
    <div key={project._id}>
      {/* Desktop row */}
      <div
        className="hidden lg:grid grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-white/2"
        style={{ borderBottom: !isLast ? "1px solid rgba(255,255,255,0.05)" : "none" }}
      >
        {/* Thumbnail - Optimized with Next.js Image */}
        <div className="col-span-1">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 relative">
            {project.coverImage && (
              <Image
                src={project.coverImage}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
                loading={index < 10 ? "eager" : "lazy"}
              />
            )}
          </div>
        </div>

        {/* Title + slug */}
        <div className="col-span-4">
          <p className="text-white text-sm font-medium truncate">{project.title}</p>
          <p className="text-white/30 text-xs mt-0.5 truncate">/projects/{project.slug}</p>
        </div>

        {/* Category */}
        <div className="col-span-3">
          <span
            className="text-xs px-2.5 py-1 rounded-full capitalize"
            style={{ background: "rgba(201,169,110,0.12)", color: "#C9A96E" }}
          >
            {project.category}
          </span>
        </div>

        {/* Date */}
        <div className="col-span-2 text-white/30 text-xs">
          {new Date(project.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>

        {/* Actions */}
        <div className="col-span-2 flex items-center justify-end gap-2">
          <Link
            href={`/projects/${project.slug}`}
            target="_blank"
            className="p-2 rounded-lg transition-colors text-white/30 hover:text-white"
            title="View on site"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </Link>
          <Link
            href={`/admin/projects/${project._id}`}
            className="px-3 py-1.5 rounded-lg text-xs transition-colors bg-[#9f96968d] text-[#ffffff] font-medium hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 hover:bg-[#C9A96E] hover:text-black"
          >
            Edit
          </Link>
          <DeleteProjectButton id={project._id} />
        </div>
      </div>

      {/* Mobile/Tablet row */}
      <div
        className="lg:hidden px-6 py-4 transition-colors hover:bg-white/2"
        style={{ borderBottom: !isLast ? "1px solid rgba(255,255,255,0.05)" : "none" }}
      >
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white/10 relative">
              {project.coverImage && (
                <Image
                  src={project.coverImage}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                  loading={index < 5 ? "eager" : "lazy"}
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <p className="text-white text-base sm:text-lg font-medium mb-1">{project.title}</p>
                <p className="text-white/30 text-xs sm:text-sm mb-2">/projects/{project.slug}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className="text-xs px-2.5 py-1 rounded-full capitalize"
                style={{ background: "rgba(201,169,110,0.12)", color: "#C9A96E" }}
              >
                {project.category}
              </span>
              <span className="text-white/30 text-xs">
                {new Date(project.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                className="p-2 rounded-lg transition-colors text-white/30 hover:text-white"
                title="View on site"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </Link>
              <Link
                href={`/admin/projects/${project._id}`}
                className="px-3 py-1.5 rounded-lg text-xs transition-colors bg-[#9f96968d] text-[#ffffff] font-medium hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 hover:bg-[#C9A96E] hover:text-black"
              >
                Edit
              </Link>
              <DeleteProjectButton id={project._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/projects?page=${page}&limit=${PAGE_SIZE}`);
      const data = await response.json();
      setProjects(data.projects);
      setPagination(data.pagination);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch projects");
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">Projects</h1>
          <p className="text-white/60 text-sm md:text-md">{projects.length} total projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center justify-center bg-[#C9A96E] gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-80 hover:scale-105 hover:shadow-lg hover:shadow-white/20 hover:text-black shrink-0"
        >
          <span>+</span> Add Project
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-white/10">
        {/* Table header - Desktop */}
        <div
          className="hidden lg:grid grid-cols-12 px-6 py-3 text-sm uppercase tracking-wider"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "white",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="col-span-1"></div>
          <div className="col-span-4">Title</div>
          <div className="col-span-3">Category</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Mobile/Tablet header */}
        <div
          className="lg:hidden px-6 py-3 text-sm uppercase tracking-wider"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "white",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          Projects
        </div>

        {/* Rows */}
        {projects.length === 0 ? (
          <div className="px-6 py-16 text-center text-white/30 text-sm">
            No projects yet.{" "}
            <Link href="/admin/projects/new" className="underline" style={{ color: "#C9A96E" }}>
              Add your first project
            </Link>
          </div>
        ) : (
          projects.map((project, index) => (
            <ProjectRow key={project._id} project={project} index={index} isLast={index === projects.length - 1} />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={page}
          totalPages={pagination.pages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
}
// app/projects/page.tsx

import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";
import { serialiseProject } from "@/data/projects";
import { AllProjects } from "@/components/Projects/AllProjects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Projects — Renovation Portfolio Mumbai",
  description:
    "Explore Shyam Civil Construction's renovation portfolio — residential, commercial, interior projects across Mumbai. See our craftsmanship.",
  alternates: {
    canonical: "https://www.shyamcivilconstruction.in/projects",
  },
  openGraph: {
    title: "Project Portfolio — Shyam Civil Construction",
    description:
      "Renovation portfolio — residential, commercial, interior projects across Mumbai.",
    url: "https://www.shyamcivilconstruction.in/projects",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

// Was 60s — same crawl-budget concern as the gallery and project-detail
// pages; raised to reduce how often Googlebot re-triggers a DB fetch.
export const revalidate = 3600;

export default async function ProjectsPage() {
  // Previously had no error handling: a DB connection failure here
  // threw unhandled and took the whole /projects route down with a
  // 500 — one of the exact error categories the report flags in
  // Search Console. Now it degrades to an empty list instead of
  // crashing the page.
  let projects: ReturnType<typeof serialiseProject>[] = [];

  try {
    await connectDB();
    const raw = (await (Project as any)
      .find({})
      .sort({ createdAt: -1 })
      .lean()) as any[];
    projects = raw.map(serialiseProject);
  } catch (error) {
    console.error("Projects page fetch error:", error);
  }

  return (
    <main className="bg-white">
      <section className="px-4 md:px-8 lg:px-16 pt-32 md:pt-40 pb-10">
        {/* PROJECT LIST */}
        <AllProjects projects={projects} />
      </section>
    </main>
  );
}
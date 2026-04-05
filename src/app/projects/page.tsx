// app/projects/page.tsx

import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";
import { serialiseProject } from "@/data/projects";
import { AllProjects } from "@/components/Projects/AllProjects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Projects",
  description: "Browse our portfolio of completed renovation projects — kitchens, bathrooms, interiors, and full home renovations.",
  alternates: {
    canonical: "https://shyamcivilconstruction.in/projects",
  },
};

export const revalidate = 60;

export default async function ProjectsPage() {
  await connectDB();

  const raw = await (Project as any).find({}).sort({ createdAt: -1 }).lean() as any[];

  const projects = raw.map(serialiseProject);

  return (
    <main className="bg-white">
      <section className="px-4 md:px-8 lg:px-16 pt-32 md:pt-40 pb-10">
        {/* PROJECT LIST */}
        <AllProjects projects={projects} />
      </section>
    </main>
  );
}

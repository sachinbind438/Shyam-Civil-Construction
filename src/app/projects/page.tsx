// app/projects/page.tsx
// ── SERVER COMPONENT — no "use client" ───────────────────────────────────────
// Fetches all projects from MongoDB and passes them to the client component.

import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";
import { serialiseProject } from "@/data/projects";
import { AllProjects } from "@/components/Projects/AllProjects";

export const revalidate = 60; // ISR — re-fetch from DB every 60 seconds

export default async function ProjectsPage() {
  await connectDB();

  const raw = await Project.find({}).sort({ createdAt: -1 }).lean<any[]>();
  const projects = raw.map(serialiseProject);

  return (
    <section className="px-6 pt-48">
      <AllProjects projects={projects}/>
    </section>
  );
}

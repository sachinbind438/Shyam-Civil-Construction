import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";
import { ProjectDetail } from "@/components/Projects/ProjectDetail";
import { serialiseProject } from "@/data/projects";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    await connectDB();
    const projects: { slug: string }[] = await (Project as any)
      .find({})
      .select("slug")
      .lean()
      .exec();

    return projects.map((p) => ({ slug: p.slug }));
  } catch (error) {
    console.error("[generateStaticParams] Failed:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    await connectDB();
    const project = (await (Project as any).findOne({ slug }).lean()) as any;

    if (!project) {
      return {
        title: "Project Not Found",
      };
    }

    return {
      title: project.title,
      description:
        project.description?.slice(0, 160) ||
        `View our ${project.title} renovation project.`,
      openGraph: {
        title: project.title,
        description: project.description?.slice(0, 160),
        images: project.coverImage ? [{ url: project.coverImage }] : [],
        type: "article",
      },
      alternates: {
        canonical: `https://shyamcivilconstruction.in/projects/${slug}`,
      },
    };
  } catch {
    return {
      title: "Project",
    };
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;

    await connectDB();
    const project = (await (Project as any).findOne({ slug }).lean()) as any;

    if (!project) {
      notFound();
    }

    // Fetch 3 random "other" projects, excluding the current one
    const otherProjects = await (Project as any).aggregate([
      { $match: { slug: { $ne: slug } } },
      { $sample: { size: 3 } },
    ]);

    const serializedOtherProjects = otherProjects.map(serialiseProject);

    return (
      <section className="">
        <ProjectDetail
          project={serialiseProject(project)}
          otherProjects={serializedOtherProjects}
        />
      </section>
    );
  } catch (error) {
    console.error("Error loading project:", error);
    notFound();
  }
}

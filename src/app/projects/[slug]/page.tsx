import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";
import { ProjectDetail } from "@/components/Projects/ProjectDetail";
import { serialiseProject } from "@/data/projects";

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
}) {
  try {
    const { slug } = await params;
    await connectDB();
    const project = await (Project as any).findOne({ slug }).lean() as any;
    
    if (!project) {
      return { title: "Project Not Found" };
    }

    const serializedProject = serialiseProject(project);

    return {
      title: `${serializedProject.title} | Shyam Civil Construction`,
      description: serializedProject.description,
      openGraph: {
        images: [serializedProject.thumbnail],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: "Project Not Found" };
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
    const project = await (Project as any).findOne({ slug }).lean() as any;
    
    if (!project) {
      notFound();
    }

    return (
      <section className="">
        <ProjectDetail project={serialiseProject(project)} />
      </section>
    );
  } catch (error) {
    console.error('Error loading project:', error);
    notFound();
  }
}

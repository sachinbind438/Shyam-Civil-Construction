import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { ProjectDetail } from "@/components/Projects/ProjectDetail";
import { serialiseProject } from "@/data/projects";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    await connectDB();
    const projects = await Project.find({}, { slug: 1 }).lean<any[]>().exec();
    return projects.map((project) => ({ slug: project.slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
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
    const project = await Project.findOne({ slug }).lean<any>();
    
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
    const project = await Project.findOne({ slug }).lean<any>();
    
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

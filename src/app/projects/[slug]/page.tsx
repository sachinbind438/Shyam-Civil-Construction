import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";
import { ProjectDetail } from "@/components/Projects/ProjectDetail";
import { serialiseProject } from "@/data/projects";
import type { Metadata } from "next";

const BASE_URL = "https://www.shyamcivilconstruction.in";

// Was 60s — that re-triggers on-demand rendering constantly and burns
// crawl budget. If Googlebot hits the page during a DB hiccup, it can
// see a broken render and treat it as a soft 404 (Issue 3 root cause).
export const revalidate = 3600;

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
      // Don't let Google index a "Project Not Found" page.
      return {
        title: "Project Not Found",
        robots: { index: false, follow: false },
      };
    }

    const title = `${project.title} | Shyam Civil Construction`;
    const description =
      project.description?.slice(0, 160) ||
      `View our ${project.title} renovation project by Shyam Civil Construction in Mumbai.`;
    const canonical = `${BASE_URL}/projects/${slug}`;
    const image = project.coverImage || `${BASE_URL}/og-image.jpg`;

    return {
      title,
      description,
      keywords: [
        project.title,
        project.category,
        "renovation mumbai",
        "civil contractor mumbai",
        "Shyam Civil Construction",
      ].filter(Boolean),
      openGraph: {
        title,
        description,
        url: canonical,
        type: "article",
        siteName: "Shyam Civil Construction",
        images: [{ url: image, width: 1200, height: 630, alt: project.title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      alternates: { canonical },
      robots: { index: true, follow: true },
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

    // JSON-LD — required for rich results (Issue 6: no structured data
    // found anywhere on the site, including project pages).
    const projectSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: project.title,
      description: project.description,
      image: project.coverImage || `${BASE_URL}/og-image.jpg`,
      author: { "@type": "Organization", name: "Shyam Civil Construction" },
      publisher: {
        "@type": "Organization",
        name: "Shyam Civil Construction",
        logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
      },
      datePublished: project.createdAt,
      dateModified: project.updatedAt || project.createdAt,
      mainEntityOfPage: `${BASE_URL}/projects/${slug}`,
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Projects", item: `${BASE_URL}/projects` },
        { "@type": "ListItem", position: 3, name: project.title, item: `${BASE_URL}/projects/${slug}` },
      ],
    };

    return (
      <section className="">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
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
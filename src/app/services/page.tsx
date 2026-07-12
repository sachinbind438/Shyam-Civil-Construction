import type { Metadata } from "next";
import ServicesSection from "@/app/services/ServicesSection";
import { connectDB } from "@/lib/mongodb";
import Service from "@/backend/db/models/Service";

// Was missing entirely — /services had no title, description, canonical,
// or OpenGraph and was silently falling back to the generic homepage
// metadata from layout.tsx (Issue 7).
export const metadata: Metadata = {
  title: "Our Services — Renovation & Civil Construction Mumbai",
  description:
    "Complete civil construction and renovation services in Mumbai — bathroom, kitchen, interior, commercial, residential. Free estimates available.",
  alternates: {
    canonical: "https://www.shyamcivilconstruction.in/services",
  },
  openGraph: {
    title: "Renovation Services — Shyam Civil Construction Mumbai",
    description:
      "Complete renovation services — bathroom, kitchen, interior, commercial. Free estimates.",
    url: "https://www.shyamcivilconstruction.in/services",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

// Was 60s — same crawl-budget concern as the gallery and projects pages.
export const revalidate = 3600;

async function getServices() {
  try {
    await connectDB();
    const services: any[] = await (Service as any)
      .find({})
      .sort({ index: 1 })
      .lean();

    return services.map((s: any) => ({
      index: s.index,
      slug: s.slug,
      title: s.title,
      image: s.image,
      description: s.description,
      features: s.features,
    }));
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <ServicesSection services={services} />
  );
}
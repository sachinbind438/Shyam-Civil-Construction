import ServicesSection from "@/app/services/ServicesSection";
import { connectDB } from "@/lib/mongodb";
import Service from "@/backend/db/models/Service";

export const revalidate = 60;

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

import GalleryGrid from "@/components/Gallery/GalleryGrid"
import { connectDB } from "@/lib/mongodb"
import { GalleryImage } from "@/backend/db/models/GalleryImage"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our collection of project images and design inspiration from Shyam Civil Construction.",
  alternates: {
    canonical: "https://shyamcivilconstruction.in/gallery",
  },
};

async function getGalleryImages() {
  try {
    await connectDB();
    const images = await (GalleryImage as any)
      .find({})
      .sort({ createdAt: -1 })
      .lean() as any[];

    const clean = (url: string) => (url ?? "").replace(/[\n\r\t]/g, "").trim();
    return images.map((img: any) => ({
      id: img._id.toString(),
      url: clean(img.url),
    }));
  } catch (error) {
    console.error("Gallery page fetch error:", error);
    return [];
  }
}

export const revalidate = 60;

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <main className="bg-white">
      <section className="px-4 md:px-8 lg:px-16 pt-32 md:pt-40">
        <div className="max-w-6xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            Gallery
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl">
            Browse our collection of project images and design inspiration
          </p>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-16 py-10">
        <GalleryGrid
          images={images}
          showTitle={true}
          columns={3}
        />
      </section>
    </main>
  );
}
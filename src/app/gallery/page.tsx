import GalleryGrid from "@/components/Gallery/GalleryGrid"

// ── Fetch gallery images ─────────────────────────────
async function getGalleryImages() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/gallery`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.success ? data.data : [];
  } catch {
    return [];
  }
}

// ISR
export const revalidate = 60;

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <main className="bg-white">
      {/* HERO */}
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

      {/* GRID */}
      <section className="px-4 md:px-8 lg:px-16 py-10">
        <GalleryGrid
          images={images}
          showTitle={true}
          columns={3} // keep logic, but we control via CSS
        />
      </section>
    </main>
  );
}
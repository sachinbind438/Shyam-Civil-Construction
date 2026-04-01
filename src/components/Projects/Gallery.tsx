import Button from "./../button/button";
import ImageCard from "../Cards/ImageCard";

// Fetch gallery images from API
async function getGalleryImages() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/gallery`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch gallery:", res.status);
      return [];
    }

    const data = await res.json();
    return data.success ? data.data.slice(0, 15) : [];
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return [];
  }
}

export default async function Gallery() {
  const images = await getGalleryImages();

  return (
    <div className="flex flex-col py-8 md:py-10 px-4 md:px-6 gap-6">
      {/* Heading */}
      <div className="text-center mb-6 md:mb-8">
        <h4 className="font-raleway text-5xl sm:text-4xl md:text-5xl lg:text-7xl">
          Our Gallery
        </h4>
      </div>

      {/* Masonry Layout */}
      <div className="columns-1 p-2 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
        {images.map((img) => (
          <div key={img.id} className="break-inside-avoid mb-4 md:mb-6">
            <ImageCard
              src={img.url}
              className="w-full h-[240px] sm:h-[240px] md:h-[260px] lg:h-[280px]"
              href={`/gallery`}
              showOverlay={false}
              imageClassName="rounded-4xl md:rounded-4xl"
              overlayClassName="rounded-4xl md:rounded-4xl"
            />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-4 md:mt-8 text-center">
        <Button
          className="self-center"
          href="/gallery"
          text="View More"
          variant="dark"
          size="md"
        />
      </div>
    </div>
  );
}

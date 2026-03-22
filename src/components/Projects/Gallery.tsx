import Button from "./../button/button";
import ImageCard from "../Cards/ImageCard";

// Fetch gallery images from API
async function getGalleryImages() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/gallery`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      console.error("Failed to fetch gallery:", res.status);
      return [];
    }
    
    const data = await res.json();
    return data.success ? data.data.slice(0, 21) : []; // Limit to 20 images
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return [];
  }
}

export default async function Gallery() {
  const images = await getGalleryImages();

  return (
    <div className="py-6 px-6">
      <div className="text-center text-7xl font-raleway mb-8">
        <h4>Our Gallery</h4>
      </div>

      {/* Masonry-like gallery using CSS columns */}
      <div className="prose-0 columns-1 sm:columns-2 lg:columns-3 gap-6">
        {images.map((img) => (
          <div key={img.id} className="break-inside-avoid mb-6">
            <ImageCard
              src={img.url}
              className="w-full h-[280px]"
              href={`/gallery`}
              showOverlay={false}
              imageClassName="rounded-4xl"
            />  
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button
          className="self-center"
          href="/gallery"
          text="View More"
          variant="dark"
          size="lg"
        />
      </div>
    </div>
  );
}

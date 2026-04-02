import Button from "./../button/button";
import Image from "next/image";

async function getGalleryImages() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/gallery`, {
      cache: 'no-store',
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

  if (!images.length) return null;

  return (
    <div className="flex flex-col py-8 md:py-10 px-4 md:px-6 gap-6">
      <div className="text-center mb-6 md:mb-8">
        <h4 className="font-raleway text-5xl sm:text-4xl md:text-5xl lg:text-7xl">
          Our Gallery
        </h4>
      </div>

      <div className="columns-1 p-2 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
        {images.map((img: any) => (
          <div key={img.id} className="break-inside-avoid mb-4 md:mb-6">
            <div className="relative w-full h-[260px] overflow-hidden rounded-4xl">
              <Image
                src={img.url}
                alt="Gallery image"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>
        ))}
      </div>

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

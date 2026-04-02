import Button from "./../button/button";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { GalleryImage } from "@/backend/db/models/GalleryImage";

async function getGalleryImages() {
  try {
    await connectDB();
    const images = await (GalleryImage as any)
      .find({})
      .sort({ createdAt: -1 })
      .limit(15)
      .lean() as any[];

    const clean = (url: string) => (url ?? "").replace(/[\n\r\t]/g, "").trim();
    return images.map((img: any) => ({
      id: img._id.toString(),
      url: clean(img.url),
    }));
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
          <div key={img.id} className="break-inside-avoid mb-4 md:mb-6 group">
            <Link href="/gallery" className="block">
              <div className="relative w-full h-[260px] overflow-hidden rounded-4xl cursor-pointer">
                <Image
                  src={img.url}
                  alt="Gallery image"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Circular Arrow - Bottom Right on Hover */}
                <div className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-md opacity-0 translate-x-6 translate-y-6 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M12 5l7 7-7 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>
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
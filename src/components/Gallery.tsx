import Button from "./button/button";
import ImageCard from "./Cards/ImageCard";

const images = [
  "/assets/project-1.jpg",
  "/assets/project-2.jpg",
  "/assets/project-3.jpg",
  "/assets/project-4.jpg",
  "/assets/Serene Blue Sanctuary_ Modern and Stylish Bedroom.jpeg",
  "/assets/Luxurious Living Room.jpeg",
  "/assets/lotus-design-n-print-oCw5_evbWyI-unsplash.jpg",
  "/assets/lotus-design-n-print-Nl1cP1Tr2oU-unsplash.jpg",
  "/assets/lotus-design-n-print-KiUg-4xmTwo-unsplash.jpg",
  "/assets/lotus-design-n-print-g51F6-WYzyU-unsplash.jpg",
  "/assets/lotus-design-n-print-8qNuR1lIv_k-unsplash.jpg",
  "/assets/point3d-commercial-imaging-ltd-2X9H1lD_k2Q-unsplash.jpg",
  "/assets/odiseo-castrejon-CX8ooha2yLA-unsplash.jpg",
  "/assets/kenny-eliason-iAftdIcgpFc-unsplash.jpg",
  "/assets/kara-eads-L7EwHkq1B2s-unsplash.jpg",
  "/assets/jason-briscoe-GliaHAJ3_5A-unsplash.jpg",
  "/assets/im3rd-media-CbZ4EDP__VQ-unsplash.jpg",
  "/assets/hemant-kanojiya-LSKfjiXsbUU-unsplash.jpg",
  "/assets/francesca-tosolini-tHkJAMcO3QE-unsplash.jpg",
  "/assets/Elegant Living Room Interior.jpeg",
  "/assets/collov-home-design - aDGbdTsBZg-unsplash.jpg",
  "/assets/bailey-alexander-WCBeEhZb4H0-unsplash.jpg",
  "/assets/bailey-alexander-PE4pFgcYzoQ-unsplash.jpg",
  "/assets/sven-brandsma-7nBjGZVOfMw-unsplash.jpg",
  "/assets/sven-brandsma-3hEGHI4b4gg-unsplash.jpg",
  "/assets/spacejoy-9M66C_w_ToM-unsplash.jpg",
  "/assets/point3d-commercial-imaging-ltd-2X9H1lD_k2Q-unsplash.jpg",
  "/assets/odiseo-castrejon-CX8ooha2yLA-unsplash.jpg",
  "/assets/IMG_20240328_180111.jpg",
  "/assets/IMG-20250522-WA0028.jpg",
  "/assets/IMG-20250522-WA0018.jpg",
];

export default function Gallery() {
  return (
    <div className="py-6 px-6">
      <div className="text-center text-7xl font-raleway mb-8">
        <h4>Our Gallery</h4>
      </div>

      {/* Masonry-like gallery using CSS columns */}
      <div className="prose-0 columns-1 sm:columns-2 lg:columns-3 gap-6">
        {images.slice(0, 15).map((src, i) => (
          <div key={i} className="break-inside-avoid mb-6">
            <ImageCard
              src={src}
              className="w-full h-[280px]"
              href={`/gallery/image-${i + 1}`}
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

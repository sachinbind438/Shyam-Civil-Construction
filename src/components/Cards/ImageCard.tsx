import Image from "next/image";
import Link from "next/link";

type ImageCardProps = {
  src: string;
  alt?: string;
  href?: string;
  className?: string;
  title?: string; // Add title prop
  showArrow?: boolean; // Show circular arrow action on hover
  showOverlay?: boolean; // Show dark overlay and title on hover
  imageClassName?: string; // optional class applied to image wrapper and image
};

export default function ImageCard({
  src,
  alt = "",
  href,
  className = "",
  title = "",
  showArrow = true,
  showOverlay = true,
  imageClassName = "",
}: ImageCardProps) {
  const wrapperRounded = imageClassName || "rounded-tr-[72px] rounded-bl-[72px] group-hover:rounded-[72px]";

  const Card = (
    <div className={`group relative isolate cursor-pointer transition-all duration-300 ${className} transform-gpu`}>
      {/* Image wrapper: keep relative for next/image fill */}
      <div className={`relative w-full h-full overflow-hidden ${wrapperRounded} z-0 transition-all duration-300 transform-gpu`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          className={`object-cover z-0 transition-all duration-300 group-hover:scale-105 ${imageClassName}`}
        />
      </div>

      {/* Opacity-based overlay */}
      {showOverlay && (
        <div className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 ${wrapperRounded}`} />
      )}

      {/* Title overlay (centered) */}
      {showOverlay && title && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-lg md:text-xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 text-center">
          {title}
        </div>
      )}

      {/* Circular action (bottom-right). Render as non-interactive element to avoid nested anchors when wrapped by Link. */}
      {showArrow && (
        <div className="absolute bottom-10 right-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-md opacity-0 translate-x-6 translate-y-6 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
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
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="contents">
        {Card}
      </Link>
    );
  }

  return Card;
}

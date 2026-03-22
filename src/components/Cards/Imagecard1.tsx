"use client";

import Image from "next/image";
import Link from "next/link";

type ImagecardProps = {
  title?: string;
  image: string;
  href?: string;
  showArrow?: boolean;
};

export default function Imagecard({
  title,
  image,
  href = "#",
  showArrow = true,
}: ImagecardProps) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[40px]"
    >
      <div className="relative h-full w-full">
      {/* Image */}
      <Image
        src={image}
        alt={title ?? "Project image"}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark hover overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Center title */}
      {title && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="text-white text-xl font-semibold opacity-0 group-hover:opacity-100 transition duration-300">
            {title}
          </span>
        </div>
      )}
      </div>

      {/* Arrow button */}
      {showArrow && (
        <div className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black text-lg shadow-md">
          →
        </div>
      )}
    </Link>
  );
}

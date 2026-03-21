import Image from "next/image";
import { useState } from "react";

interface ImageCardProps {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
  overlay?: boolean;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function ImageCard({
  src,
  alt,
  aspectRatio = "landscape",
  rounded = "lg",
  overlay = false,
  className = "",
  onClick,
  children
}: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectRatios = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[16/9]"
  };

  const roundedStyles = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    full: "rounded-full"
  };

  return (
    <div
      className={`
        relative overflow-hidden cursor-pointer group
        ${aspectRatios[aspectRatio]}
        ${roundedStyles[rounded]}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Image */}
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          className={`
            object-cover transition-all duration-300
            group-hover:scale-105
            ${isLoading ? 'opacity-0' : 'opacity-100'}
          `}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Overlay */}
      {overlay && !hasError && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Children */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

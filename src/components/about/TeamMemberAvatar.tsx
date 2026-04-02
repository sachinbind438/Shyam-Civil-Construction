"use client";

import { useState } from "react";
import Image from "next/image";

interface TeamMemberAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export default function TeamMemberAvatar({ image, name, className = "" }: TeamMemberAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const hasImage = image && image.trim() !== "" && !imgError;

  return (
    <div className={`w-full h-full ${className}`}>
      {hasImage ? (
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-16 h-16 text-gray-400"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

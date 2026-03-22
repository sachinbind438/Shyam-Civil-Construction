"use client";

import React from "react";
import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

export default function Button({
  children,
  href,
  onClick,
  className = "",
  ariaLabel,
}: ButtonProps) {
  const inner = (
    <span
      className={`inline-flex items-center gap-3 bg-white text-black px-6 py-2 rounded-full font-medium shadow-sm ${className}`}
      aria-label={ariaLabel}
    >
      <span>{children}</span>

      <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
        </svg>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block" onClick={onClick} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}

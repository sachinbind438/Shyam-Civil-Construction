"use client";

import Link from "next/link";
import React from "react";

type Variant = "dark" | "light";

type ButtonProps = {
  text: string; // 👈 TEXT AS PROP
  href?: string;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
  className?: string;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
};

export default function Button({
  text,
  href,
  onClick,
  className = "",
  variant = "dark",
  size = "md",
}: ButtonProps) {
  const isDark = variant === "dark";

const sizeMap = {
  sm: {
    pill: "px-7 py-1 text-xs",
    arrow: "w-7 h-7",
    svg: "w-3 h-3",
  },

  // 💎 THIS IS THE MAGIC ONE
  md: {
    // md for mobile → lg for desktop
    pill: "px-8 py-2 text-sm lg:px-11 lg:py-3 lg:text-base",
    arrow: "w-9 h-9 lg:w-12 lg:h-12 lg:group-hover:-translate-x-7!",
    svg: "w-3 h-3 lg:w-4 lg:h-4",
  },

  lg: {
    pill: "px-11 py-3 text-base",
    arrow: "w-12 h-12 group-hover:-translate-x-7!",
    svg: "w-4 h-4",
  },
} as const;

  const sz = sizeMap[size];

  const content = (
    <div className="group relative inline-flex items-center overflow-hidden">
      {/* TEXT PILL */}
      <span
        className={`
          relative z-10
          ${sz.pill}
          rounded-full
          font-medium whitespace-nowrap
          transition-transform duration-200
          ease-out          group-hover:translate-x-4         
          ${isDark ? "bg-black text-white" : "bg-white text-black"}
        `}
      >
        {text}
      </span>

      {/* ARROW */}
      <span
        className={`
          relative z-20
          ${sz.arrow}
          rounded-full
          flex items-center justify-center
          transition-transform duration-200
          ease-out  
          group-hover:-translate-x-4
          ${isDark ? "bg-black" : "bg-white"}
          shadow-[0_0_0_2px_${isDark ? "#ffffff" : "#000000"}]
        `}
      >
        <span
          className={`rounded-full border-2 ${
            isDark ? "border-white " : "border-black  "
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${sz.svg} m-0.5  ${isDark ? "text-white " : "text-black  "}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-6-6l6 6-6 6"
            />
          </svg>
        </span>
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} type="button" className={className}>
      {content}
    </button>
  );
}
Button.defaultProps = {
  variant: "dark",
  className: "",
  href: undefined,
  onClick: undefined,
  size: "md",
};
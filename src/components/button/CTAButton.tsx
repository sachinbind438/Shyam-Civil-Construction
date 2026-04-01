"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CTAButtonProps {
  text?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * CTA Button Component with Framer Motion
 * Usage in Navbar or any page with hover effects
 */
export const CTAButton = ({
  text = "Get In Touch",
  href = "/contact",
  onClick,
  className = "",
}: CTAButtonProps) => {
  const variants = {
    rest: {
      scale: 1,
    },
    hover: {
      scale: 1.05,
    },
    tap: {
      scale: 0.95,
    },
  };

  const arrowVariants = {
    rest: { x: 0 },
    hover: { x: 6 },
  };

  const buttonContent = (
    <motion.button
      variants={variants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className={`
        group relative inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-full
        bg-black text-white font-semibold
        shadow-lg hover:shadow-xl
        transition-all duration-300
        overflow-hidden
        ${className}
      `}
      onClick={onClick}
    >
      {/* Background gradient on hover */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-gray-900 to-black rounded-full"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <span className="relative flex items-center gap-2">
        <span>{text}</span>
        <motion.svg
          className="w-4 h-4 relative"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          variants={arrowVariants}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </motion.svg>
      </span>
    </motion.button>
  );

  if (href) {
    return <Link href={href}>{buttonContent}</Link>;
  }

  return buttonContent;
};

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "Shyam Civil Construction delivered high-quality interior work with professionalism and attention to detail. The project was completed on time, within budget, and exceeded my expectations.",
    author: "Bhavika Mehta",
  },
  {
    id: 2,
    quote:
      "Shyam Civil Construction exceeded my expectations with my renovation. Their professionalism, attention to detail, and commitment to quality ensured the project was completed on time. Highly recommended.",
    author: "Prem Chavan",
  },
  {
    id: 3,
    quote:
      "Beautiful work! The design matched our vision perfectly and the whole process was smooth. We love our new space! The team was professional, creative, and easy to work with.",
    author: "Aarti Sharma",
  },
];

export default function TestimonialComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const current = testimonials[currentIndex];

  return (
    <div className="w-full py-4 px-4 md:px-8 lg:py-24 lg:px-24 xl:px-48 flex flex-col items-center gap-6 md:gap-8 lg:gap-6">
      <div className="text-4xl md:text-5xl lg:text-7xl text-center">
        <h2>Our Clients&apos; Experience</h2>
      </div>

      <div
        className="w-full bg-[#f9f5f1] py-8 px-4 md:py-10 md:px-8 lg:py-16 lg:px-12 rounded-2xl md:rounded-3xl lg:rounded-3xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col items-center">
          <div className="text-4xl md:text-6xl lg:text-9xl text-[#f4a38a] font-serif leading-none">
            &ldquo;
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-center"
            >
              <p className="text-sm md:text-2xl lg:text-2xl font-normal text-[#4d4d4d] leading-relaxed mb-4 md:mb-6 lg:mb-4">
                &ldquo;{current.quote}&rdquo;
              </p>

              <p className="text-sm md:text-2xl lg:text-2xl font-semibold text-black">
                - {current.author}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center items-center gap-2 md:gap-3 lg:gap-3 mt-6 md:mt-8 lg:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 min-w-[12px] min-h-[12px] ${
                  index === currentIndex
                    ? "w-6 md:w-8 lg:w-8 bg-[#e8b4a8]"
                    : "w-3 bg-[#e8b4a8]/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

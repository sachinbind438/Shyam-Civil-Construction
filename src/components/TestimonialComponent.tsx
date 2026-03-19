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
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const current = testimonials[currentIndex];

  return (

    <div className="py-12 px-48 flex flex-col items-center gap-8">
      <div className="text-center text-7xl font-raleway!">
        <h4>Our Clients' Experience</h4>
      </div>
    <div
      className="w-full bg-[#f9f5f1] py-16 px-4 rounded-4xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center">

        {/* Quote Icon */}
        <div className="text-9xl! text-[#f4a38a] font-serif">“</div>

        {/* Animated Testimonial */}
        <AnimatePresence mode="wait">

          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-center"
          >

            <p className="text-xl! font-normal text-[#4d4d4d] leading-relaxed mb-6">
              "{current.quote}"
            </p>

            <p className="text-lg! font-semibold text-black">
              - {current.author}
            </p>

          </motion.div>

        </AnimatePresence>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-[#e8b4a8]"
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
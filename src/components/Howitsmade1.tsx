"use client";
import { useRef, useEffect, useState } from "react";
import React from "react";
import Link from "next/link";

const ANIMATION_CONFIG = {
  start: 1,   // ← Section becomes sticky, stays stable, animation THEN begins
  end: 1.6,     // ← CHANGE THIS to adjust reveal speed (higher = slower)
};


// Custom hook for scroll progress
function useScrollProgress(ref, { start = 0.70, end = 1.6 } = {}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Calculate raw progress based on element position
      const rawProgress = 1 - rect.top / vh;

      // Map to [start, end] range
      const mappedProgress = (rawProgress - start) / (end - start);

      // Clamp between 0 and 1
      const clampedProgress = Math.min(Math.max(mappedProgress, 0), 1);

      setProgress(clampedProgress);
    };

    // Initial calculation
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ref, start, end]);

  return progress;
}

// Easing function
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function HowItsMade1() {
  const sectionRef = useRef(null);
  // Use the animation config to control speed - adjust ANIMATION_CONFIG above
  const rawProgress = useScrollProgress(sectionRef, ANIMATION_CONFIG);
  const progress = easeInOut(rawProgress);

  // Animation calculations
  const leftX = -progress * 100; // 0% → -100%
  const rightX = progress * 100;  // 0% → +100%
  
  // Rotation effects - images tilt as they slide
  const leftRotate = -progress * 2;   // 0deg → -2deg (left image tilts left)
  const rightRotate = progress * 2;   // 0deg → +2deg (right image tilts right)

  // Text reveal starts at progress=0.4, completes at progress=1.0
  const textProgress = Math.max(0, (progress - 0.4) / 0.6);
  const textOpacity = textProgress;
  const textY = (1 - textProgress) * 32;

  return (
    <main>
      <section className="framer-1kb7w14" data-framer-name="How it's made" ref={sectionRef}>
        <div className="framer-10wi041" data-framer-name="Scroll Sections">
          <div
            className="framer-148zorf"
            data-framer-name="how it's made 01"
            id="how-it-s-made-01"
          ></div>
          <div
            className="framer-1kbv3tt"
            data-framer-name="how it's made 02"
            id="how-it-s-made-02"
          ></div>
        </div>
        <div className="framer-13sflnr" data-framer-name="Content">
          <header className="framer-1j52nhv" data-framer-name="Headline">
            <div
              className="framer-1civq1j"
              data-framer-component-type="RichTextContainer"
            >
              <h2
                className="framer-text framer-styles-preset-1sfw55o text-center text-[80px] font-raleway font-medium"
                data-styles-preset="CayqyWHXn"
              >
                How it's made
              </h2>
            </div>
          </header>
          <div
            className="framer-wu7ntd py-15 flex flex-col items-center justify-center w-full"
            data-framer-name="Content"
          >
            <div
              className="framer-1coprvi w-[485px] h-fit text-justify"
              data-framer-name="Description"
              style={{
                transform: `translateY(${textY}px)`,
                opacity: textOpacity,
                transition: "transform 0.3s, opacity 0.3s"
              }}
            >
              <div
                className="framer-1vbvg9j m-0"
                data-framer-component-type="RichTextContainer"
              >
                <p
                  className="framer-text framer-styles-preset-r4iv28 text-[#4d4d4d] leading-normal m-0 mb-2"
                  data-styles-preset="eX6MBJuWF"
                >
                  Designing your space is a journey that we embark on together.
                  Our process is rooted in collaboration, creativity, and
                  clarity. Here’s how we work:
                </p>
              </div>
              <div
                className="framer-1nwtlnz m-0"
                data-framer-component-type="RichTextContainer"
              >
                <ol
                  className="framer-text framer-styles-preset-1pnvkvi list-decimal list-inside pl-2 text-left text-[#4d4d4d] leading-normal m-0 p-0"
                  data-styles-preset="tM_YeXjEO"
                >
                  <li className="framer-text text-left text-[#4d4d4d] pl-6 -indent-6 leading-normal mb-1">
                    Initial Consultation: Understanding your needs, style, and
                    goals.
                  </li>
                  <li className="framer-text text-left text-[#4d4d4d] pl-6 -indent-6 leading-normal mb-1">
                    Design Concept: Crafting a vision that aligns with your
                    space.
                  </li>
                  <li className="framer-text text-left text-[#4d4d4d] pl-6 -indent-6 leading-normal mb-1">
                    Implementation: Bringing the design to life with quality
                    craftsmanship.
                  </li>
                  <li className="framer-text text-left text-[#4d4d4d] pl-6 -indent-6 leading-normal m-0">
                    Final Reveal: Unveiling a space that reflects your vision
                    and exceeds your expectations.
                  </li>
                </ol>
              </div>
              <div>
                <div className="relative z-20" style={{ width: "480px", height: "480px" }}>
            {/* 
              LEFT IMAGE - slides out to the LEFT with rotation
              IMAGE: /assets/Process/Process-left.avif
              DIMENSIONS: 1856px × 2464px (intrinsic) → 480px × 480px (rendered with object-fit: cover)
              ROLE: INITIAL STATE (what shows first)
              ANIMATION: 
                - translateX: 0% → -100% (slides left)
                - rotate: 0deg → -2deg (tilts left)
            */}
            <div
              className="absolute top-0 bottom-0 left-0 w-1/2 overflow-hidden"
              style={{
                willChange: "transform",
                transform: `translateX(${leftX}%) rotate(${leftRotate}deg)`,
                transition: "none"
              }}
            >
              <img
                src="/assets/Process/Process-left.avif"
                alt="Design mood board and material samples"
                width="1856"
                height="2464"
                className="w-full h-full object-cover"
                style={{ imageRendering: "auto" }}
              />
            </div>

            {/* 
              RIGHT IMAGE - slides out to the RIGHT with rotation
              IMAGE: /assets/Process/Process-right.avif
              DIMENSIONS: 1856px × 2464px (intrinsic) → 480px × 480px (rendered with object-fit: cover)
              ROLE: INITIAL STATE (what shows first)
              ANIMATION:
                - translateX: 0% → +100% (slides right)
                - rotate: 0deg → +2deg (tilts right)
            */}
            <div
              className="absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden"
              style={{
                willChange: "transform",
                transform: `translateX(${rightX}%) rotate(${rightRotate}deg)`,
                transition: "none"
              }}
            >
              <img
                src="/assets/Process/Process-right.avif"
                alt="Architectural model and construction process"
                width="1856"
                height="2464"
                className="w-full h-full object-cover"
                style={{ imageRendering: "auto" }}
              />
            </div>
          </div>
            </div>
            </div>
            
          </div>
        </div>
      </section>
    </main>
  );
}

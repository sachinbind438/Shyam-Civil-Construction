"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ImageStackMobile from "./ImageStackMobile";

export default function ImageStack() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Rotation
  const rotateBack = useTransform(scrollYProgress, [0, 1], [2, 12]);
  const rotateMid = useTransform(scrollYProgress, [0, 1], [-3, 8]);
  const rotateFront = useTransform(scrollYProgress, [0, 1], [-10, 5]);

  // Fan out
  const xMid = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const xFront = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const yMid = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Tilt
  const tiltX = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const tiltY = useTransform(scrollYProgress, [0, 1], [0, 8]);

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

  return (
    <section className="py-2 md:py-5">
      {/* ================= MOBILE ================= */}
      <div className="lg:hidden px-4">
        <h2 className="text-4xl md:text-5xl  mb-4 text-black">
          Our Approach
        </h2>
        <ImageStackMobile>
          <p className="text-sm sm:text-base mb-6 text-gray-200">
            Designing your space is a journey that we embark on together. Our
            process is rooted in collaboration, creativity, and clarity.
          </p>

          <ul className="text-sm sm:text-base space-y-2 text-left text-white">
            <li>
              1. Initial Consultation: Understanding your needs, style, and
              goals.
            </li>
            <li>
              2. Design Concept: Crafting a vision that aligns with your space.
            </li>
            <li>
              3. Implementation: Bringing the design to life with quality
              craftsmanship.
            </li>
            <li>
              4. Final Reveal: Unveiling a space that reflects your vision and
              exceeds expectations.
            </li>
          </ul>
        </ImageStackMobile>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden lg:flex justify-center items-center w-full">
        <div
          ref={ref}
          className="relative w-[420px] xl:w-[520px] h-[420px] xl:h-[520px] perspective-[1400px]"
        >
          {/* BACK */}
          <motion.div
            style={{
              rotate: rotateBack,
              rotateX: tiltX,
              rotateY: tiltY,
              scale,
            }}
            className="absolute top-0 right-0 z-10"
          >
            <div className="relative w-[380px] xl:w-[500px] h-[380px] xl:h-[500px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/assets/About/about-top.avif"
                alt="Back"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* MIDDLE */}
          <motion.div
            style={{
              rotate: rotateMid,
              x: xMid,
              y: yMid,
              rotateX: tiltX,
              rotateY: tiltY,
              scale,
            }}
            className="absolute top-16 xl:top-20 right-[40px] xl:right-[60px] z-20"
          >
            <div className="relative w-[380px] xl:w-[500px] h-[380px] xl:h-[500px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/assets/About/about-middle.avif"
                alt="Middle"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* FRONT */}
          <motion.div
            style={{
              rotate: rotateFront,
              x: xFront,
              y: yFront,
              rotateX: tiltX,
              rotateY: tiltY,
              scale,
            }}
            className="absolute top-32 xl:top-40 right-[80px] xl:right-[120px] z-30"
          >
            <div className="relative w-[380px] xl:w-[500px] h-[380px] xl:h-[500px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/assets/About/about-bottom.avif"
                alt="Front"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

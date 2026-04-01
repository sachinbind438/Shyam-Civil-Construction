"use client";

import Image from "next/image";
import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ImageStackMobile({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Animations
  const rotateBack = useTransform(scrollYProgress, [0, 1], [6, 12]);
  const rotateMid = useTransform(scrollYProgress, [0, 1], [2, 8]);
  const rotateFront = useTransform(scrollYProgress, [0, 1], [-4, 5]);

  const yBack = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const xMid = useTransform(scrollYProgress, [0, 1], [-10, -25]);
  const xFront = useTransform(scrollYProgress, [0, 1], [-20, -40]);

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);

  return (
    <div
      ref={ref}
      className="relative w-full min-h-[450px] flex items-center justify-center px-5"
    >
      {/* ✅ IMAGE STACK (BACKGROUND) */}
      <div className="absolute inset-0 flex items-center justify-center z-0">

        {/* BACK */}
        <motion.div
          style={{ rotate: rotateBack, y: yBack, scale }}
          className="absolute w-[90%] h-[350px] shadow-lg "
        >
          <Image src="/assets/About/about-top.avif" alt="" fill className="object-cover rounded-2xl" />
          <div className="absolute inset-0 bg-black/50 rounded-2xl" />
        </motion.div>

        {/* MIDDLE */}
        <motion.div
          style={{ rotate: rotateMid, x: xMid, y: yMid, scale }}
          className="absolute w-[90%] h-[350px] shadow-xl rounded-xl"
        >
          <Image src="/assets/About/about-middle.avif" alt="" fill className="object-cover rounded-2xl" />
          <div className="absolute inset-0 bg-black/50 rounded-2xl" />
        </motion.div>

        {/* FRONT */}
        <motion.div
          style={{ rotate: rotateFront, x: xFront, y: yFront, scale }}  
          className="absolute w-[90%] h-[350px] shadow-2xl rounded-xl"
        >
          <Image src="/assets/About/about-bottom.avif" alt="" fill className="object-cover rounded-2xl" />
          <div className="absolute inset-0 bg-black/50 rounded-2xl" />
        </motion.div>
      </div>

      {/* ✅ CONTENT (FRONT) */}
      <div className="relative z-20 text-white text-left">
        {children}
      </div>
    </div>
  );
}
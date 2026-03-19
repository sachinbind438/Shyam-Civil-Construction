"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ImageStack() {

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Rotation
  const rotateBack = useTransform(scrollYProgress,[0,1],[2,12]);
  const rotateMid = useTransform(scrollYProgress,[0,1],[-3,8]);
  const rotateFront = useTransform(scrollYProgress,[0,1],[-10,5]);

  // Fan out
  const xMid = useTransform(scrollYProgress,[0,1],[0,-40]);
  const xFront = useTransform(scrollYProgress,[0,1],[0,-80]);

  const yMid = useTransform(scrollYProgress,[0,1],[0,-20]);
  const yFront = useTransform(scrollYProgress,[0,1],[0,-40]);

  // 3D Tilt TOWARD SCREEN
  const tiltX = useTransform(scrollYProgress,[0,1],[0,-10]);
  const tiltY = useTransform(scrollYProgress,[0,1],[0,8]);

  // Slight zoom toward screen
  const scale = useTransform(scrollYProgress,[0,1],[1,1.02]);

  return (
    <div
      ref={ref}
      className="relative w-[520px] h-[520px] perspective-[1400px]"
    >

      {/* Back Image */}
      <motion.div
        style={{
          rotate: rotateBack,
          rotateX: tiltX,
          rotateY: tiltY,
          scale
        }}
        className="absolute top-0 right-0 z-10"
      >
        <div className="relative w-[500px] h-[500px] overflow-hidden shadow-lg rounded-xl">
          <Image
            src="/assets/About/about-top.avif"
            alt="Back image"
            fill
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* Middle Image */}
      <motion.div
        style={{
          rotate: rotateMid,
          x: xMid,
          y: yMid,
          rotateX: tiltX,
          rotateY: tiltY,
          scale
        }}
        className="absolute top-20 right-[60px] z-20"
      >
        <div className="relative w-[500px] h-[500px] overflow-hidden shadow-xl rounded-xl">
          <Image
            src="/assets/About/about-middle.avif"
            alt="Middle image"
            fill
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* Front Image */}
      <motion.div
        style={{
          rotate: rotateFront,
          x: xFront,
          y: yFront,
          rotateX: tiltX,
          rotateY: tiltY,
          scale
        }}
        className="absolute top-40 right-[120px] z-30"
      >
        <div className="relative w-[500px] h-[500px] overflow-hidden shadow-2xl rounded-xl">
          <Image
            src="/assets/About/about-bottom.avif"
            alt="Front image"
            fill
            className="object-cover"
          />
        </div>
      </motion.div>

    </div>
  );
}
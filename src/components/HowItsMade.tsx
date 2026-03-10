"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import "./HowItsMade.css";

export default function HowItsMade() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const section = document.getElementById("how-made");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      const raw = 1 - rect.top / vh;
      const clamped = Math.min(Math.max(raw, 0), 1);
      setProgress(clamped);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* PHASE CALCULATIONS */
  const imageProgress =
    progress < 0.33
      ? 0
      : progress < 0.66
      ? (progress - 0.33) / 0.33
      : 1;

  const contentVisible = progress > 0.66;

  return (
    <section id="how-made" className="him-section">
      <h2 className="him-heading">How it's made</h2>

      <div className="him-sticky">
        {/* CONTENT (PHASE 3) */}
        <div
          className={`him-content ${contentVisible ? "show" : ""}`}
        >
          <p>
            Designing your space is a journey we embark on together.
            Our process is rooted in collaboration and clarity.
          </p>

          <ol>
            <li>Initial Consultation</li>
            <li>Design Concept</li>
            <li>Implementation</li>
            <li>Final Reveal</li>
          </ol>
        </div>

        {/* IMAGE MASK (PHASE 2) */}
        <div className="him-mask">
          <div
            className="mask left"
            style={{
              transform: `translateX(${-imageProgress * 110}%)`
            }}
          >
            <Image
              src="/assets/process/process-left.avif"
              alt="Design"
              fill
              priority
            />
          </div>

          <div
            className="mask right"
            style={{
              transform: `translateX(${imageProgress * 110}%)`
            }}
          >
            <Image
              src="/assets/process/process-right.avif"
              alt="Model"
              fill
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

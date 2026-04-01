"use client";

import Image from "next/image";
import Button from "../button/button";

export default function Hero({
  title,
  quote,
  subtitle,
  imageSrc,
  ctaText = "Get a Free Estimate",
  ctaHref = "/contact",
}) {
  return (
    <section className="relative m-4 md:m-6 rounded-4xl sm:rounded-3xl md:rounded-[72px] h-[80vh] md:h-[calc(100vh-48px)] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={imageSrc}
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80" />
      </div>

      {/* ✅ TRUE CENTERED TITLE */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-4 w-full">
          <h1
            className="text-white font-medium leading-[1.05] tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[140px] animate-fadeUp"
          >
            {title}
            <br />
            {subtitle}
          </h1>
        </div>
      </div>

      {/* ✅ LOWER CONTENT */}
      <div className="absolute bottom-[8%] md:bottom-[10%] left-1/2 -translate-x-1/2 w-full text-center px-4 z-10">
        <p
          className="text-[#E6E6E6] text-md sm:text-base md:text-lg max-w-xl md:max-w-2xl mx-auto leading-relaxed animate-fadeUp delay-1"
        >
          {quote}
        </p>

        <div className="mt-5 md:mt-6 flex justify-center animate-fadeUp delay-2">
          <Button
            text={ctaText}
            href={ctaHref}
            variant="light"
            size="md"
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Button from "../button/button";

type HeroProps = {
  title: string;
  quote: string;
  subtitle: string;
  imageSrc: string;
  ctaText?: string;
  ctaHref?: string;
};

export default function Hero({
  title,
  quote,
  subtitle,
  imageSrc,
  ctaText = "Get a Free Estimate",
  ctaHref = "/contact",
}: HeroProps) {
  return (
    <section className="rounded-[72px]   relative    m-6 h-[calc(100vh-48px)] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={imageSrc}
          alt="Hero background"
          fill
          priority
          className="object-cover   object-center scale-[1.0] "
        />
        {/* Dark overlay */}
        <div className="absolute inset-0  pointer-events-none bg-linear-to-b  from-transparent via-transparent via-5%  to-black" />
      </div>

      <div className=" flex flex-col   " />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center text-wrap ">
        <h1 className="text-white text-[120px]!  font-medium leading-tight">
          {title}
          <br />
          {subtitle}
        </h1>

        <p className="mt-6 text-base md:text-lg  text-[#E6E6E6]!">{quote}</p>

        <div className="mt-10 flex justify-center">
          <Button text={ctaText} href={ctaHref} variant="light" size="lg"></Button>
        </div>
      </div>
    </section>
  );
}

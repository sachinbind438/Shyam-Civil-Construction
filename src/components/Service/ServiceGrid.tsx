"use client";

import Image from "next/image";

const services = [
  {
    id: "residential",
    title: "Residential Renovation",
    image: "/services/Grid1.avif",
    rounded: "rounded-tl-[60px]",
    reverse: false,
  },
  {
    id: "interior",
    title: "Interior Renovation",
    image: "/services/Grid2.avif",
    rounded: "",
    reverse: true,
  },
  {
    id: "commercial",
    title: "Commercial Renovation",
    image: "/services/Grid3.avif",
    rounded: "rounded-tr-[60px]",
    reverse: false,
  },
];

export default function ServiceGrid() {
  return (
    <section className="w-full flex justify-center">
      {/* ── MOBILE: stacked cards (image → text) ── */}
      <div className="w-full md:hidden flex flex-col">
        {services.map((service) => (
          <div key={service.id} className="group relative cursor-pointer">
            {/* Image always on top on mobile */}
            <div className="relative w-full h-[260px] sm:h-[320px] overflow-hidden">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
            </div>
            {/* Text always below image on mobile */}
            <TextRow title={service.title} />
          </div>
        ))}
      </div>

      {/* ── DESKTOP: original layout unchanged ── */}
      <div className="w-full max-w-[1600px] bg-[#ffffff] overflow-hidden hidden md:flex flex-row rounded-tl-[60px] rounded-tr-[60px]">
        {services.map((service) => (
          <div
            key={service.id}
            className="group relative flex-1 flex flex-col cursor-pointer"
          >
            {/* TEXT TOP (2nd card) */}
            {service.reverse && <TextRow title={service.title} />}

            {/* IMAGE */}
            <div className="relative w-full h-[400px] overflow-hidden">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] ${service.rounded}`}
              />
            </div>

            {/* TEXT BOTTOM (1st & 3rd cards) */}
            {!service.reverse && <TextRow title={service.title} />}
          </div>
        ))}
      </div>
    </section>
  );
}

function TextRow({ title }: { title: string }) {
  return (
    <div className="relative px-6 py-3.5 flex items-center">
      <h1 className="text-2xl! md:text-3xl font-semibold! text-black">
        {title}
      </h1>
      <span className="absolute right-8 w-5 h-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          className="w-full h-full fill-black"
        >
          <path d="M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z" />
        </svg>
      </span>
    </div>
  );
}
"use client";

import ServiceGrid from "../../components/ServiceGrid";
import ServiceDetail from "../../components/ServiceDetail";
import { servicesData } from "../../data/services";
import HowItsMade from "../../components/HowItsMade";
export default function ServicesSection() {
  return (
    <main>
      <section className="w-full pb-6 pt-48 px-6 gap-12 flex flex-col ">
        <div>
          <header className="px-12 gap-6 flex flex-col">
            {/* HEADING */}
            <h2 className="text-[48px] md:text-[72px]  text-left! leading-tight font-Raleway! text-black">
              Start Building Your Dream Project
            </h2>

            {/* SUBTEXT */}
            <p className=" text-[18px]! md:text-[18px] text-gray-600 max-w-[700px]">
              Write to us by completing the form. We will get back to you as
              soon as possible!
            </p>
          </header>
        </div>

        {/* GRID */}
        <div>
          <ServiceGrid />
        </div>
        <div className="px-12 gap-6 flex flex-col">
          <p className=" text-[18px]! md:text-[18px] text-gray-600">
            "We provide end-to-end renovation services across residential,
            interior, and commercial spaces—delivering quality, efficiency, and
            design excellence in every project."
          </p>
        </div>
      </section>
      <section>
        <div className="0">
          <header className="p-6 pt-24 gap-6 flex flex-col">
            {/* HEADING */}
            <h2 className="text-[48px] md:text-[72px] px-12 text-left! leading-tight font-Raleway! text-black">
              Explore Our Services
            </h2>
          </header>
        </div>
        {/* SERVICE DETAILS */}
        {servicesData.map((service, index) => (
          <ServiceDetail
            key={service.slug}
            index={index}
            title={service.title}
            image={service.image}
            description={service.description}
            features={service.features}
          />
        ))}
        <div className="">
          <HowItsMade />
        </div>
      </section>
    </main>
  );
}
    
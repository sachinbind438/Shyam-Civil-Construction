"use client";

import { useState, useEffect } from "react";
import ServiceGrid from "../../components/Service/ServiceGrid";
import ServiceDetail from "../../components/Service/ServiceDetail";

interface ServiceData {
  index: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  features: string;
}

export default function ServicesSection() {
  const [servicesData, setServicesData] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServicesData(data.data || []);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <main>
      <section className="w-full pb-6 pt-35 sm:pt-32 md:pt-48 px-4 sm:px-6 gap-8 sm:gap-12 flex flex-col">
        <div>
          <header className="px-4 sm:px-8 md:px-12 gap-4 sm:gap-6 flex flex-col">
            {/* HEADING */}
            <h2 className="text-[32px] sm:text-[42px] md:text-[56px] lg:text-[72px] text-left leading-tight font-Raleway! text-black">
              Start Building Your Dream Project
            </h2>

            {/* SUBTEXT */}
            <p className="text-[15px] sm:text-[16px] md:text-[18px] text-gray-600 max-w-[700px]">
              Write to us by completing the form. We will get back to you as
              soon as possible!
            </p>
          </header>
        </div>

        {/* GRID */}
        <div>
          <ServiceGrid />
        </div>

        <div className="px-4 sm:px-8 md:px-12 gap-6 flex flex-col">
          <p className="text-[15px] sm:text-[16px] md:text-[18px] text-gray-600">
            "We provide end-to-end renovation services across residential,
            interior, and commercial spaces—delivering quality, efficiency, and
            design excellence in every project."
          </p>
        </div>
      </section>

      <section>
        <div>
          <header className="px-4 sm:px-8 md:px-12 pt-12 sm:pt-16 md:pt-24 pb-0 gap-6 flex flex-col">
            {/* HEADING */}
            <h2 className="text-[32px] sm:text-[42px] md:text-[56px] lg:text-[72px] text-left leading-tight font-Raleway! text-black">
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
      </section>
    </main>
  );
}

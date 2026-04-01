"use client";

import Image from "next/image";
import Button from "../button/button";

export default function ServiceGrid() {
  return (
    <div>
      {/* Header */}
      <div className="px-4 md:px-10 lg:px-20 py-6 gap-4 md:gap-6 flex flex-col">
        <h4 className="text-5xl sm:text-4xl md:text-5xl lg:text-7xl">
          Services
        </h4>

        <p className="text-[#4d4d4d] leading-relaxed max-w-[620px] text-sm sm:text-base md:text-lg">
          From concept to completion, we design spaces that are as unique as you
          are, mixing modern aesthetics with thoughtful functionality, ensuring
          each project is perfectly tailored to your needs.
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left – Image */}
        <div className="px-4 md:px-6">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[calc(100vh-48px)] lg:sticky top-6">
            <div className="relative w-full h-full overflow-hidden ">
              <Image
                src="/assets/Service.avif"
                alt="Bathroom Remodeling"
                fill
                priority
                className="object-cover p-4 rounded-4xl md:rounded-5xl lg:rounded-tl-[74px] lg:rounded-br-[74px]"
              />
            </div>
          </div>
        </div>

        {/* Right – Content */}
        <div className="space-y-16 md:space-y-24 px-4 md:px-6 lg:pr-16 py-6">
          {/* Service 1 */}
          <div className="flex flex-col gap-6 md:gap-12 lg:min-h-screen">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
                  Complete Remodeling
                </h2>
                <span className="text-gray-400 text-sm md:text-base">[1]</span>
              </div>

              <p className="text-sm sm:text-base md:text-lg max-w-[750px]">
                From outdated to outstanding—our complete home remodeling
                service transforms your house into a space that truly reflects
                your lifestyle. We go beyond surface-level updates, revitalizing
                every corner with a thoughtful balance of functionality, style,
                and comfort. Whether it’s modernizing kitchens and bathrooms,
                creating open-concept living areas, or enhancing storage and
                energy efficiency, our team ensures that every detail works in
                harmony. With expert craftsmanship, personalized design
                solutions, and a commitment to quality, we turn your vision into
                reality—making your home not just more beautiful, but also more
                practical and enjoyable for years to come.
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 md:gap-6">
              <svg className="w-full md:w-[300px] h-[2px] text-gray-300">
                <line
                  x1="0"
                  y1="1"
                  x2="300"
                  y2="1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <div className="flex flex-wrap gap-4 text-sm items-end text-gray-700">
                <span>• Stylish</span>
                <span>• Chef-inspired</span>
                <span>• Versatile</span>
              </div>
            </div>
          </div>

          {/* Service 2 */}
          <div className="lg:hidden px-4">
            <div className="relative w-full h-[300px] sm:h-[300px] overflow-hidden rounded-2xl">
              <Image
                src="/assets/Services/Bathroom Renovation.jpg"
                alt="Bathroom Remodeling"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 md:gap-12 lg:min-h-screen">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
                  Bathroom Remodeling
                </h2>
                <span className="text-gray-400 text-sm md:text-base">[2]</span>
              </div>

              <p className="text-sm sm:text-base md:text-lg max-w-[750px]">
                Turn your bathroom into a luxurious sanctuary where comfort
                meets sophistication. With custom fixtures tailored to your
                taste, elegant finishes that elevate the atmosphere, and smart
                storage solutions that maximize space, we design bathrooms that
                are as practical as they are beautiful. Whether you dream of a
                spa-inspired retreat with soothing details or a sleek, modern
                space built for efficiency, our remodeling expertise ensures
                every element is crafted for relaxation, functionality, and
                timeless style.
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 md:gap-6">
              <svg className="w-full md:w-[300px] h-[2px] text-gray-300">
                <line
                  x1="0"
                  y1="1"
                  x2="300"
                  y2="1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <div className="flex flex-wrap gap-4 text-sm items-end text-gray-700">
                <span>• Innovative</span>
                <span>• Spa-like</span>
                <span>• Impactful</span>
              </div>
            </div>
          </div>

          {/* Service 3 */}
          <div className="lg:hidden px-4">
            <div className="relative w-full h-[300px] sm:h-[300px] overflow-hidden rounded-2xl">
              <Image
                src="/assets/Services/Kitchen Renovation.jpg"
                alt="Kitchen Remodeling"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 md:gap-12 lg:min-h-screen">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
                  Kitchen Remodeling
                </h2>
                <span className="text-gray-400 text-sm md:text-base">[3]</span>
              </div>

              <p className="text-sm sm:text-base md:text-lg max-w-[750px]">
                Elevate your cooking experience with a kitchen remodel that
                blends sleek aesthetics with everyday functionality. Our designs
                focus on ergonomic layouts that make movement effortless,
                high-performance appliances that enhance efficiency, and custom
                cabinetry that maximizes storage without sacrificing style.
                Whether you envision a modern chef’s kitchen, a warm family
                gathering space, or a timeless design that balances both beauty
                and practicality, we create kitchens tailored to your
                lifestyle—where form and function work together seamlessly.
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 md:gap-6">
              <svg className="w-full md:w-[300px] h-[2px] text-gray-300">
                <line
                  x1="0"
                  y1="1"
                  x2="300"
                  y2="1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <div className="flex flex-wrap gap-4 text-sm items-end text-gray-700">
                <span>• Modern</span>
                <span>• Comfortable</span>
                <span>• Elegant</span>
              </div>
            </div>

            <Button
              className="self-center mt-6 md:mt-20 md:self-start"
              href="/services"
              text="Find Out More"
              variant="dark"
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

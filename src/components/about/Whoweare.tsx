"use client";


export default function WhoWeAre() {
  return (
    <section className="py-10 md:py-16 lg:py-24 pt-28 md:pt-32 lg:pt-48 px-4 md:px-8 lg:px-6">
      
      <div>
        <header className="px-2 md:px-6 lg:px-12 flex flex-col gap-4 md:gap-5">

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] text-start">
            Who We Are?
          </h2>

          {/* Content */}
          <div className="md:pr-10 lg:pr-28 mt-4 md:mt-5">

            <p className="text-sm sm:text-base md:text-lg mt-4 md:mt-7 text-[#4d4d4d] leading-relaxed">
              We are Shyam Civil Construction — dedicated to transforming
              ideas into solid, sustainable structures. We deliver
              high-quality construction and renovation services across
              residential, commercial, and industrial sectors.
            </p>

            <p className="text-sm sm:text-base md:text-lg mt-4 md:mt-5 text-[#4d4d4d] leading-relaxed">
              Our experienced team of engineers, project managers, and skilled
              laborers works with precision, passion, and purpose. We believe
              in solid structures, transparent communication, and timely
              execution, ensuring every project meets the highest standards of
              safety, design, and durability.
            </p>

            <p className="text-sm sm:text-base md:text-lg mt-4 md:mt-5 text-[#4d4d4d] leading-relaxed">
              Whether it’s building from the ground up or enhancing existing
              spaces, Shyam Civil Construction stands for integrity,
              innovation, and excellence. Our mission is simple — to build
              strong foundations, both structurally and in relationships.
            </p>

          </div>
        </header>
      </div>

    </section>
  );
}
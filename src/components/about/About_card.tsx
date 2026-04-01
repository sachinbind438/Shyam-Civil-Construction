import Button from "../button/button";

export default function AboutCard() {
  return (
    <div className="py-8 md:py-12 px-4 md:px-6 flex flex-col">
      {/* Heading */}
      <h4 className="text-center font-raleway text-5xl sm:text-4xl md:text-5xl lg:text-7xl">
        About Us
      </h4>

      {/* Content */}
      <div className="py-12 px-6 flex flex-col  gap-10 ">
        <div className="text-justify space-y-4 md:space-y-6">
          <p className="text-sm sm:text-base md:text-lg">
            Shyam Civil Construction is a trusted name in residential,
            commercial, and interior renovation services. We specialize in
            complete property transformations—ranging from structural work and
            space planning to modular furniture, plumbing, electrical rewiring,
            and surface finishing. With a strong foundation in engineering and a
            keen eye for design, we ensure every project is tailored to our
            client’s needs, lifestyle, and budget.
          </p>

          <p className="text-sm sm:text-base md:text-lg">
            Our approach combines precision, creativity, and end-to-end project
            management to deliver seamless results. Whether it's reimagining
            interiors, upgrading utilities, or revitalizing exteriors, we
            prioritize quality craftsmanship, timely execution, and lasting
            value. At Shyam Civil Construction, we don’t just renovate spaces—we
            redefine how you live and work in them.
          </p>
        </div>
      </div>

      {/* CTA */}
      <Button
        className="self-center"
        href="/about"
        text="Know Us Better"
        variant="dark"
        size="md"
      />
    </div>
  );
}

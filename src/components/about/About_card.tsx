import Button from "../button/button";


export default function AboutCard() {
  return (
 <div className="py-12 px-6 flex flex-col  gap-20 ">
          <h4 className="text-center text-7xl font-raleway ">About Us</h4>
          <div className="text-justify   ">
            <p className="px-12 ">
              Shyam Civil Construction is a trusted name in residential,
              commercial, and interior renovation services. We specialize in
              complete property transformations—ranging from structural work and
              space planning to modular furniture, plumbing, electrical
              rewiring, and surface finishing. With a strong foundation in
              engineering and a keen eye for design, we ensure every project is
              tailored to our client’s needs, lifestyle, and budget.
            </p>
            <p className="">
              <br />
            </p>
            <p className="px-12 ">
              Our approach combines precision, creativity, and end-to-end
              project management to deliver seamless results. Whether it's
              reimagining interiors, upgrading utilities, or revitalizing
              exteriors, we prioritize quality craftsmanship, timely execution,
              and lasting value. At Shyam Civil Construction, we don’t just
              renovate spaces—we redefine how you live and work in them.
            </p>
          </div>
          <Button
            className="self-center"
            href="/about"
            text="Know Us Better"
            variant="dark"
            size="lg"
          />
        </div>
    );
}
import Image from "next/image";
import Button from "../../components/button/button";
import { Raleway } from "next/font/google";
import ImageStack from "../../components/about/Image_Stack_Component";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
});

export default function About() {
  return (
    <main className="">
      {/* Header */}
      <section className=" py-6 pt-48 px-6 ">
        <div>
          <header className="px-12 gap-5">
            <div>
              <h1 className="text-7xl font-raleway!">Who We Are?</h1>
            </div>
            <div className="">
              <p className="text-base mt-5 text-[#4d4d4d] leading-relaxed">
                We are Shyam Civil Construction — dedicated to transforming
                ideas into solid, sustainable structures. We deliver
                high-quality construction and renovation services across
                residential, commercial, and industrial sectors.
              </p>
              <p className="text-base mt-5 text-[#4d4d4d]   leading-relaxed">
                Our experienced team of engineers, project managers, and skilled
                laborers works with precision, passion, and purpose. We believe
                in solid structures, transparent communication, and timely
                execution, ensuring every project meets the highest standards of
                safety, design, and durability.
              </p>
              <p className="text-base mt-5 text-[#4d4d4d]  leading-relaxed">
                hether it’s building from the ground up or enhancing existing
                spaces, Shyam Civil Construction stands for integrity,
                innovation, and excellence. Our mission is simple — to build
                strong foundations, both structurally and in relationships.
              </p>
            </div>
          </header>
        </div>
      </section>

      {/* Our Approach */}
      <section className="pl-6 ">
        <div className="flex flex-row items-start justify-between gap-24">
          <div className="py-48 pl-12 pr-6  w-[45%]">
            <header className="flex flex-col gap-6">
              <h2 className="text-[80px] font-raleway font-bold text-start!">
                Our Approach
              </h2>

              <p className="text-[#4d4d4d] leading-relaxed max-w-xl">
                Designing your space is a journey that we embark on together.
                Our process is rooted in collaboration, creativity, and clarity.
                Here’s how we work:
              </p>

              <div>
                <ul className="list-decimal list-inside text-[#4d4d4d] space-y-3 text-lg leading-relaxed">
                  <li>
                    Initial Consultation: Understanding your needs, style, and
                    goals.
                  </li>
                  <li>
                    Design Concept: Crafting a vision that aligns with your
                    space.
                  </li>
                  <li>
                    Implementation: Bringing the design to life with quality
                    craftsmanship.
                  </li>
                  <li>
                    Final Reveal: Unveiling a space that reflects your vision
                    and exceeds expectations.
                  </li>
                </ul>
              </div>
            </header>
          </div>
          <div className="w-[42%] flex items-center relative p-6">
            <div>
            <ImageStack />
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <h3 className="text-3xl font-raleway font-semibold">Vision</h3>
          <p className="text-[#4d4d4d] text-base leading-relaxed">
            To be a leader in construction and renovation by delivering
            innovative, high-quality spaces that stand the test of time.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-3xl font-raleway font-semibold">Mission</h3>
          <p className="text-[#4d4d4d] text-base leading-relaxed">
            To turn our clients’ ideas into beautifully crafted spaces with
            integrity, professionalism, and transparent communication.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-3xl font-raleway font-semibold">Values</h3>
          <p className="text-[#4d4d4d] text-base leading-relaxed">
            Integrity, quality craftsmanship, innovation, and client-focused
            service at every stage of the project lifecycle.
          </p>
        </div>
      </section>

      {/* Optional Visual / Image Panel */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-[350px] rounded-[40px] overflow-hidden">
          <Image
            fill
            src="/about-image-1.jpg"
            alt="Shyam Civil Construction Work"
            className="object-cover"
          />
        </div>
        <div className="relative h-[350px] rounded-[40px] overflow-hidden">
          <Image
            fill
            src="/about-image-2.jpg"
            alt="Construction Team"
            className="object-cover"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <p className="text-lg text-[#4d4d4d] max-w-xl mx-auto leading-relaxed">
          Want to discuss your next project? We’re here to help. From concept to
          completion, we build spaces that inspire.
        </p>
        <div className="mt-6">
          <Button href="/contact" text="Get In Touch" variant="dark" />
        </div>
      </section>
    </main>
  );
}

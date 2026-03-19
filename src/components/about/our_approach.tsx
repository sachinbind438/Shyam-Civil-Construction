import ImageStack from "./Image_Stack_Component";
import { Raleway } from "next/font/google";

const raleway = Raleway({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-raleway",
  });

export default function OurApproach() {
  return (
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
    );  
}

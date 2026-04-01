import ImageStack from "./Image_Stack_Component";
import { Raleway } from "next/font/google";

const raleway = Raleway({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-raleway",
  });

export default function OurApproach() {
  return (
<section className="px-4 md:px-6 lg:px-12 py-10 md:py-16">
  <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

    {/* TEXT */}
    <div className="hidden lg:block w-full lg:w-[50%] flex-col justify-center">
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] mb-6">
        Our Approach
      </h2>

      <p className="text-[#4d4d4d] mb-6 max-w-xl">
        Designing your space is a journey that we embark on together.
        Our process is rooted in collaboration, creativity, and clarity.
      </p>

      <ul className="space-y-3 text-base md:text-lg text-[#4d4d4d]">
        <li>1. Initial Consultation: Understanding your needs, style, and goals.</li>
        <li>2. Design Concept: Crafting a vision that aligns with your space.</li>
        <li>3. Implementation: Bringing the design to life with quality craftsmanship.</li>
        <li>4. Final Reveal: Unveiling a space that reflects your vision and exceeds expectations.</li>
      </ul>
    </div>

    {/* IMAGE STACK */}
    <div className="w-full lg:w-[50%] flex justify-center items-center">
      <ImageStack />
    </div>

  </div>
</section>
    );  
}

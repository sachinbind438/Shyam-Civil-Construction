import Image from "next/image";
import Button from "../../components/button/button";
import { Raleway } from "next/font/google";
import OurAproach from "../../components/about/our_approach";
import TestimonialComponent from "../../components/Testimonial/TestimonialComponent";
import WhoWeAre from "../../components/about/Whoweare";
import TeamSection from "../../components/about/team";
import CTA from "../../components/about/CTA";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
});

export default function About() {
  return (
    <main className="pt-10">
      <WhoWeAre />
      <TeamSection />
      <OurAproach />
      <TestimonialComponent />
      <CTA />
    </main>
  );
}

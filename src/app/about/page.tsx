import Image from "next/image";
import Button from "../../components/button/button";
import { Raleway } from "next/font/google";
import OurAproach from "../../components/about/our_approach";
import TestimonialComponent from "../../components/Testimonial/TestimonialComponent";
import WhoWeAre from "../../components/about/Whoweare";
import TeamSection from "../../components/about/team";
import CTA from "../../components/about/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Shyam Civil Construction — our story, values, and commitment to quality renovation services.",
  alternates: {
    canonical: "https://shyamcivilconstruction.in/about",
  },
};

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

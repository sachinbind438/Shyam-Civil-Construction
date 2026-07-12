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
  description:
    "Learn about Shyam Civil Construction — Mumbai's trusted civil contractor since [year]. Expert team delivering premium residential, commercial, and interior renovations.",
  alternates: {
    canonical: "https://www.shyamcivilconstruction.in/about",
  },
  openGraph: {
    title: "About Shyam Civil Construction",
    description:
      "Mumbai's trusted civil contractor. Expert team delivering premium renovations.",
    url: "https://www.shyamcivilconstruction.in/about",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
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
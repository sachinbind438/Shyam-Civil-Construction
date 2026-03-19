import Image from "next/image";
import Button from "../../components/button/button";
import { Raleway } from "next/font/google";
import OurAproach from "../../components/about/our_approach";
import TestimonialComponent from "../../components/TestimonialComponent";
import WhoWeAre from "../../components/about/Whoweare";
import TeamSection from "../../components/about/team";


const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
});

export default function About() {
  return (
    <main className="">
      <WhoWeAre />
      <TeamSection />
      <OurAproach />
      <TestimonialComponent />
      <section className="text-center p-10 gap-5  flex flex-col items-center">
        <h2 className="text-7xl!  m-6!">Ready to Transform Your Space?</h2>
        <p className="text-2xl! mb-8!">Contact us today for a free consultation and let’s bring your vision to life!</p>
        <Button href="/contact" 
        text="Get a Free Estimate"
        size="lg"
        />
      </section>
    </main>
  );
}

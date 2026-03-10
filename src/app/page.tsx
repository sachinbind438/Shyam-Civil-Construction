import Hero from "../components/Hero/Hero";
import AboutCard from "../components/about/About_card";
import Gallery from "../components/Gallery";
import ProjectImageGrid from "../components/Projectgrids";
import TestimonialsSection from "../components/testimonails_components";

import ServiceGrid from "../components/ServiceGrid_component";

export default function Home() {
  return (
    <main>
      <Hero
        title="Transforming Spaces,"
        subtitle="Creating Dreams"
        quote="Premium Renovation Services Tailored to Your Vision"
        imageSrc="/hero-image.avif"
        ctaHref="/contact"
        ctaText="Get a Free Estimate"
      />
      {/**  About Us Section **/}
      <section>
        <AboutCard />
      </section>
      {/*Our gallery*/}
      <section>
        <Gallery />
      </section>
      {/*Projects*/}
      <section>
        <ProjectImageGrid />
      </section>
      {/*Services*/}

      <section>
        <TestimonialsSection />
      </section>
      <section>
        <ServiceGrid />
      </section>
    </main>
  );
}

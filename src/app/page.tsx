import Hero from "../components/Hero/Hero";
import AboutCard from "../components/about/About_card";
import Gallery from "../components/Projects/Gallery";
import ProjectImageGrid from "../components/Projects/Projectgrids";
import ServiceGrid from "../components/Service/ServiceGrid_component";

export default function Home() {
  return (
    <main>
      <section>
      <Hero  
        title="Transforming Spaces,"
        subtitle="Creating Dreams"
        quote="Premium Renovation Services Tailored to Your Vision"
        imageSrc="/hero-image.avif"
        ctaHref="/contact"
        ctaText="Get a Free Estimate"
      />
      </section>
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
        <ServiceGrid />
      </section>
    </main>
  );
}

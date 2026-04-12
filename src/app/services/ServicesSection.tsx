import ServiceGrid from "../../components/Service/ServiceGrid";
import ServiceDetail from "../../components/Service/ServiceDetail";

interface ServiceData {
  index: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  features: string;
}

interface Props {
  services: ServiceData[];
}

export default function ServicesSection({ services = [] }: Props) {
  return (
    <main>
      <section className="w-full pb-6 pt-35 sm:pt-32 md:pt-48 px-4 sm:px-6 gap-8 sm:gap-12 flex flex-col">
        <div>
          <header className="px-4 sm:px-8 md:px-12 gap-4 sm:gap-6 flex flex-col">
            <h2 className="text-[32px] sm:text-[42px] md:text-[56px] lg:text-[72px] text-left leading-tight font-Raleway! text-black">
              Start Building Your Dream Project
            </h2>
            <p className="text-[15px] sm:text-[16px] md:text-[18px] text-gray-600 max-w-[700px]">
              Write to us by completing the form. We will get back to you as
              soon as possible!
            </p>
          </header>
        </div>

        <div>
          <ServiceGrid />
        </div>
      </section>

      <section>
        <div>
          <header className="px-4 sm:px-8 md:px-12 pt-12 sm:pt-16 md:pt-24 pb-0 gap-6 flex flex-col">
            <h2 className="text-[32px] sm:text-[42px] md:text-[56px] lg:text-[72px] text-left leading-tight font-Raleway! text-black">
              Explore Our Services
            </h2>
          </header>
        </div>

        {services.length === 0 ? (
          <p className="px-4 sm:px-8 md:px-12 py-12 text-gray-400 text-lg">
            No services available at the moment.
          </p>
        ) : (
          services.map((service, index) => (
            <ServiceDetail
              key={service.slug}
              index={index}
              title={service.title}
              image={service.image}
              description={service.description}
              features={service.features}
            />
          ))
        )}
      </section>
    </main>
  );
}

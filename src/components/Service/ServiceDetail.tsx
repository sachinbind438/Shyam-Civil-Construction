import Image from "next/image";

interface ServiceDetailProps {
  index: number;
  image: string;
  title: string;
  description: string;
  features: string;
}

export default function ServiceDetail({
  index,
  image,
  title,
  description,
  features,
}: ServiceDetailProps) {
  const isEven = index % 2 === 0;

  const ImageBlock = (
    <div className="relative w-full lg:w-1/2 h-[260px] sm:h-[320px] md:h-[450px] lg:h-[calc(100vh-48px)] rounded-2xl lg:rounded-br-[72px] lg:rounded-tl-[72px] overflow-hidden">
      <Image src={image} alt={title} fill className="object-cover" />
    </div>
  );

  const ContentBlock = (
    <div className="w-full lg:w-1/2 pt-6 sm:pt-10 md:pt-14 lg:pt-28 px-2 sm:px-4 md:px-6 lg:px-12 flex flex-col justify-center">
      <h2 className="text-3xl sm:text-3xl md:text-5xl lg:text-[70px] leading-tight font-normal text-black">
        {title}
      </h2>

      <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-700">
        {description}
      </p>

      <div className="mt-6 sm:mt-8 md:mt-10">
        <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">
          Key Features:
        </h3>
        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600 list-disc pl-5">
          {features
            .split("\n")
            .filter(Boolean)
            .map((item) => (
              <li key={item.trim()}>{item.trim()}</li>
            ))}
        </ul>
      </div>
    </div>
  );

  return (
    <section className="w-full px-4 sm:px-6 py-10 sm:py-12">
      {/* ── MOBILE: always image on top, content below ── */}
      <div className="flex flex-col gap-6 lg:hidden">
        {ImageBlock}
        {ContentBlock}
      </div>

      {/* ── DESKTOP: original alternating layout unchanged ── */}
      <div className="hidden lg:flex flex-row gap-10 min-h-screen">
        {isEven ? (
          <>
            {ImageBlock}
            {ContentBlock}
          </>
        ) : (
          <>
            {ContentBlock}
            {ImageBlock}
          </>
        )}
      </div>
    </section>
  );
}
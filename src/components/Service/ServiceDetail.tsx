"use client";

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
    <div className="relative w-full  lg:w-1/2 h-[calc(100vh-48px)] rounded-br-[72px] rounded-tl-[72px] p-6 overflow-hidden ">
      <Image src={image} alt={title} fill className="object-cover" priority />
    </div>
  );

  const ContentBlock = (
    <div className="w-full pt-28 pr-10 pl-12 lg:w-1/2 flex flex-col justify-center">
      <h2 className="text-[80px]! text-left! md:text-[56px] leading-tight font-normal text-black">
        {title}
      </h2>

      <p className="mt-6 text-[18px]! md:text-[18px]">{description}</p>
      <div className="mt-10 ">
        <h3 className="text-[16px]! text-left! px-8 font-medium mb-4">
          Key Features:
        </h3>
        <div className="mt-5 pl-12  text-[15px] md:text-[16px]">
          <ul className="space-y-4 text-[15px] md:text-[16px] text-gray-600 list-disc pl-5 hyphens-none break-normal">
            {features
              .split("\n")
              .filter(Boolean)
              .map((item, index) => (
                <li key={index}>{item.trim()}</li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full min-h-screen px-6 py-12 pb-30">
      <div className="flex flex-col lg:flex-row gap-6">
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

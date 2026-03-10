import Image from "next/image";

export default function ImageStack() {
  return (
    <div className="relative w-[520px] h-[520px]">
      
      {/* Back Image */}
      <div className="absolute top-0 right-0 rotate-4 z-10">
        <div className="relative w-[480px] h-[480px]  overflow-hidden shadow-lg">
          <Image
            src="/assets/About/about-middle.avif"
            alt="Project image 3"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Middle Image */}
      <div className="absolute top-20 right-20 -rotate-4 z-20">
        <div className="relative w-[480px] h-[480px]  overflow-hidden shadow-xl">
          <Image
            src="/assets/About/about-top.avif"
            alt="Project image 2"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Front Image */}
      <div className="absolute top-40 right-40   -rotate-12     z-30">
        <div className="relative w-[480px] h-[480px]  overflow-hidden shadow-2xl">
          <Image
            src="/assets/About/about-bottom.avif"
            alt="Project image 1"
            fill
            className="object-cover"
          />
        </div>
      </div>

    </div>
  );
}

import ImageCard from "../Cards/ImageCard";
import Button from "../button/button";  

export default function ProjectImageGrid() {
  return (
    <div className="flex flex-row py-24 px-0">
          <div className="flex flex-col pl-[72px] w-[50%] pr-6 gap-12">
            <div className="space-y-5">
              <div className=" text-7xl font-raleway justify-items-start! ">
                <h4>Projects</h4>
              </div>
              <div>
                <p>
                  Our architectural design projects are driven by innovation and
                  creativity, transforming ideas into functional, beautiful
                  spaces. Whether residential, commercial, or mixed-use, each
                  project is thoughtfully crafted with attention to detail. We
                  blend aesthetics, sustainability, and practicality to create
                  unique environments that meet our clients' needs and inspire
                  everyday living.
                </p>
              </div>
            </div>
            <div className="p-2"></div>

            <Button
              className="self-center"
              href="/projects"
              text="View Our Project"
              variant="dark"
              size="lg"
            />
          </div>
          <div className="w-[55%] pr-6">
            <div className="grid grid-cols-2 gap-6">

      {/* Top Left - Large */}
      <ImageCard
        src="/assets/projects-1.jpg"
        className="h-[375px] w-[375px]"
        title="Artistic Vessel Sink"
        href="/projects/artistic-vessel-sink"
        showArrow
      />

      {/* Top Right */}
      <ImageCard
        src="/assets/projects-2.jpg"
        className="h-[375px] w-[375px]"
        title="Modern Kitchen"
        href="/projects/modern-kitchen"
        showArrow
      />

      {/* Bottom Left */}
      <ImageCard
        src="/assets/projects-3.jpg"
        className="h-[375px] w-[375px]"
        title="Rustic Faucet"
        href="/projects/rustic-faucet"
        showArrow
      />

      {/* Bottom Right - Slightly shorter */}
      <ImageCard
        src="/assets/projects-4.jpg"
        className="h-[375px] w-[375px]"
        title="Bathroom Mosaic"
        href="/projects/bathroom-mosaic"
        showArrow
      />
    </div>
          </div>
        </div>
  );
}
  

         
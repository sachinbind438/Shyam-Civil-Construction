import ImageCard from "../Cards/ImageCard";
import Button from "../button/button";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";

export default async function ProjectImageGrid() {
  await connectDB();

  const projects = await Project.find({})
    .sort({ _id: 1 })
    .limit(4)
    .lean<any[]>();

  return (
    <div className="flex flex-col lg:flex-row py-5 px-4 md:py-16 gap-10">
      {/* LEFT CONTENT */}
      <div className="flex flex-col px-4 md:px-6 lg:pl-[72px] lg:w-[50%] lg:pr-6 pt-6 md:pt-12 gap-6 md:gap-12">
        <div className="space-y-4 md:space-y-5">
          <div className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl">
            <h4 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl">
              Projects
            </h4>
          </div>

          <p className="text-sm sm:text-base md:text-lg max-w-xl">
            Our architectural design projects are driven by innovation and
            creativity, transforming ideas into functional, beautiful spaces.
            Whether residential, commercial, or mixed-use, each project is
            thoughtfully crafted with attention to detail. We blend aesthetics,
            sustainability, and practicality to create unique environments that
            meet our clients' needs and inspire everyday living.
          </p>
        </div>

        <Button
          className="hidden lg:inline-flex self-start"
          href="/projects"
          text="View Our Project"
          variant="dark"
          size="lg"
        />
      </div>

      {/* RIGHT GRID */}
      <div className="px-4 md:px-4 lg:pr-4 lg:w-[55%] pt-0 md:pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
          {projects.map((project, index) => (
            <ImageCard
              key={project._id?.toString() || index}
              src={project.coverImage || "/assets/Service.avif"}
              className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[375px]"
              title={project.title}
              href={`/projects/${project.slug}`}
              showArrow
              showOverlay
              overlayClassName="rounded-[72px]!"
            />
          ))}
        </div>
      </div>
      <div className="lg:hidden flex justify-center mt-6">
        <Button
          href="/projects"
          text="View Our Project"
          variant="dark"
          size="md"
        />
      </div>
    </div>
  );
}

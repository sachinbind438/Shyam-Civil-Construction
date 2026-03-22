import ImageCard from "../Cards/ImageCard";
import Button from "../button/button";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";

export default async function ProjectImageGrid() {
  await connectDB();

  // Fetch last 4 projects for the grid
  const projects = await Project.find({})
    .sort({ _id: 1 })
    .limit(4) 
    .lean<any[]>();

  return (
    <div className="flex flex-row py-16 ">
      <div className="flex flex-col pl-[72px] w-[50%] pr-6 pt-12 gap-12">
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
      <div className="w-[55%] pr-6 pt-12 ">
        <div className="grid grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ImageCard
              key={project._id?.toString() || index}
              src={project.coverImage || "/assets/Service.avif"}
              className="h-[375px] w-[375px]"
              title={project.title}
              href={`/projects/${project.slug}`}
              showArrow
            />
          ))}
        </div>
      </div>
    </div>
  );
}
import EditProjectPage from "@/app/admin/projects/[id]/page";
import Link from "next/link";
import DeleteProjectButton from "../admin/DeleteProjectButton";

interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  coverImage?: string;
  createdAt: string;
}

interface ProjectCardAdminProps {
  projects: Project[];
}


export default function ProjectCardAdmin({ projects }: ProjectCardAdminProps) {
  return (
    <>
{/* ================= MOBILE CARDS ================= */}
<div className="md:hidden space-y-4">
  {projects.length === 0 ? (
    <div className="text-center text-white/30 text-sm">
      No projects yet.
    </div>
  ) : (
    projects.map((p: any) => (
      <div
        key={p._id.toString()}
        className="rounded-2xl p-4 bg-white/5 border border-white/10"
      >
        {/* Top */}
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10">
            {p.coverImage && (
              <img src={p.coverImage} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="flex-1">
            <p className="text-white font-medium">{p.title}</p>
            <p className="text-white/30 text-xs">
              /projects/{p.slug}
            </p>

            <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-[#C9A96E]/20 text-[#C9A96E]">
              {p.category}
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-white/30 text-xs">
            {new Date(p.createdAt).toLocaleDateString("en-IN")}
          </p>

          <div className="flex gap-3">
            <Link href={`/projects/${p.slug}`} target="_blank">
              👁
            </Link>
            <Link href={`/admin/projects/${p._id}`}>
              ✏️
            </Link>
            <DeleteProjectButton id={p._id.toString()} />
          </div>
        </div>
      </div>
    ))
  )}
</div>
    </>
  );  
}

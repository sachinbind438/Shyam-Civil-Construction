import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/jwt-auth";
import Link from "next/link"
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";

export default async function AdminProjectsPage() {
  // Verify JWT token
  await verifyAdminToken();

  await connectDB();
  const projects = await Project.find({}).sort({ createdAt: -1 }).lean<any[]>();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Projects</h1>
          <p className="text-white/40 text-sm">{projects.length} total projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "#C9A96E", color: "#0a1520" }}
        >
          <span>+</span> Add Project
        </Link>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-12 px-6 py-3 text-xs uppercase tracking-wider"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.35)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="col-span-1"></div>
          <div className="col-span-4">Title</div>
          <div className="col-span-3">Category</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Rows */}
        {projects.length === 0 ? (
          <div className="px-6 py-16 text-center text-white/30 text-sm">
            No projects yet.{" "}
            <Link href="/admin/projects/new" className="underline" style={{ color: "#C9A96E" }}>
              Add your first project
            </Link>
          </div>
        ) : (
          projects.map((p: any, i: number) => (
            <div
              key={p._id.toString()}
              className="grid grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-white/2"
              style={{ borderBottom: i < projects.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
            >
              {/* Thumbnail */}
              <div className="col-span-1">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10">
                  {p.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>

              {/* Title + slug */}
              <div className="col-span-4">
                <p className="text-white text-sm font-medium truncate">{p.title}</p>
                <p className="text-white/30 text-xs mt-0.5 truncate">/projects/{p.slug}</p>
              </div>

              {/* Category */}
              <div className="col-span-3">
                <span
                  className="text-xs px-2.5 py-1 rounded-full capitalize"
                  style={{
                    background: "rgba(201,169,110,0.12)",
                    color: "#C9A96E",
                  }}
                >
                  {p.category}
                </span>
              </div>

              {/* Date */}
              <div className="col-span-2 text-white/30 text-xs">
                {new Date(p.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <Link
                  href={`/projects/${p.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg transition-colors text-white/30 hover:text-white"
                  title="View on site"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </Link>
                <Link
                  href={`/admin/projects/${p._id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}
                >
                  Edit
                </Link>
                <DeleteProjectButton id={p._id.toString()} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

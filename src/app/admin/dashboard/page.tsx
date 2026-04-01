import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";
import { Message } from "@/backend/db/models/Message";
import Link from "next/link";
import { verifyAdminToken } from "@/lib/jwt-auth";

export default async function AdminDashboard() {
  await verifyAdminToken();
  await connectDB();

  const [
    totalProjects,
    interiorCount,
    residentialCount,
    commercialCount,
    unreadMessages,
    recentProjects,
  ] = await Promise.all([
    Project.countDocuments({}),
    Project.countDocuments({ category: "Interior" }),
    Project.countDocuments({ category: "Residential" }),
    Project.countDocuments({ category: "Commercial" }),
    Message.countDocuments({ read: false }),
    Project.find({}).sort({ createdAt: -1 }).limit(5).lean().exec() as Promise<
      any[]
    >,
  ]);

  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      color: "#C9A96E",
      href: "/admin/projects",
    },
    {
      label: "Interior",
      value: interiorCount,
      color: "#4A7C59",
      href: "/admin/projects",
    },
    {
      label: "Residential",
      value: residentialCount,
      color: "#1B3A5C",
      href: "/admin/projects",
    },
    {
      label: "Commercial",
      value: commercialCount,
      color: "#8B9467",
      href: "/admin/projects",
    },
    {
      label: "Unread Messages",
      value: unreadMessages,
      color: "#8B3A3A",
      href: "/admin/messages",
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-white/80 text-base sm:text-lg">Welcome back.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl p-4 sm:p-5 transition-all hover:scale-[1.02]"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-3">
              {s.label}
            </p>
            <p
              className="text-xl sm:text-2xl font-bold"
              style={{ color: s.color }}
            >
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Projects */}
        <div
          className="lg:col-span-2 rounded-2xl p-4 sm:p-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-white text-xl sm:text-2xl md:text-4xl font-semibold">
              Recent Projects
            </h2>
            <Link
              href="/admin/projects/new"
              className="text-xs sm:text-sm px-3 py-1.5 rounded-full font-medium hover:scale-[1.02] transition-all hover:cursor-pointer shrink-0"
              style={{ background: "#C9A96E", color: "#0a1520" }}
            >
              + Add New
            </Link>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {recentProjects.map((p: any) => (
              <div
                key={p._id.toString()}
                className="flex items-center justify-between py-2 sm:py-3 border-b gap-3"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-white/60 text-sm sm:text-md font-medium truncate">
                    {p.title}
                  </p>
                  <p className="text-white/40 text-xs sm:text-sm mt-0.5">
                    {p.category}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/admin/projects/${p._id}`}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs bg-[#9f96968d] text-white font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/20 hover:bg-[#C9A96E] hover:text-black"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/projects/${p.slug}`}
                    target="_blank"
                    className="text-xs sm:text-sm rounded-lg px-2 sm:px-3 py-1 bg-[#ffffff1a] text-[rgba(255,255,255,0.6)] hover:scale-105 hover:shadow-lg hover:shadow-white/20 transition-all"
                  >
                    View ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="rounded-2xl p-4 sm:p-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h2 className="text-white text-xl sm:text-2xl md:text-4xl font-semibold mb-4 sm:mb-6">
            Quick Actions
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {[
              {
                label: "Add New Project",
                href: "/admin/projects/new",
                bg: "#C9A96E",
                fg: "#0a1520",
              },
              {
                label: "View All Projects",
                href: "/admin/projects",
                bg: "rgba(255,255,255,0.08)",
                fg: "rgba(255,255,255,0.6)",
              },
              {
                label: "View Messages",
                href: "/admin/messages",
                bg: "rgba(255,255,255,0.08)",
                fg: "rgba(255,255,255,0.6)",
              },
              {
                label: "View Live Site",
                href: "/",
                bg: "rgba(255,255,255,0.08)",
                fg: "rgba(255,255,255,0.6)",
              },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center justify-between w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm hover:opacity-50 hover:scale-105 transition-all"
                style={{ background: a.bg, color: a.fg }}
              >
                {a.label} <span>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

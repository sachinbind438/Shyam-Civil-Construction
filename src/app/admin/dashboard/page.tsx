import { connectDB } from "@/lib/mongodb";
import { Project } from "@/backend/db/models/Project";
import { Message } from "@/backend/db/models/Message";
import mongoose from "mongoose";
import Link from "next/link";
import { verifyAdminToken } from "@/lib/jwt-auth";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

export default async function AdminDashboard() {
  // Verify JWT token
  await verifyAdminToken();

  await connectDB();

  const [totalProjects, interiorCount, residentialCount, commercialCount, unreadMessages, recentProjects] =
    await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ category: "Interior" } as any),
      Project.countDocuments({ category: "Residential" } as any),
      Project.countDocuments({ category: "Commercial" } as any),
      Message.countDocuments({ read: false } as any),
      Project.find({}).sort({ createdAt: -1 }).limit(5).lean<any[]>().exec(),
    ]);

  const stats = [
    { label: "Total Projects",  value: totalProjects,    color: "#C9A96E", href: "/admin/projects" },
    { label: "Interior", value: interiorCount,    color: "#4A7C59", href: "/admin/projects" },
    { label: "Residential",     value: residentialCount, color: "#1B3A5C", href: "/admin/projects" },
    { label: "Commercial",      value: commercialCount,  color: "#8B9467", href: "/admin/projects" },
    { label: "Unread Messages", value: unreadMessages,   color: "#8B3A3A", href: "/admin/messages" },
  ];

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-white/40 text-sm">Welcome back.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className="rounded-2xl p-5 transition-all hover:scale-[1.02]"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">{s.label}</p>
            <p className="text-4xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold">Recent Projects</h2>
            <Link href="/admin/projects/new"
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: "#C9A96E", color: "#0a1520" }}>+ Add New</Link>
          </div>
          <div className="space-y-3">
            {recentProjects.map((p: any) => (
              <div key={p._id.toString()}
                className="flex items-center justify-between py-3 border-b"
                style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <div>
                  <p className="text-white text-sm font-medium">{p.title}</p>
                  <p className="text-white/35 text-xs mt-0.5">{p.category}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/projects/${p._id}`}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>Edit</Link>
                  <Link href={`/projects/${p.slug}`} target="_blank"
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>View ↗</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-white font-semibold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "Add New Project",   href: "/admin/projects/new", bg: "#C9A96E",                  fg: "#0a1520"                  },
              { label: "View All Projects", href: "/admin/projects",     bg: "rgba(255,255,255,0.08)",   fg: "rgba(255,255,255,0.6)"    },
              { label: "View Messages",     href: "/admin/messages",     bg: "rgba(255,255,255,0.08)",   fg: "rgba(255,255,255,0.6)"    },
              { label: "View Live Site",    href: "/",                   bg: "rgba(255,255,255,0.08)",   fg: "rgba(255,255,255,0.6)"    },
            ].map((a) => (
              <Link key={a.label} href={a.href}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm hover:opacity-90"
                style={{ background: a.bg, color: a.fg }}>
                {a.label} <span>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
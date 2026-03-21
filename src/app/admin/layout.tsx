import { verifyAdminToken } from "@/lib/jwt-auth";
import AdminSidebar from "../../components/admin/AdminSidebar";

// src/app/admin/layout.tsx
// ── SERVER COMPONENT — no "use client" ───────────────────────────────────────
// Auth check happens in each page individually.
// This layout ONLY controls the visual shell.



export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if this is the login page - don't show sidebar
  const isLoginPage = children?.toString().includes('AdminLoginPage');

  if (isLoginPage) {
    return (
      <div className="min-h-screen" style={{ background: "#0a1520" }}>
        {children}
      </div>
    );
  }

  // For authenticated admin pages, show full layout with sidebar
  return (
    <div className="min-h-screen p-10 pt-40" style={{ background: "" }}>
      <div className="flex rounded-3xl overflow-hidden" style={{ background: "#0a1520" }}>
        <AdminSidebar />
        <main className="flex-1 overflow-auto min-h-[80vh]">
          {children}
        </main>
      </div>
    </div>
  );
}
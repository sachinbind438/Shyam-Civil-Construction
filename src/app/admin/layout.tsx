'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-[#0a1520]">
        {children}
      </div>
    );
  }

  return (
    <div className=" p-4 pt-14  md:pt-20 lg:pt-40 lg:p-12">
      
      <div
        className="rounded-2xl overflow-hidden "
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex flex-col lg:flex-row">
          
          {/* SIDEBAR */}
          <AdminSidebar />

          {/* CONTENT */}
          <main className="flex-1 overflow-hidden rounded-2xl lg:rounded-none p-6 md:p-8 bg-[#0a1520]">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
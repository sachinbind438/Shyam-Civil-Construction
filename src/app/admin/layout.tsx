import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
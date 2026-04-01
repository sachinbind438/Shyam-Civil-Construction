import { connectDB } from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/jwt-auth";
import { Message } from "@/backend/db/models/Message";

export default async function AdminMessagesPage() {
  await verifyAdminToken();
  await connectDB();

  const messages = await Message.find({}).sort({ createdAt: -1 }).lean().exec();

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
          Messages
        </h1>

        <p className="text-white/40 text-sm">
          {unread > 0 ? (
            <>
              <span className="text-[#C9A96E]">{unread} unread</span> ·{" "}
              {messages.length} total
            </>
          ) : (
            `${messages.length} total messages`
          )}
        </p>
      </div>

      {/* EMPTY STATE */}
      {messages.length === 0 ? (
        <div className="rounded-2xl p-10 md:p-16 text-center text-white/25 text-sm border border-white/10">
          No messages yet. They will appear here when someone fills your contact form.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m._id.toString()}
              className="rounded-2xl p-4 sm:p-5 md:p-6 transition-all"
              style={{
                background: m.read
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(201,169,110,0.05)",
                border: `1px solid ${
                  m.read
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(201,169,110,0.15)"
                }`,
              }}
            >
              {/* TOP SECTION */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                
                {/* LEFT CONTENT */}
                <div className="flex-1">
                  
                  {/* NAME + BADGE */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <p className="text-white font-medium text-base sm:text-lg">
                      {m.name}
                    </p>

                    {!m.read && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A96E]/20 text-[#C9A96E]">
                        New
                      </span>
                    )}
                  </div>

                  {/* META INFO */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 text-sm text-white/40 mb-3">
                    
                    <a
                      href={`mailto:${m.email}`}
                      className="hover:text-white transition"
                    >
                      {m.email}
                    </a>

                    {m.phone && (
                      <a
                        href={`tel:${m.phone}`}
                        className="hover:text-white transition"
                      >
                        {m.phone}
                      </a>
                    )}

                    <span>
                      {new Date(m.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* MESSAGE */}
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                    {m.message}
                  </p>
                </div>

                {/* ACTION BUTTON */}
                <div className="flex md:flex-col gap-2 shrink-0">
                  <a
                    href={`mailto:${m.email}`}
                    className="px-4 py-2 text-sm rounded-lg bg-white/10 text-white hover:bg-[#C9A96E] hover:text-black transition-all"
                  >
                    Reply ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { connectDB } from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/jwt-auth";
import { Message } from "@/backend/db/models/Message";
import Link from "next/link";

export default async function AdminMessagesPage() {
  // Verify JWT token
  await verifyAdminToken();

  await connectDB();
  const messages = await Message.find({}).sort({ createdAt: -1 }).lean<any[]>().exec();

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Messages</h1>
        <p className="text-white/40 text-sm">
          {unread > 0 ? (
            <span><span style={{ color: "#C9A96E" }}>{unread} unread</span> · {messages.length} total</span>
          ) : (
            `${messages.length} total messages`
          )}
        </p>
      </div>

      {messages.length === 0 ? (
        <div
          className="rounded-2xl p-16 text-center text-white/25 text-sm"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          No messages yet. They will appear here when someone fills in your contact form.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m._id.toString()}
              className="rounded-2xl p-6 transition-all"
              style={{
                background: m.read ? "rgba(255,255,255,0.02)" : "rgba(201,169,110,0.05)",
                border: `1px solid ${m.read ? "rgba(255,255,255,0.06)" : "rgba(201,169,110,0.15)"}`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-white font-medium text-sm">{m.name}</p>
                    {!m.read && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(201,169,110,0.2)", color: "#C9A96E" }}
                      >
                        New
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mb-3 text-xs text-white/30">
                    <a href={`mailto:${m.email}`} className="hover:text-white/60 transition-colors">
                      {m.email}
                    </a>
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="hover:text-white/60 transition-colors">
                        {m.phone}
                      </a>
                    )}
                    <span>
                      {new Date(m.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{m.message}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`mailto:${m.email}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
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

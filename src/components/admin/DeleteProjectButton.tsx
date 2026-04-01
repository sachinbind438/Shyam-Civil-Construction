"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading,  setLoading]  = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
    setShowModal(false);
  };

  return (
    <>
      {/* Trigger button — unchanged */}
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-1.5 rounded-lg text-xs! text-red-500/70 bg-red-500/20 font-medium transition-colors cursor-pointer hover:scale-105 hover:shadow-red-500/20 shadow-lg hover:bg-red-500/80 hover:text-black/90"
      >
        Delete
      </button>

      {/* Confirmation modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => { if (!loading) setShowModal(false) }}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-5 sm:gap-6"
            style={{
              background: "linear-gradient(135deg, #0f1e2e 0%, #0a1520 100%)",
              border:     "1px solid rgba(201,169,110,0.2)",
              boxShadow:  "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Icon */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.2)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
              <h3
                className="text-lg sm:text-xl font-semibold"
                style={{ color: "rgba(255,255,255,0.92)", fontFamily: "var(--font-cormorant, serif)" }}
              >
                Delete Project
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                This action cannot be undone.
                The project will be permanently removed.
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all hover:opacity-80 disabled:opacity-40"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color:      "rgba(255,255,255,0.6)",
                  border:     "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #c0392b 0%, #96281b 100%)",
                  color:      "white",
                  border:     "1px solid rgba(220,38,38,0.3)",
                  boxShadow:  "0 4px 15px rgba(192,57,43,0.3)",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
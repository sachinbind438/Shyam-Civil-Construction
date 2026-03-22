"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setLoading(true);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 rounded-lg text-xs! font-medium transition-colors disabled:opacity-40"
      style={{ background: "rgba(139,58,58,0.15)", color: "#e57373" }}
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
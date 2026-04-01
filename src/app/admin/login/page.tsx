"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      bg-[#0a1520]
      
      flex items-center justify-center
      px-4
    "
    >
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        {/* Logo / heading */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-white mt-4">
            Admin Panel
          </h1>
          <p className="text-white/40 text-xs sm:text-sm mt-1">
            Sign in to manage your projects
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-5 sm:p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs sm:text-sm mb-5 sm:mb-6">
              {error === "AccessDenied"
                ? "Access denied. Your email is not authorized."
                : "Sign in failed. Please try again."}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="•••••••••"
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: "#C9A96E", color: "#0a1520" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-white/30 text-xs text-center mt-5 sm:mt-6">
            Only authorized email and password can access the admin panel.
          </p>
        </div>
      </div>
    </div>
  );
}

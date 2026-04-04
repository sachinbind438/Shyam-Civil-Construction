"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginClient() {
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
      console.log('[Client] Attempting login with:', { email, hasPassword: !!password });
      
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log('[Client] Response status:', response.status);
      console.log('[Client] Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('[Client] Response data:', data);

      if (response.ok) {
        console.log('[Client] Login successful, redirecting...');
        
        // Try Next.js router first
        try {
          router.push("/admin/dashboard");
          router.refresh();
          
          // Fallback if router doesn't work within 1 second
          setTimeout(() => {
            if (window.location.pathname === '/admin/login') {
              console.log('[Client] Router redirect failed, using window.location');
              window.location.href = "/admin/dashboard";
            }
          }, 1000);
        } catch (error) {
          console.error('[Client] Router error, using window.location:', error);
          window.location.href = "/admin/dashboard";
        }
      } else {
        console.log('[Client] Login failed:', data.error);
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error('[Client] Network error:', err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a1520] flex items-center justify-center px-4">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-white mt-4">
            Admin Panel
          </h1>
          <p className="text-white/40 text-xs sm:text-sm mt-1">
            Sign in to manage your projects
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#C9A96E] hover:bg-[#C9A96E]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9A96E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      // ── Cloudflare R2 CDN ───────────────────────────────────────────────────
      {
        protocol: "https",
        hostname: "pub-166fdf4fe2e540989f5e719d254cab65.r2.dev",
        pathname: "/**",
      },
      // ── Cloudflare R2 endpoint (for direct access) ─────────────────────────
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      // ── Backblaze B2 (for existing images) ───────────────────────────────
      {
        protocol: "https",
        hostname: "f005.backblazeb2.com",
        pathname: "/file/**",
      },
      // ── Cloudinary (keep for existing images already in MongoDB) ────────────
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // ── Framer images ─────────────────────────────────────────────────────
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
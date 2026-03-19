import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      // ── Backblaze B2 direct URL ───────────────────────────────────────────
      {
        protocol: "https",
        hostname: "f005.backblazeb2.com",
        pathname: "/file/**",
      },
      // ── Cloudflare CDN (add after connecting your domain) ─────────────────
      // Replace cdn.shyamcivil.com with your actual subdomain
      {
        protocol: "https",
        hostname: "cdn.shyamcivil.com",
        pathname: "/**",
      },
      // ── Keep Cloudinary for existing images already in MongoDB ────────────
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
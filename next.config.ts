import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https://pub-166fdf4fe2e540989f5e719d254cab65.r2.dev https://res.cloudinary.com`,
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      // ── Cloudflare R2 CDN ───────────────────────────────────────────
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
      // ── Unsplash (for external images) ─────────────────────────────────────
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // ── Shyam Civil Construction domain ─────────────────────────────────────
      {
        protocol: "https",
        hostname: "shyamcivilconstruction.in",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },

  async redirects() {
    return [
      // Example: Add any slug renames here in the future
      // {
      //   source: '/projects/old-slug',
      //   destination: '/projects/new-slug',
      //   permanent: true,
      // },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Extra strict headers for admin routes
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
    ]
  },
};

export default nextConfig;
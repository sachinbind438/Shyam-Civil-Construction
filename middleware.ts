import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Only handle /admin routes ─────────────────────────────────────────────
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // ── Allow all /api/admin routes (they handle their own auth internally) ───
  if (pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  // ── Allow the login page itself ───────────────────────────────────────────
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // ── For all other /admin pages, check for token ───────────────────────────
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    // No token — redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // ── Token exists — allow through (API routes verify it fully) ────────────
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

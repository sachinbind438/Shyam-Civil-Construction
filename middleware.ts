import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
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

  // ── For all other /admin pages, verify JWT token ───────────────────────────
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    // No token — redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Verify JWT token using jose (Edge Runtime compatible)
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) throw new Error('NEXTAUTH_SECRET not set');

    await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    return NextResponse.next();
  } catch {
    // Invalid or expired token — redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};

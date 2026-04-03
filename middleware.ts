import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

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

  // ── For all other /admin pages, verify JWT token ───────────────────────────
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    // No token — redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Verify JWT token
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }
    
    jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    return NextResponse.next();
  } catch (error) {
    // Invalid or expired token — redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { Admin } from '@/backend/db/models/Admin'
import {
  checkRateLimit,
  recordFailedAttempt,
  recordSuccessfulLogin,
  getClientIdentifier
} from '@/lib/rateLimit'

// Detect if request is HTTPS (works behind proxies too)
function isSecureRequest(request: NextRequest): boolean {
  // Check forwarded proto header (used by reverse proxies like Vercel, Netlify, Nginx)
  const forwardedProto = request.headers.get('x-forwarded-proto')
  if (forwardedProto === 'https') return true
  
  // Check if URL protocol is https
  return request.url.startsWith('https://')
}

const JWT_SECRET = process.env.NEXTAUTH_SECRET
const JWT_ALGORITHM = 'HS256'
const TOKEN_EXPIRY = '2h'

// Generic error — never reveal if email exists or not
const GENERIC_ERROR = 'Invalid email or password'

export async function POST(request: NextRequest) {
  // ── 1. Check JWT secret is properly configured ──────────────────────
  if (!JWT_SECRET) {
    console.error('NEXTAUTH_SECRET environment variable is not set')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  // ── 2. Rate limiting ────────────────────────────────────────────────
  const identifier = getClientIdentifier(request)
  const rateLimit = checkRateLimit(identifier)

  if (!rateLimit.allowed) {
    const lockoutMinutes = rateLimit.lockedUntil
      ? Math.ceil((rateLimit.lockedUntil - Date.now()) / 60000)
      : 15

    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${lockoutMinutes} minutes.` },
      {
        status: 429,
        headers: {
          'Retry-After': String(lockoutMinutes * 60),
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimit.resetTime),
        }
      }
    )
  }

  try {
    // ── 3. Parse and validate input ─────────────────────────────────
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      recordFailedAttempt(identifier)
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 })
    }

    // ── 4. Validate email format ────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email) || email.length > 255) {
      recordFailedAttempt(identifier)
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
    }

    // ── 5. Validate password length ──────────────────────────────────
    if (typeof password !== 'string' || password.length < 1 || password.length > 128) {
      recordFailedAttempt(identifier)
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
    }

    await connectDB()

    // ── 6. Find admin — use constant-time comparison ─────────────────
    // Always run bcrypt even if user not found to prevent timing attacks
    const admin = await (Admin as any)
      .findOne({ email: email.toLowerCase().trim() })
      .select('+password')
      .lean()

    // Use a dummy hash if admin not found — prevents timing attacks
    const dummyHash = '$2b$12$dummy.hash.to.prevent.timing.attack.do.not.use'
    const passwordToCompare = admin?.password || dummyHash

    const isValid = await bcrypt.compare(password.trim(), passwordToCompare)

    if (!admin || !isValid) {
      recordFailedAttempt(identifier)
      // Add small random delay to prevent timing analysis
      await new Promise(r => setTimeout(r, Math.random() * 100 + 50))
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
    }

    // ── 7. Successful login ──────────────────────────────────────────
    recordSuccessfulLogin(identifier)

    // ── 8. Create minimal JWT payload ────────────────────────────────
    // Store only what is absolutely necessary
    const token = jwt.sign(
      {
        sub: admin._id.toString(), // use 'sub' standard claim
        email: admin.email,
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      {
        expiresIn: TOKEN_EXPIRY,
        algorithm: JWT_ALGORITHM,
      }
    )

    // ── 9. Set secure cookie ─────────────────────────────────────────
    const isSecure = isSecureRequest(request)
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    )

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: isSecure,        // HTTPS only when actually on HTTPS
      sameSite: 'lax',
      maxAge: 2 * 60 * 60,     // 2 hours
      path: '/',
    })

    // Debug: Log cookie settings
    console.log('[Cookie Debug]', {
      isSecure,
      cookieSettings: {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax',
        maxAge: 7200000,
        path: '/',
        // Note: No explicit domain - browser will set to current domain
      }
    })

    return response

  } catch (error) {
    // Never expose internal errors
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Block all other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

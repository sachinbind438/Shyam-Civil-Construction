import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import { Admin } from '@/backend/db/models/Admin'
import {
  checkRateLimit,
  recordFailedAttempt,
  recordSuccessfulLogin,
  getClientIdentifier
} from '@/lib/rateLimit'
import { loginSchema } from '@/lib/validation'

// Detect if request is HTTPS (works behind proxies too)
function isSecureRequest(request: NextRequest): boolean {
  // Check forwarded proto header (used by reverse proxies like Vercel, Netlify, Nginx)
  const forwardedProto = request.headers.get('x-forwarded-proto')
  if (forwardedProto === 'https') return true
  
  // Check if URL protocol is https
  return request.url.startsWith('https://')
}

const JWT_SECRET = process.env.NEXTAUTH_SECRET

// Generic error — never reveal if email exists or not
const GENERIC_ERROR = 'Invalid email or password'

export async function POST(request: NextRequest) {
  // ── 1. Check JWT secret is properly configured ──────────────────────
  if (!JWT_SECRET) {
    console.error('NEXTAUTH_SECRET environment variable is not set')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  try {
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

    // ── 3. Parse and validate input ─────────────────────────────────
    const body = await request.json()
    
    // Use Zod for robust validation
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      console.log('[Login Validation Error]', parsed.error)
      recordFailedAttempt(identifier)
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 })
    }
    const { email, password } = parsed.data

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
    const secret = new TextEncoder().encode(JWT_SECRET)
    const token = await new SignJWT({
        sub: admin._id.toString(), // use 'sub' standard claim
        email: admin.email,
        iat: Math.floor(Date.now() / 1000),
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret)

    // ── 9. Set secure cookie ─────────────────────────────────────────
    const isSecure = isSecureRequest(request)
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    )

    // Get the current domain from request URL
    const url = new URL(request.url)
    // Don't set explicit domain - let browser match current domain exactly
    
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'strict',
      maxAge: 2 * 60 * 60,
      path: '/',
      // No explicit domain - browser will set to exact current domain
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

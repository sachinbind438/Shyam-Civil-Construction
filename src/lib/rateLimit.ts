import { NextRequest } from 'next/server'

// In-memory store (use Redis/Upstash for production multi-instance)
const loginAttempts = new Map<string, { count: number; resetTime: number; lockedUntil?: number }>()

const MAX_ATTEMPTS = 5          // max failed attempts
const WINDOW_MS = 15 * 60 * 1000  // 15 minute window
const LOCKOUT_MS = 30 * 60 * 1000 // 30 minute lockout

export function checkRateLimit(identifier: string): {
  allowed: boolean
  remaining: number
  resetTime: number
  lockedUntil?: number
} {
  const now = Date.now()
  const record = loginAttempts.get(identifier)

  // Check if locked out
  if (record?.lockedUntil && now < record.lockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      lockedUntil: record.lockedUntil
    }
  }

  // Reset window if expired
  if (!record || now > record.resetTime) {
    loginAttempts.set(identifier, {
      count: 0,
      resetTime: now + WINDOW_MS
    })
    return { allowed: true, remaining: MAX_ATTEMPTS, resetTime: now + WINDOW_MS }
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.count)
  return {
    allowed: record.count < MAX_ATTEMPTS,
    remaining,
    resetTime: record.resetTime
  }
}

export function recordFailedAttempt(identifier: string): void {
  const now = Date.now()
  const record = loginAttempts.get(identifier) || {
    count: 0,
    resetTime: now + WINDOW_MS
  }

  record.count++

  // Lock account after max attempts
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS
    console.warn(`🔒 Account locked for ${identifier} until ${new Date(record.lockedUntil).toISOString()}`)
  }

  loginAttempts.set(identifier, record)
}

export function recordSuccessfulLogin(identifier: string): void {
  // Clear failed attempts on successful login
  loginAttempts.delete(identifier)
}

export function getClientIdentifier(request: NextRequest): string {
  // Use IP + email combination as identifier
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  return ip
}

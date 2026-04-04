import { NextRequest, NextResponse } from 'next/server'

// Detect if request is HTTPS (works behind proxies too)
function isSecureRequest(request: NextRequest): boolean {
  const forwardedProto = request.headers.get('x-forwarded-proto')
  if (forwardedProto === 'https') return true
  return request.url.startsWith('https://')
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  
  const isSecure = isSecureRequest(request)

  // Clear cookie properly - no explicit domain to match login
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 0,
    expires: new Date(0),
    path: '/',
    // No explicit domain - matches login cookie
  })

  return response
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

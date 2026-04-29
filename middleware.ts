import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  // For now, just check token exists
  // Later: Add actual token validation against your backend
  if (!token) {
    // Allow first load to get token via postMessage
    // Middleware runs on navigation, not initial iframe load
    return NextResponse.next()
  }

  // Token exists, allow request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/auth/login' || 
                       path === '/' || 
                       path === '/about' ||
                       path === '/student-dashboard' // Allow direct access to dashboard for testing
  
  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || ''
  
  // Redirect to login if accessing a protected route without authentication
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  // Redirect to dashboard if accessing login page with valid authentication
  if (path === '/auth/login' && token) {
    return NextResponse.redirect(new URL('/student-dashboard', request.url))
  }
  
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}

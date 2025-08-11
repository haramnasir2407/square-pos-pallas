import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '~/auth'

export async function middleware(request: NextRequest) {
  const session = await auth() // retrieve the session from the request
  const { pathname } = request.nextUrl

  const isSignedIn = !!session?.accessToken

  // Redirect root to dashboard if signed in, otherwise to signin
  if (pathname === '/') {
    return NextResponse.redirect(new URL(isSignedIn ? '/dashboard' : '/signin', request.url))
  }

  // Prevent signed-in users from accessing the signin page
  if (pathname === '/signin' && isSignedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect dashboard route
  if (pathname === '/dashboard' && !isSignedIn) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

// Match only relevant routes
export const config = {
  matcher: ['/', '/signin', '/dashboard'],
}

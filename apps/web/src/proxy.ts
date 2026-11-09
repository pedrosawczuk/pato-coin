import { getSessionCookie } from 'better-auth/cookies'
import { type NextRequest, NextResponse } from 'next/server'

const AUTH_ROUTES = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = getSessionCookie(request)

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (!isAuthRoute && !sessionCookie) {
    const signInUrl = request.nextUrl.clone()
    signInUrl.pathname = '/sign-in'
    return NextResponse.redirect(signInUrl)
  }

  if (isAuthRoute && sessionCookie) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

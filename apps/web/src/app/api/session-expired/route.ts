import { type NextRequest, NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/sign-in', request.url))
  response.cookies.delete('better-auth.session_token')
  response.cookies.delete('__Secure-better-auth.session_token')
  return response
}

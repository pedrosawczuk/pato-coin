import { cookies } from 'next/headers'

export interface AuthSessionData {
  session: { id: string; userId: string; expiresAt: string }
  user: { id: string; name: string; email: string }
}

export async function getAuthSession(): Promise<AuthSessionData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
  const cookieStore = await cookies()

  try {
    const response = await fetch(`${apiUrl}/auth/session`, {
      headers: { cookie: cookieStore.toString() },
      cache: 'no-store',
    })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

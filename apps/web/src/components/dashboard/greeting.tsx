import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth-server'

export async function Greeting() {
  const data = await getAuthSession()

  if (!data?.user) {
    redirect('/api/session-expired')
  }

  return (
    <h1 className="text-3xl font-bold tracking-tight">
      Olá, <span className="text-primary">{data.user.name}</span>
    </h1>
  )
}

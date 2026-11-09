import { Skeleton } from '@app/ui'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Greeting } from '@/components/dashboard/greeting'

export const metadata: Metadata = { title: 'Dashboard — Pato Coin' }

export default function DashboardPage() {
  return (
    <main className="p-6 sm:p-10">
      <Suspense fallback={<Skeleton className="h-9 w-64" />}>
        <Greeting />
      </Suspense>
    </main>
  )
}

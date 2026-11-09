import { Toaster } from '@app/ui'
import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import './globals.css'

const sora = Sora({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Pato Coin',
  description: 'Controle financeiro simples e direto.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${sora.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/30`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}

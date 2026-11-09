import { Wallet } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-background lg:grid-cols-2">
      <div className="flex flex-col p-6 sm:p-10">
        <Link
          href="/"
          className="flex w-fit items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="size-4.5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            pato<span className="text-primary">coin</span>
          </span>
        </Link>

        <main className="mx-auto my-auto w-full max-w-sm py-10">
          {children}
        </main>

        <p className="text-xs text-muted-foreground">© Pato Coin</p>
      </div>

      <div className="relative hidden overflow-hidden bg-[#0c0d0e] lg:flex lg:flex-col lg:justify-end lg:p-12">
        <div className="pointer-events-none absolute -top-32 -right-32 size-[28rem] rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative max-w-md space-y-4">
          <p className="text-4xl font-bold leading-tight tracking-tight text-white">
            Seu dinheiro, <span className="text-primary">sob controle.</span>
          </p>
          <p className="text-sm leading-relaxed text-zinc-400">
            Acompanhe gastos, organize metas e veja para onde vai cada centavo —
            sem planilhas.
          </p>
        </div>
      </div>
    </div>
  )
}

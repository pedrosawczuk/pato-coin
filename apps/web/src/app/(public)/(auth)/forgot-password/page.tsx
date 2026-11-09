import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export const metadata: Metadata = { title: 'Recuperar senha — Pato Coin' }

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}

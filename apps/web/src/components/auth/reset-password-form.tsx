'use client'

import { Button, Form, FormField, Input, toast } from '@app/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, KeyRound, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { apiClient } from '@/lib/api-client'
import { AuthHeader } from './auth-header'
import { type ResetPasswordInput, resetPasswordSchema } from './auth-schema'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isResending, setIsResending] = useState(false)
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      otp: '',
      password: '',
      confirmPassword: '',
    },
  })
  const isLoading = form.formState.isSubmitting

  async function onSubmit({ email, otp, password }: ResetPasswordInput) {
    try {
      await apiClient('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, password }),
      })
      toast.success('Senha alterada! Entre com a nova senha.')
      router.push('/sign-in')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível alterar a senha.',
      )
    }
  }

  async function resendCode() {
    const isEmailValid = await form.trigger('email')
    if (!isEmailValid) return

    setIsResending(true)
    try {
      await apiClient('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: form.getValues('email') }),
      })
      toast.success('Enviamos um novo código.')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Não foi possível reenviar.',
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="w-full space-y-8">
      <AuthHeader
        title="Criar nova senha"
        description="Digite o código de 6 dígitos que enviamos para o seu e-mail."
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Input
                label="E-mail"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                leftIcon={<Mail />}
                disabled={isLoading}
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <div className="space-y-1.5">
            <FormField
              control={form.control}
              name="otp"
              render={({ field, fieldState }) => (
                <Input
                  label="Código"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  leftIcon={<KeyRound />}
                  className="font-mono tracking-[0.4em]"
                  disabled={isLoading}
                  errorMessage={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={resendCode}
                isLoading={isResending}
                disabled={isLoading}
              >
                Reenviar código
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Input
                label="Nova senha"
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo de 8 caracteres"
                leftIcon={<Lock />}
                disabled={isLoading}
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Input
                label="Confirmar nova senha"
                type="password"
                autoComplete="new-password"
                placeholder="Repita a nova senha"
                leftIcon={<Lock />}
                disabled={isLoading}
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
            Alterar senha
          </Button>
        </form>
      </Form>

      <Link
        href="/sign-in"
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar para o login
      </Link>
    </div>
  )
}

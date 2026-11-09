'use client'

import { Button, Checkbox, Form, FormField, Input, toast } from '@app/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { apiClient } from '@/lib/api-client'
import { AuthHeader } from './auth-header'
import { type SignInInput, signInSchema } from './auth-schema'

export function SignInForm() {
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', remember: true },
  })
  const isLoading = form.formState.isSubmitting

  async function onSubmit(data: SignInInput) {
    try {
      await apiClient('/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      toast.success('Bem-vindo de volta!')
      window.location.href = '/dashboard'
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'E-mail ou senha incorretos.',
      )
    }
  }

  return (
    <div className="w-full space-y-8">
      <AuthHeader
        title="Entrar"
        description="Acesse sua conta para continuar."
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
              name="password"
              render={({ field, fieldState }) => (
                <Input
                  label="Senha"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  leftIcon={<Lock />}
                  disabled={isLoading}
                  errorMessage={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <Checkbox
                label="Lembrar deste dispositivo"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            )}
          />

          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight />}
          >
            Entrar
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem conta?{' '}
        <Link
          href="/sign-up"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </div>
  )
}

'use client'

import { Button, Form, FormField, Input, toast } from '@app/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Lock, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { apiClient } from '@/lib/api-client'
import { AuthHeader } from './auth-header'
import { type SignUpInput, signUpSchema } from './auth-schema'

export function SignUpForm() {
  const router = useRouter()
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  })
  const isLoading = form.formState.isSubmitting

  async function onSubmit(data: SignUpInput) {
    try {
      await apiClient('/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      toast.success('Conta criada! Faça login para continuar.')
      router.push('/sign-in')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível criar a conta.',
      )
    }
  }

  return (
    <div className="w-full space-y-8">
      <AuthHeader title="Criar conta" description="Leva menos de um minuto." />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Input
                label="Nome"
                autoComplete="name"
                placeholder="Seu nome"
                leftIcon={<User />}
                disabled={isLoading}
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />

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

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Input
                label="Senha"
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

          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight />}
          >
            Criar conta
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link
          href="/sign-in"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}

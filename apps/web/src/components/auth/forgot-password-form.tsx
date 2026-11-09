'use client'

import { Button, Form, FormField, Input, toast } from '@app/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { apiClient } from '@/lib/api-client'
import { AuthHeader } from './auth-header'
import { type ForgotPasswordInput, forgotPasswordSchema } from './auth-schema'

export function ForgotPasswordForm() {
  const router = useRouter()
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })
  const isLoading = form.formState.isSubmitting

  async function onSubmit(data: ForgotPasswordInput) {
    try {
      await apiClient('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      toast.success('Se o e-mail estiver cadastrado, você receberá um código.')
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar o código.',
      )
    }
  }

  return (
    <div className="w-full space-y-8">
      <AuthHeader
        title="Esqueceu a senha?"
        description="Informe seu e-mail e enviaremos um código para criar uma nova senha."
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

          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight />}
          >
            Enviar código
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

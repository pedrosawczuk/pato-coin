import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
  remember: z.boolean(),
})

export const signUpSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  email: z.email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export const forgotPasswordSchema = z.object({
  email: z.email('E-mail inválido'),
})

export const resetPasswordSchema = z
  .object({
    email: z.email('E-mail inválido'),
    otp: z
      .string()
      .length(6, 'O código deve ter 6 dígitos')
      .regex(/^\d+$/, 'O código deve conter apenas números'),
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export type SignUpInput = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
  remember: z.boolean().optional().default(true),
})

export type SignInInput = z.infer<typeof signInSchema>

export const verifyOtpSchema = z.object({
  code: z
    .string()
    .length(6, 'O código deve ter exatamente 6 dígitos numéricos')
    .regex(/^\d+$/, 'O código deve conter apenas números'),
  trustDevice: z.boolean().optional(),
})

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
  otp: z
    .string()
    .length(6, 'O código deve ter exatamente 6 dígitos numéricos')
    .regex(/^\d+$/, 'O código deve conter apenas números'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

import { config } from 'dotenv'
import { z } from 'zod'

config({ path: ['.env', '../../.env'] })

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'prod']).default('dev'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32)
    .default('supersecretbetterauthkey123_patocoin_secure_token_32chars'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3333'),
  RESEND_API_KEY: z.string().optional(),
  MAIL_FROM: z.string().default('onboarding@resend.dev'),
})

export const env = envSchema.parse(process.env)
export type Env = z.infer<typeof envSchema>

import type { FastifyInstance } from 'fastify'
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyOtpSchema,
} from './auth-schemas'
import { forgotPasswordModule } from './forgot-password'
import { getSessionModule } from './get-session'
import { resetPasswordModule } from './reset-password'
import { sendOtpModule } from './send-otp'
import { signInModule } from './sign-in'
import { signOutModule } from './sign-out'
import { signUpModule } from './sign-up'
import { verifyOtpModule } from './verify-otp'

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/sign-up',
    {
      schema: {
        body: signUpSchema,
      },
    },
    signUpModule,
  )

  app.post(
    '/sign-in',
    {
      schema: {
        body: signInSchema,
      },
    },
    signInModule,
  )

  app.post('/send-otp', sendOtpModule)

  app.post(
    '/verify-otp',
    {
      schema: {
        body: verifyOtpSchema,
      },
    },
    verifyOtpModule,
  )

  app.post(
    '/forgot-password',
    {
      schema: {
        body: forgotPasswordSchema,
      },
    },
    forgotPasswordModule,
  )

  app.post(
    '/reset-password',
    {
      schema: {
        body: resetPasswordSchema,
      },
    },
    resetPasswordModule,
  )

  app.post('/sign-out', signOutModule)

  app.get('/session', getSessionModule)
}

import * as schema from '@app/db'
import { db, eq } from '@app/db'
import { env } from '@app/env'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { emailOTP, twoFactor } from 'better-auth/plugins'
import {
  sendLoginNotificationEmail,
  sendPasswordResetOtpEmail,
  sendTwoFactorOtpEmail,
} from './mail'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      twoFactor: schema.twoFactor,
    },
  }),
  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,
  },
  plugins: [
    twoFactor({
      issuer: 'pato-coin',
      otpOptions: {
        digits: 6,
        period: 5,
        sendOTP: async ({ user, otp }) => {
          await sendTwoFactorOtpEmail({
            to: user.email,
            name: user.name,
            otp,
          })
        },
      },
    }),
    emailOTP({
      expiresIn: 300,
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type === 'forget-password') {
          await sendPasswordResetOtpEmail({ to: email, otp })
          return
        }

        await sendTwoFactorOtpEmail({
          to: email,
          otp,
        })
      },
    }),
  ],
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          const [loggedInUser] = await db
            .select()
            .from(schema.user)
            .where(eq(schema.user.id, session.userId))

          if (!loggedInUser) return

          try {
            await sendLoginNotificationEmail({
              to: loggedInUser.email,
              name: loggedInUser.name,
              ipAddress: session.ipAddress,
              userAgent: session.userAgent,
              date: session.createdAt,
            })
          } catch (error) {
            console.error(
              'Erro ao enviar e-mail de notificação de login:',
              error,
            )
          }
        },
      },
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
})

export type Auth = typeof auth

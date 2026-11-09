import { env } from '@app/env'
import { Resend } from 'resend'

export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

const ui = {
  background: '#f8fafc',
  foreground: '#0c0d0e',
  card: '#ffffff',
  primary: '#facc15',
  primaryForeground: '#1c1917',
  muted: '#eaebec',
  mutedSubtle: '#f5f5f6',
  mutedForeground: '#5c636a',
  border: '#d4d6d8',
  warningBorder: '#fce2b6',
  warningBg: '#fefaf3',
  destructiveBorder: '#fac7c7',
  destructiveBg: '#fef6f6',
  font: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  radius: '8px',
  radiusLg: '16px',
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ] as string,
  )

type AlertVariant = 'warning' | 'destructive' | 'muted'

const alertStyles: Record<AlertVariant, { border: string; bg: string }> = {
  warning: { border: ui.warningBorder, bg: ui.warningBg },
  destructive: { border: ui.destructiveBorder, bg: ui.destructiveBg },
  muted: { border: ui.border, bg: ui.mutedSubtle },
}

const alert = (variant: AlertVariant, html: string) => {
  const { border, bg } = alertStyles[variant]
  return `<p style="margin: 20px 0 0; padding: 16px; border: 1px solid ${border}; background-color: ${bg}; border-radius: ${ui.radiusLg}; font-size: 13px; line-height: 1.5; color: ${ui.mutedForeground};">${html}</p>`
}

const mutedBox = (html: string, style = '') =>
  `<div style="background-color: ${ui.muted}; border-radius: ${ui.radius}; padding: 12px 16px; ${style}">${html}</div>`

const layout = ({
  title,
  description,
  content,
}: {
  title: string
  description: string
  content: string
}) => `
<body style="margin: 0; padding: 0; background-color: ${ui.background};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${ui.background}; font-family: ${ui.font}; padding: 32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px;">
        <tr><td style="padding: 0 0 20px; font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: ${ui.foreground};">
          <span style="display: inline-block; width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: ${ui.radius}; background-color: ${ui.primary}; color: ${ui.primaryForeground}; margin-right: 8px;">P</span>Pato Coin
        </td></tr>
        <tr><td style="background-color: ${ui.card}; border: 1px solid ${ui.border}; border-radius: ${ui.radiusLg}; box-shadow: 0 1px 2px rgba(0,0,0,0.05); padding: 24px;">
          <h1 style="margin: 0 0 6px; font-size: 18px; font-weight: 600; line-height: 1.25; letter-spacing: -0.01em; color: ${ui.foreground};">${title}</h1>
          <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: ${ui.mutedForeground};">${description}</p>
          ${content}
        </td></tr>
        <tr><td style="padding: 20px 0 0; font-size: 12px; color: ${ui.mutedForeground}; text-align: center;">
          Este é um e-mail automático, não responda.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>`

async function sendMail({
  to,
  subject,
  html,
  fallbackLog,
}: {
  to: string
  subject: string
  html: string
  fallbackLog: string
}) {
  if (!resend) {
    console.warn(`[Mail] RESEND_API_KEY não configurada. ${fallbackLog}`)
    return
  }

  await resend.emails.send({ from: env.MAIL_FROM, to, subject, html })
}

export interface SendLoginEmailParams {
  to: string
  name: string
  ipAddress?: string | null
  userAgent?: string | null
  date?: Date
}

export async function sendLoginNotificationEmail({
  to,
  name,
  ipAddress,
  userAgent,
  date = new Date(),
}: SendLoginEmailParams) {
  const formattedDate = date.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  })

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding: 6px 0; font-size: 13px; color: ${ui.mutedForeground};">${label}</td>
      <td style="padding: 6px 0; font-size: 13px; color: ${ui.foreground}; font-weight: 500; text-align: right;">${escapeHtml(value)}</td>
    </tr>`

  await sendMail({
    to,
    subject: 'Novo login detectado na sua conta',
    fallbackLog: `E-mail de login para ${to} ignorado.`,
    html: layout({
      title: `Olá, ${escapeHtml(name)}!`,
      description: 'Um novo login foi realizado na sua conta.',
      content: `
        ${mutedBox(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row('Data e horário', formattedDate)}
          ${row('Endereço IP', ipAddress || 'Não identificado')}
          ${row('Dispositivo', userAgent || 'Não identificado')}
        </table>`)}
        ${alert('warning', `<strong style="color: ${ui.foreground};">Não foi você?</strong> Altere sua senha imediatamente.`)}`,
    }),
  })
}

export interface SendTwoFactorOtpParams {
  to: string
  name?: string
  otp: string
}

export async function sendTwoFactorOtpEmail({
  to,
  name,
  otp,
}: SendTwoFactorOtpParams) {
  await sendMail({
    to,
    subject: `Seu código de acesso: ${otp}`,
    fallbackLog: `Código de verificação [${otp}] para ${to}.`,
    html: layout({
      title: 'Código de Confirmação',
      description: `Olá${name ? `, ${escapeHtml(name)}` : ''}! Você solicitou acesso à sua conta. Use o código abaixo para concluir o login:`,
      content: `
        ${mutedBox(
          `<span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: ${ui.foreground}; font-family: monospace;">${escapeHtml(otp)}</span>`,
          'padding: 20px; text-align: center;',
        )}
        ${alert('muted', `Este código é válido por <strong style="color: ${ui.foreground};">5 minutos</strong>. Se você não solicitou este acesso, ignore este e-mail.`)}`,
    }),
  })
}

export interface SendPasswordResetOtpParams {
  to: string
  otp: string
}

export async function sendPasswordResetOtpEmail({
  to,
  otp,
}: SendPasswordResetOtpParams) {
  await sendMail({
    to,
    subject: `Redefinição de senha: ${otp}`,
    fallbackLog: `Código de redefinição de senha [${otp}] para ${to}.`,
    html: layout({
      title: 'Redefinir senha',
      description:
        'Recebemos uma solicitação para redefinir a senha da sua conta. Use o código abaixo para criar uma nova senha:',
      content: `
        ${mutedBox(
          `<span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: ${ui.foreground}; font-family: monospace;">${escapeHtml(otp)}</span>`,
          'padding: 20px; text-align: center;',
        )}
        ${alert('muted', `Este código é válido por <strong style="color: ${ui.foreground};">5 minutos</strong>. Se você não solicitou a redefinição, ignore este e-mail — sua senha continua a mesma.`)}`,
    }),
  })
}

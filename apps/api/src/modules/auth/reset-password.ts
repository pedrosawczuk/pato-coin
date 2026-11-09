import type { FastifyReply, FastifyRequest } from 'fastify'
import { auth } from '@/lib/auth'
import { forwardWebResponse, toFetchHeaders } from '@/lib/http-utils'
import type { ResetPasswordInput } from './auth-schemas'

export async function resetPasswordModule(
  request: FastifyRequest<{ Body: ResetPasswordInput }>,
  reply: FastifyReply,
) {
  const { email, otp, password } = request.body

  const response = await auth.api.resetPasswordEmailOTP({
    body: { email, otp, password },
    asResponse: true,
    headers: toFetchHeaders(request.headers),
  })

  forwardWebResponse(response, reply)

  const data = await response.json()
  return reply.status(response.status).send(data)
}

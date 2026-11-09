import type { FastifyReply, FastifyRequest } from 'fastify'
import { auth } from '@/lib/auth'
import { forwardWebResponse, toFetchHeaders } from '@/lib/http-utils'
import type { ForgotPasswordInput } from './auth-schemas'

export async function forgotPasswordModule(
  request: FastifyRequest<{ Body: ForgotPasswordInput }>,
  reply: FastifyReply,
) {
  const response = await auth.api.requestPasswordResetEmailOTP({
    body: { email: request.body.email },
    asResponse: true,
    headers: toFetchHeaders(request.headers),
  })

  forwardWebResponse(response, reply)

  const data = await response.json()
  return reply.status(response.status).send(data)
}

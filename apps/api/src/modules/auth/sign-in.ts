import type { FastifyReply, FastifyRequest } from 'fastify'
import { auth } from '@/lib/auth'
import { forwardWebResponse, toFetchHeaders } from '@/lib/http-utils'
import type { SignInInput } from './auth-schemas'

export async function signInModule(
  request: FastifyRequest<{ Body: SignInInput }>,
  reply: FastifyReply,
) {
  const { email, password, remember } = request.body

  const response = await auth.api.signInEmail({
    body: {
      email,
      password,
      rememberMe: remember,
    },
    asResponse: true,
    headers: toFetchHeaders(request.headers),
  })

  forwardWebResponse(response, reply)

  const data = await response.json()
  return reply.status(response.status).send(data)
}

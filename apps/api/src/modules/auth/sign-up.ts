import type { FastifyReply, FastifyRequest } from 'fastify'
import { auth } from '@/lib/auth'
import { forwardWebResponse, toFetchHeaders } from '@/lib/http-utils'
import type { SignUpInput } from './auth-schemas'

export async function signUpModule(
  request: FastifyRequest<{ Body: SignUpInput }>,
  reply: FastifyReply,
) {
  const { name, email, password } = request.body

  const response = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
    asResponse: true,
    headers: toFetchHeaders(request.headers),
  })

  forwardWebResponse(response, reply)

  const data = await response.json()
  return reply.status(response.status).send(data)
}

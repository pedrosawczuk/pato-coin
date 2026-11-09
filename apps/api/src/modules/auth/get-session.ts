import type { FastifyReply, FastifyRequest } from 'fastify'
import { auth } from '@/lib/auth'
import { forwardWebResponse, toFetchHeaders } from '@/lib/http-utils'

export async function getSessionModule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const response = await auth.api.getSession({
    asResponse: true,
    headers: toFetchHeaders(request.headers),
  })

  forwardWebResponse(response, reply)

  const data = await response.json()
  return reply.status(response.status).send(data)
}

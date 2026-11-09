import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { AppError } from './app-error'

export const errorHandler = (
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      errorCode: error.errorCode,
      message: error.message,
    })
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      errorCode: 'VALIDATION_ERROR',
      message: 'Erro de validação dos dados enviados',
      issues: error.flatten().fieldErrors,
    })
  }

  if ('validation' in error && error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      errorCode: 'VALIDATION_ERROR',
      message: 'Erro de validação dos dados enviados',
      issues: error.validation,
    })
  }

  request.log.error(error)

  return reply.status(500).send({
    statusCode: 500,
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: 'Erro interno do servidor',
  })
}

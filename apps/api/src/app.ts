import { env } from '@app/env'
import cors from '@fastify/cors'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { errorHandler } from '@/core/errors'

export const app = fastify({
  logger: {
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.headers["set-cookie"]',
        'req.headers["x-api-key"]',
        'password',
        '*.password',
        'token',
        '*.token',
        'accessToken',
        '*.accessToken',
        'refreshToken',
        '*.refreshToken',
        'secret',
        '*.secret',
      ],
      censor: '[REDACTED]',
    },
    ...(env.NODE_ENV === 'dev' && {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          colorize: true,
        },
      },
    }),
  },
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app.register(cors, {
  origin: true,
})

app.get('/health', () => {
  return { status: 'ok' }
})

import { env } from '@app/env'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

export const client = postgres(env.DATABASE_URL, {
  max: env.NODE_ENV === 'prod' ? 50 : 10,
})

export const db = drizzle(client, { schema })

export * from 'drizzle-orm'
export * from './schema'

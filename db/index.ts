// Drizzle client for Netlify Database (managed PostgreSQL).
// On Netlify the connection is configured automatically (NETLIFY_DB_URL).
// When the API runs on another host, set DATABASE_URL to the Postgres connection string.
import { drizzle } from 'drizzle-orm/netlify-db'
import { getDatabase } from '@netlify/database'
import * as schema from './schema.ts'

const connectionString = process.env.DATABASE_URL || undefined

export const db = connectionString
  ? drizzle({ schema, client: getDatabase({ connectionString }) })
  : drizzle({ schema })

export { schema }

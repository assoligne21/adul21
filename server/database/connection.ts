import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import type { H3Event } from 'h3'
import * as schema from './schema'

// Cached connection instances
let cachedQueryClient: ReturnType<typeof postgres> | null = null
let cachedDb: ReturnType<typeof drizzle> | null = null
let lastConnectionString: string | null = null

/**
 * Get database connection with runtime config support for tests
 * In tests, this uses the runtimeConfig.databaseUrl passed by vitest
 * In production, it falls back to process.env.DATABASE_URL
 */
export function getDb(event?: H3Event) {
  let connectionString: string
  let source = 'fallback'

  // In Nuxt context (event available), prefer runtimeConfig
  if (event) {
    try {
      const config = useRuntimeConfig(event)
      connectionString = config.databaseUrl || process.env.DATABASE_URL || 'postgresql://localhost:5432/adul21'
    } catch {
      // If useRuntimeConfig fails (e.g., in migrations), fall back to env
      connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/adul21'
    }
  } else {
    // No event context (migrations, etc.), use env directly
    connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/adul21'
  }

  // Reuse cached connection if connection string hasn't changed
  if (cachedDb && cachedQueryClient && lastConnectionString === connectionString) {
    return cachedDb
  }

  // Close old connection if it exists and connection string changed
  if (cachedQueryClient && lastConnectionString !== connectionString) {
    cachedQueryClient.end({ timeout: 0 })
  }

  // Create new connection
  cachedQueryClient = postgres(connectionString)
  cachedDb = drizzle(cachedQueryClient, { schema })
  lastConnectionString = connectionString

  return cachedDb
}

// For migrations (non-event context, use env directly)
export const migrationClient = postgres(process.env.DATABASE_URL || 'postgresql://localhost:5432/adul21', { max: 1 })

// DO NOT create module-level connection - it will be created too early
// Legacy export will be undefined - forces all code to use getDb(event)
export let db: ReturnType<typeof drizzle> | undefined = undefined

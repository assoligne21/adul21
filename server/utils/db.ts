import pg from 'pg'
import type { QueryParam } from '~/types/common'

const { Pool } = pg

let pool: pg.Pool | null = null

export const getDb = () => {
  if (!pool) {
    const config = useRuntimeConfig()
    pool = new Pool({
      connectionString: config.databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

// Helper pour les requêtes simples
export const query = async (text: string, params?: QueryParam[]) => {
  const pool = getDb()
  return pool.query(text, params)
}

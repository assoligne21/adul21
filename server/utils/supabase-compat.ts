/**
 * Supabase compatibility layer for PostgreSQL
 * Provides the same API as Supabase but uses native PostgreSQL
 */

import { query } from './db'
import type { QueryParam, WhereCondition } from '~/types/common'

class PostgresQueryBuilder {
  private tableName: string
  private selectFields: string = '*'
  private whereConditions: WhereCondition[] = []
  private orderByClause: { column: string; ascending: boolean }[] = []
  private limitValue: number | null = null
  private singleRow: boolean = false

  constructor(table: string) {
    this.tableName = table
  }

  select(fields: string = '*') {
    this.selectFields = fields
    return this
  }

  eq(field: string, value: QueryParam) {
    this.whereConditions.push({ field, value, operator: '=' })
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderByClause.push({ column, ascending: options?.ascending ?? true })
    return this
  }

  limit(count: number) {
    this.limitValue = count
    return this
  }

  single() {
    this.singleRow = true
    this.limitValue = 1
    return this
  }

  async execute() {
    let sql = `SELECT ${this.selectFields} FROM ${this.tableName}`
    const params: QueryParam[] = []
    let paramIndex = 1

    // WHERE clause
    if (this.whereConditions.length > 0) {
      const conditions = this.whereConditions.map((cond) => {
        params.push(cond.value)
        return `${cond.field} ${cond.operator || '='} $${paramIndex++}`
      })
      sql += ` WHERE ${conditions.join(' AND ')}`
    }

    // ORDER BY clause
    if (this.orderByClause.length > 0) {
      const orderParts = this.orderByClause.map(
        (order) => `${order.column} ${order.ascending ? 'ASC' : 'DESC'}`
      )
      sql += ` ORDER BY ${orderParts.join(', ')}`
    }

    // LIMIT clause
    if (this.limitValue) {
      sql += ` LIMIT ${this.limitValue}`
    }

    try {
      const result = await query(sql, params)

      if (this.singleRow) {
        return {
          data: result.rows[0] || null,
          error: null
        }
      }

      return {
        data: result.rows,
        error: null,
        count: result.rowCount
      }
    } catch (error: unknown) {
      return {
        data: null,
        error: error.message,
        count: 0
      }
    }
  }
}

class PostgresInsertBuilder {
  private tableName: string
  private insertData: Record<string, QueryParam>

  constructor(table: string, data: Record<string, QueryParam>) {
    this.tableName = table
    this.insertData = data
  }

  select() {
    return this
  }

  single() {
    return this
  }

  async execute() {
    const keys = Object.keys(this.insertData)
    const values = Object.values(this.insertData)
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')

    const sql = `
      INSERT INTO ${this.tableName} (${keys.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `

    try {
      const result = await query(sql, values)
      return {
        data: result.rows[0] || null,
        error: null
      }
    } catch (error: unknown) {
      return {
        data: null,
        error: error.message
      }
    }
  }
}

class PostgresUpdateBuilder {
  private tableName: string
  private updateData: Record<string, QueryParam>
  private whereConditions: { field: string; value: QueryParam }[] = []

  constructor(table: string, data: Record<string, QueryParam>) {
    this.tableName = table
    this.updateData = data
  }

  eq(field: string, value: QueryParam) {
    this.whereConditions.push({ field, value })
    return this
  }

  select() {
    return this
  }

  async execute() {
    const keys = Object.keys(this.updateData)
    const values = Object.values(this.updateData)

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ')
    let paramIndex = keys.length + 1
    const params = [...values]

    let sql = `UPDATE ${this.tableName} SET ${setClause}`

    if (this.whereConditions.length > 0) {
      const conditions = this.whereConditions.map((cond) => {
        params.push(cond.value)
        return `${cond.field} = $${paramIndex++}`
      })
      sql += ` WHERE ${conditions.join(' AND ')}`
    }

    sql += ' RETURNING *'

    try {
      const result = await query(sql, params)
      return {
        data: result.rows,
        error: null
      }
    } catch (error: unknown) {
      return {
        data: null,
        error: error.message
      }
    }
  }
}

// Supabase-compatible client
class PostgresClient {
  from(table: string) {
    return {
      select: (fields?: string) => {
        const builder = new PostgresQueryBuilder(table)
        if (fields) {
          builder.select(fields)
        }
        // Return builder with execute method aliased to common Supabase patterns
        const executeObj = builder as PostgresQueryBuilder & {
          then: <T>(resolve: (value: unknown) => T) => Promise<T>
        }
        executeObj.then = <T>(resolve: (value: unknown) => T) =>
          builder.execute().then(resolve)
        return executeObj
      },
      insert: (data: Record<string, QueryParam>) => {
        const builder = new PostgresInsertBuilder(table, data)
        const executeObj = builder as PostgresInsertBuilder & {
          then: <T>(resolve: (value: unknown) => T) => Promise<T>
        }
        executeObj.then = <T>(resolve: (value: unknown) => T) =>
          builder.execute().then(resolve)
        return executeObj
      },
      update: (data: Record<string, QueryParam>) => {
        const builder = new PostgresUpdateBuilder(table, data)
        const executeObj = builder as PostgresUpdateBuilder & {
          then: <T>(resolve: (value: unknown) => T) => Promise<T>
        }
        executeObj.then = <T>(resolve: (value: unknown) => T) =>
          builder.execute().then(resolve)
        return executeObj
      }
    }
  }
}

// Export compatibility functions
export const serverSupabaseServiceRole = () => {
  return new PostgresClient()
}

export const useSupabase = () => {
  return {
    supabase: new PostgresClient()
  }
}

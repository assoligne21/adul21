/**
 * Client-side database access via API endpoints
 * This replaces the previous Supabase client implementation
 */

// Simple query builder for client-side API calls
class ClientQueryBuilder {
  private endpoint: string
  private selectFields: string = '*'
  private filters: Record<string, any> = {}
  private orderByField: string | null = null
  private orderAscending: boolean = true
  private limitValue: number | null = null
  private singleRow: boolean = false

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  select(fields: string = '*') {
    this.selectFields = fields
    return this
  }

  eq(field: string, value: any) {
    this.filters[field] = value
    return this
  }

  order(field: string, options?: { ascending?: boolean }) {
    this.orderByField = field
    this.orderAscending = options?.ascending ?? true
    return this
  }

  limit(count: number) {
    this.limitValue = count
    return this
  }

  single() {
    this.singleRow = true
    return this
  }

  async then(resolve: any, reject?: any) {
    try {
      // Build query params
      const params = new URLSearchParams()
      Object.entries(this.filters).forEach(([key, value]) => {
        params.append(key, String(value))
      })

      if (this.orderByField) {
        params.append('order', this.orderByField)
        params.append('ascending', String(this.orderAscending))
      }

      if (this.limitValue) {
        params.append('limit', String(this.limitValue))
      }

      const url = params.toString() ? `${this.endpoint}?${params}` : this.endpoint
      const response = await $fetch(url)

      if (this.singleRow && response?.data) {
        resolve({ data: response.data[0] || null, error: null })
      } else {
        resolve({ data: response?.data || null, error: null })
      }
    } catch (error: any) {
      if (reject) {
        reject({ data: null, error: error.message })
      } else {
        resolve({ data: null, error: error.message })
      }
    }
  }
}

// Client for API-based database access
class ClientDatabase {
  from(table: string) {
    return {
      select: (fields?: string) => {
        const builder = new ClientQueryBuilder(`/api/${table}`)
        if (fields) builder.select(fields)
        return builder
      }
    }
  }
}

export const useSupabase = () => {
  return {
    supabase: new ClientDatabase()
  }
}

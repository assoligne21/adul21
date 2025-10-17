/**
 * Common types used across the application
 */

/**
 * Type for error objects with optional properties
 */
export interface ErrorWithMessage {
  message: string
  statusCode?: number
  statusMessage?: string
  name?: string
  code?: string
  errors?: unknown[]
  data?: unknown
}

/**
 * Type guard to check if error has a message
 */
export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

/**
 * Helper to get error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message
  }
  return 'Une erreur inconnue est survenue'
}

/**
 * Type for database query parameters
 */
export type QueryParam = string | number | boolean | null | undefined

/**
 * Type for where conditions in database queries
 */
export interface WhereCondition {
  field: string
  value: QueryParam
  operator?: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN'
}

/**
 * Generic record type for updates (replaces any for updateData)
 */
export type UpdateRecord = Record<string, QueryParam | Date | QueryParam[]>

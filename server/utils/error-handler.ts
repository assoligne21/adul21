/**
 * Error handling utilities for API routes
 *
 * Provides centralized error handling with specific handlers for:
 * - Zod validation errors (400)
 * - Database constraint violations (409)
 * - Generic errors with custom status codes
 *
 * @module server/utils/error-handler
 */

import type { ErrorWithMessage } from '~/types/common'

/**
 * Handle API errors and convert to appropriate HTTP errors
 *
 * Automatically detects error types and creates proper HTTP responses:
 * - Zod validation errors → 400 Bad Request with validation details
 * - Database unique constraint (23505) → 409 Conflict
 * - Other errors → Uses error.statusCode or 500
 *
 * @param error - Unknown error object from catch block
 * @param defaultMessage - Default error message if none provided
 * @throws {H3Error} Nuxt HTTP error with appropriate status code
 *
 * @example
 * ```ts
 * try {
 *   const data = schema.parse(body)
 *   await db.insert(users).values(data)
 * } catch (error) {
 *   handleApiError(error, 'Erreur lors de la création')
 * }
 * ```
 */
export function handleApiError(error: unknown, defaultMessage = 'Une erreur est survenue') {
  console.error('API Error:', error)

  const err = error as ErrorWithMessage

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Données invalides',
      data: err.errors
    })
  }

  // Handle database unique constraint violations
  if (err.code === '23505') {
    throw createError({
      statusCode: 409,
      statusMessage: 'Cette ressource existe déjà'
    })
  }

  // Handle other errors with status code
  throw createError({
    statusCode: err.statusCode || 500,
    statusMessage: err.statusMessage || defaultMessage
  })
}

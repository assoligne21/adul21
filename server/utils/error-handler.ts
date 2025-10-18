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

import { createError } from 'h3'
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

/**
 * Create a validation error (400 Bad Request)
 *
 * @param message - Error message
 * @param data - Optional validation details
 * @returns H3Error with status 400
 *
 * @example
 * ```ts
 * throw createValidationError('Email invalide', { field: 'email' })
 * ```
 */
export function createValidationError(message: string, data?: any) {
  return createError({
    statusCode: 400,
    statusMessage: message,
    data
  })
}

/**
 * Create a not found error (404 Not Found)
 *
 * @param message - Error message (default: 'Ressource non trouvée')
 * @returns H3Error with status 404
 *
 * @example
 * ```ts
 * throw createNotFoundError('Membre non trouvé')
 * ```
 */
export function createNotFoundError(message = 'Ressource non trouvée') {
  return createError({
    statusCode: 404,
    statusMessage: message
  })
}

/**
 * Create an unauthorized error (401 Unauthorized)
 *
 * @param message - Error message (default: 'Non authentifié')
 * @returns H3Error with status 401
 *
 * @example
 * ```ts
 * throw createUnauthorizedError('Token invalide')
 * ```
 */
export function createUnauthorizedError(message = 'Non authentifié') {
  return createError({
    statusCode: 401,
    statusMessage: message
  })
}

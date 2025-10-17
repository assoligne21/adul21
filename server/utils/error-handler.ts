import type { ErrorWithMessage } from '~/types/common'

/**
 * Helper to handle errors in API routes
 * Converts unknown errors to ErrorWithMessage and creates appropriate HTTP errors
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

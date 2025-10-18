import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ErrorWithMessage } from '~/types/common'

// Mock createError from H3 with factory function
vi.mock('h3', () => {
  return {
    createError: (config: any) => {
      const error = new Error(config.statusMessage) as any
      error.statusCode = config.statusCode
      error.statusMessage = config.statusMessage
      error.data = config.data
      return error
    }
  }
})

import { handleApiError, createValidationError, createNotFoundError, createUnauthorizedError } from '~/server/utils/error-handler'

describe('Error Handler Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handleApiError', () => {
    it('should handle ZodError and throw 400', () => {
      const zodError = {
        name: 'ZodError',
        message: 'Validation failed',
        errors: [{ path: ['email'], message: 'Invalid email' }]
      }

      expect(() => handleApiError(zodError)).toThrow()

      try {
        handleApiError(zodError)
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
        expect(error.statusMessage).toBe('Données invalides')
        expect(error.data).toEqual(zodError.errors)
      }
    })

    it('should handle database unique constraint errors and throw 409', () => {
      const dbError = {
        code: '23505',
        message: 'duplicate key value violates unique constraint'
      }

      try {
        handleApiError(dbError)
      } catch (error: any) {
        expect(error.statusCode).toBe(409)
        expect(error.statusMessage).toBe('Cette ressource existe déjà')
      }
    })

    it('should handle generic errors with default message', () => {
      const genericError = new Error('Something went wrong')

      try {
        handleApiError(genericError)
      } catch (error: any) {
        expect(error.statusCode).toBe(500)
        expect(error.statusMessage).toBe('Une erreur est survenue')
      }
    })

    it('should handle errors with custom status code', () => {
      const customError = {
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Access denied'
      }

      try {
        handleApiError(customError)
      } catch (error: any) {
        expect(error.statusCode).toBe(403)
        expect(error.statusMessage).toBe('Forbidden')
      }
    })

    it('should use custom default message', () => {
      const error = new Error('Test')

      try {
        handleApiError(error, 'Custom default message')
      } catch (error: any) {
        expect(error.statusMessage).toBe('Custom default message')
      }
    })
  })

  describe('createValidationError', () => {
    it('should create 400 error with message', () => {
      const error = createValidationError('Email invalide')

      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toBe('Email invalide')
    })

    it('should create 400 error with data', () => {
      const error = createValidationError('Validation failed', { field: 'email' })

      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toBe('Validation failed')
      expect(error.data).toEqual({ field: 'email' })
    })
  })

  describe('createNotFoundError', () => {
    it('should create 404 error with default message', () => {
      const error = createNotFoundError()

      expect(error.statusCode).toBe(404)
      expect(error.statusMessage).toBe('Ressource non trouvée')
    })

    it('should create 404 error with custom message', () => {
      const error = createNotFoundError('Membre non trouvé')

      expect(error.statusCode).toBe(404)
      expect(error.statusMessage).toBe('Membre non trouvé')
    })
  })

  describe('createUnauthorizedError', () => {
    it('should create 401 error with default message', () => {
      const error = createUnauthorizedError()

      expect(error.statusCode).toBe(401)
      expect(error.statusMessage).toBe('Non authentifié')
    })

    it('should create 401 error with custom message', () => {
      const error = createUnauthorizedError('Token invalide')

      expect(error.statusCode).toBe(401)
      expect(error.statusMessage).toBe('Token invalide')
    })
  })

  describe('Error type checking', () => {
    it('should recognize Error instances', () => {
      const error = new Error('Test error')

      expect(error instanceof Error).toBe(true)
      expect(error.message).toBe('Test error')
    })

    it('should handle custom error properties', () => {
      const customError = new Error('Custom') as Error & {
        statusCode?: number
        data?: unknown
      }
      customError.statusCode = 400
      customError.data = { field: 'email' }

      expect(customError.statusCode).toBe(400)
      expect(customError.data).toBeDefined()
    })
  })
})

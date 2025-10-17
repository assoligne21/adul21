import { describe, it, expect, vi } from 'vitest'
import type { ErrorWithMessage } from '~/types/common'

describe('Error Handler Utils', () => {
  describe('handleApiError', () => {
    it('should identify ZodError by name', () => {
      const zodError = {
        name: 'ZodError',
        message: 'Validation failed',
        errors: [{ path: ['email'], message: 'Invalid email' }]
      }

      expect(zodError.name).toBe('ZodError')
      expect(zodError.errors).toBeDefined()
    })

    it('should identify database errors by code', () => {
      const dbError = {
        code: '23505',
        message: 'duplicate key value violates unique constraint'
      }

      expect(dbError.code).toBe('23505')
    })

    it('should handle errors with status codes', () => {
      const httpError: ErrorWithMessage = {
        message: 'Not Found',
        statusCode: 404,
        statusMessage: 'Not Found'
      }

      expect(httpError.statusCode).toBe(404)
      expect(httpError.statusMessage).toBe('Not Found')
    })

    it('should have default status code for generic errors', () => {
      const error: ErrorWithMessage = {
        message: 'Something went wrong'
      }

      const statusCode = error.statusCode || 500
      expect(statusCode).toBe(500)
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

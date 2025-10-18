import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock H3's createError function as a global
const mockCreateError = vi.fn((config: any) => {
  const error: any = new Error(config.statusMessage)
  error.statusCode = config.statusCode
  error.statusMessage = config.statusMessage
  error.data = config.data
  return error
})

// Set it as a global before importing the module
vi.stubGlobal('createError', mockCreateError)

import { handleApiError, createValidationError, createNotFoundError, createUnauthorizedError } from '~/server/utils/error-handler'

describe('Error Handler Extended', () => {
  beforeEach(() => {
    mockCreateError.mockClear()
  })
  describe('handleApiError', () => {
    it('should handle generic errors', () => {
      const error = new Error('Test error')

      try {
        handleApiError(error)
        expect.fail('Should have thrown an error')
      } catch (result: any) {
        expect(result.statusCode).toBeDefined()
        expect(result.statusMessage).toBeDefined()
      }
    })

    it('should preserve error message', () => {
      const errorMessage = 'Custom error message'
      const error = new Error(errorMessage)

      try {
        handleApiError(error, errorMessage)
        expect.fail('Should have thrown an error')
      } catch (result: any) {
        expect(result.statusMessage).toBe(errorMessage)
      }
    })
  })

  describe('createValidationError', () => {
    it('should create validation error with 400 status', () => {
      const error = createValidationError('Invalid data')

      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toBe('Invalid data')
    })

    it('should include validation details', () => {
      const details = { field: 'email', issue: 'invalid format' }
      const error = createValidationError('Validation failed', details)

      expect(error.data).toEqual(details)
    })
  })

  describe('createNotFoundError', () => {
    it('should create 404 error', () => {
      const error = createNotFoundError('Resource not found')

      expect(error.statusCode).toBe(404)
      expect(error.statusMessage).toBe('Resource not found')
    })

    it('should have default message', () => {
      const error = createNotFoundError()

      expect(error.statusCode).toBe(404)
      expect(error.statusMessage).toBeDefined()
    })
  })

  describe('createUnauthorizedError', () => {
    it('should create 401 error', () => {
      const error = createUnauthorizedError('Not authenticated')

      expect(error.statusCode).toBe(401)
      expect(error.statusMessage).toBe('Not authenticated')
    })

    it('should have default message', () => {
      const error = createUnauthorizedError()

      expect(error.statusCode).toBe(401)
      expect(error.statusMessage).toBeDefined()
    })
  })

  describe('Error types', () => {
    it('should differentiate error types by status code', () => {
      const validationErr = createValidationError('test')
      const notFoundErr = createNotFoundError('test')
      const unauthorizedErr = createUnauthorizedError('test')

      expect(validationErr.statusCode).toBe(400)
      expect(notFoundErr.statusCode).toBe(404)
      expect(unauthorizedErr.statusCode).toBe(401)
    })
  })
})

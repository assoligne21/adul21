import { describe, it, expect } from 'vitest'
import { isErrorWithMessage } from '~/types/common'
import type { ErrorWithMessage, QueryParam, WhereCondition, UpdateRecord } from '~/types/common'

describe('Common Types', () => {
  describe('isErrorWithMessage', () => {
    it('should return true for valid ErrorWithMessage', () => {
      const error: ErrorWithMessage = {
        message: 'Error message'
      }

      expect(isErrorWithMessage(error)).toBe(true)
    })

    it('should return true for ErrorWithMessage with all fields', () => {
      const error: ErrorWithMessage = {
        message: 'Error message',
        statusCode: 400,
        statusMessage: 'Bad Request',
        name: 'ValidationError',
        code: 'VALIDATION_FAILED',
        errors: [{ field: 'email', message: 'Invalid' }],
        data: { timestamp: Date.now() }
      }

      expect(isErrorWithMessage(error)).toBe(true)
    })

    it('should return false for null', () => {
      expect(isErrorWithMessage(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isErrorWithMessage(undefined)).toBe(false)
    })

    it('should return false for string', () => {
      expect(isErrorWithMessage('error message')).toBe(false)
    })

    it('should return false for number', () => {
      expect(isErrorWithMessage(123)).toBe(false)
    })

    it('should return false for boolean', () => {
      expect(isErrorWithMessage(true)).toBe(false)
      expect(isErrorWithMessage(false)).toBe(false)
    })

    it('should return false for array', () => {
      expect(isErrorWithMessage([])).toBe(false)
      expect(isErrorWithMessage(['error'])).toBe(false)
    })

    it('should return false for object without message', () => {
      const error = {
        statusCode: 400,
        name: 'Error'
      }

      expect(isErrorWithMessage(error)).toBe(false)
    })

    it('should return false for object with non-string message', () => {
      const error = {
        message: 123
      }

      expect(isErrorWithMessage(error)).toBe(false)
    })

    it('should return true for standard Error', () => {
      const error = new Error('Standard error')
      expect(isErrorWithMessage(error)).toBe(true)
    })

    it('should return true for custom Error classes', () => {
      class CustomError extends Error {
        statusCode = 400
      }

      const error = new CustomError('Custom error')
      expect(isErrorWithMessage(error)).toBe(true)
    })
  })

  describe('QueryParam type', () => {
    it('should accept string', () => {
      const param: QueryParam = 'test'
      expect(param).toBe('test')
    })

    it('should accept number', () => {
      const param: QueryParam = 123
      expect(param).toBe(123)
    })

    it('should accept boolean', () => {
      const param1: QueryParam = true
      const param2: QueryParam = false
      expect(param1).toBe(true)
      expect(param2).toBe(false)
    })

    it('should accept null', () => {
      const param: QueryParam = null
      expect(param).toBeNull()
    })

    it('should accept undefined', () => {
      const param: QueryParam = undefined
      expect(param).toBeUndefined()
    })
  })

  describe('WhereCondition type', () => {
    it('should create basic where condition', () => {
      const condition: WhereCondition = {
        field: 'email',
        value: 'test@example.com'
      }

      expect(condition.field).toBe('email')
      expect(condition.value).toBe('test@example.com')
    })

    it('should support all operators', () => {
      const operators: WhereCondition['operator'][] = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'IN']

      operators.forEach(operator => {
        const condition: WhereCondition = {
          field: 'id',
          value: 1,
          operator
        }

        expect(condition.operator).toBe(operator)
      })
    })

    it('should work with different value types', () => {
      const conditions: WhereCondition[] = [
        { field: 'name', value: 'John' },
        { field: 'age', value: 25 },
        { field: 'active', value: true },
        { field: 'deleted', value: null },
        { field: 'optional', value: undefined }
      ]

      expect(conditions).toHaveLength(5)
    })

    it('should support LIKE operator', () => {
      const condition: WhereCondition = {
        field: 'email',
        value: '%@example.com',
        operator: 'LIKE'
      }

      expect(condition.operator).toBe('LIKE')
    })

    it('should support IN operator', () => {
      const condition: WhereCondition = {
        field: 'status',
        value: 'active',
        operator: 'IN'
      }

      expect(condition.operator).toBe('IN')
    })
  })

  describe('UpdateRecord type', () => {
    it('should accept string values', () => {
      const record: UpdateRecord = {
        name: 'John',
        email: 'john@example.com'
      }

      expect(record.name).toBe('John')
      expect(record.email).toBe('john@example.com')
    })

    it('should accept number values', () => {
      const record: UpdateRecord = {
        age: 30,
        score: 95.5
      }

      expect(record.age).toBe(30)
      expect(record.score).toBe(95.5)
    })

    it('should accept boolean values', () => {
      const record: UpdateRecord = {
        isActive: true,
        isDeleted: false
      }

      expect(record.isActive).toBe(true)
      expect(record.isDeleted).toBe(false)
    })

    it('should accept Date values', () => {
      const now = new Date()
      const record: UpdateRecord = {
        createdAt: now,
        updatedAt: now
      }

      expect(record.createdAt).toBe(now)
      expect(record.updatedAt).toBe(now)
    })

    it('should accept null values', () => {
      const record: UpdateRecord = {
        deletedAt: null,
        lastLogin: null
      }

      expect(record.deletedAt).toBeNull()
      expect(record.lastLogin).toBeNull()
    })

    it('should accept array values', () => {
      const record: UpdateRecord = {
        tags: ['tag1', 'tag2'],
        ids: [1, 2, 3]
      }

      expect(record.tags).toEqual(['tag1', 'tag2'])
      expect(record.ids).toEqual([1, 2, 3])
    })

    it('should accept mixed types', () => {
      const record: UpdateRecord = {
        name: 'Test',
        age: 25,
        active: true,
        deletedAt: null,
        tags: ['tag1'],
        updatedAt: new Date()
      }

      expect(Object.keys(record)).toHaveLength(6)
    })

    it('should work with empty object', () => {
      const record: UpdateRecord = {}
      expect(Object.keys(record)).toHaveLength(0)
    })
  })
})

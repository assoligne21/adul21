import { describe, it, expect, vi } from 'vitest'
import {
  logger,
  apiLogger,
  dbLogger,
  authLogger,
  emailLogger,
  logRequest,
  logResponse,
  logError,
  logDbQuery,
  logAuth,
  logEmail
} from '~/server/utils/logger'

describe('Logger', () => {
  describe('Logger instances', () => {
    it('should have root logger', () => {
      expect(logger).toBeDefined()
      expect(typeof logger.info).toBe('function')
      expect(typeof logger.error).toBe('function')
      expect(typeof logger.debug).toBe('function')
      expect(typeof logger.warn).toBe('function')
    })

    it('should have domain-specific child loggers', () => {
      expect(apiLogger).toBeDefined()
      expect(dbLogger).toBeDefined()
      expect(authLogger).toBeDefined()
      expect(emailLogger).toBeDefined()
    })
  })

  describe('logRequest', () => {
    it('should log incoming request', () => {
      const mockEvent = {
        node: {
          req: {
            method: 'GET',
            url: '/api/test'
          }
        }
      }

      expect(() => logRequest(mockEvent)).not.toThrow()
    })

    it('should handle missing method and url', () => {
      const mockEvent = {
        node: {
          req: {}
        }
      }

      expect(() => logRequest(mockEvent)).not.toThrow()
    })
  })

  describe('logResponse', () => {
    it('should log response with status code', () => {
      const mockEvent = {
        node: {
          req: {
            method: 'POST',
            url: '/api/contact'
          }
        }
      }

      expect(() => logResponse(mockEvent, 200)).not.toThrow()
    })

    it('should log response with duration', () => {
      const mockEvent = {
        node: {
          req: {
            method: 'GET',
            url: '/api/members'
          }
        }
      }

      expect(() => logResponse(mockEvent, 200, 150)).not.toThrow()
    })

    it('should handle different status codes', () => {
      const mockEvent = {
        node: {
          req: {
            method: 'DELETE',
            url: '/api/resource/123'
          }
        }
      }

      const statusCodes = [200, 201, 400, 401, 404, 500]

      statusCodes.forEach(statusCode => {
        expect(() => logResponse(mockEvent, statusCode)).not.toThrow()
      })
    })
  })

  describe('logError', () => {
    it('should log error with message and stack', () => {
      const error = new Error('Test error')

      expect(() => logError(error)).not.toThrow()
    })

    it('should log error with additional context', () => {
      const error = new Error('Database error')
      const context = {
        route: '/api/users',
        userId: '123',
        operation: 'SELECT'
      }

      expect(() => logError(error, context)).not.toThrow()
    })

    it('should handle different error types', () => {
      const errors = [
        new Error('Standard error'),
        new TypeError('Type error'),
        new RangeError('Range error'),
        { message: 'Custom error object', stack: 'stack trace' }
      ]

      errors.forEach(error => {
        expect(() => logError(error)).not.toThrow()
      })
    })

    it('should handle error without stack', () => {
      const error = {
        message: 'Error without stack',
        name: 'CustomError'
      }

      expect(() => logError(error as Error)).not.toThrow()
    })
  })

  describe('logDbQuery', () => {
    it('should log database query', () => {
      const query = 'SELECT * FROM users WHERE id = $1'
      const params = ['123']

      expect(() => logDbQuery(query, params)).not.toThrow()
    })

    it('should log query with duration', () => {
      const query = 'INSERT INTO members (name) VALUES ($1)'
      const params = ['John Doe']
      const duration = 25

      expect(() => logDbQuery(query, params, duration)).not.toThrow()
    })

    it('should log query without params', () => {
      const query = 'SELECT COUNT(*) FROM testimonies'

      expect(() => logDbQuery(query)).not.toThrow()
    })

    it('should handle complex queries', () => {
      const complexQueries = [
        'SELECT * FROM users JOIN profiles ON users.id = profiles.user_id',
        'UPDATE members SET status = $1 WHERE id = $2',
        'DELETE FROM testimonies WHERE created_at < $1'
      ]

      complexQueries.forEach(query => {
        expect(() => logDbQuery(query, [])).not.toThrow()
      })
    })
  })

  describe('logAuth', () => {
    it('should log login event', () => {
      expect(() => logAuth('login', 'user-123', 'user@example.com')).not.toThrow()
    })

    it('should log logout event', () => {
      expect(() => logAuth('logout', 'user-456')).not.toThrow()
    })

    it('should log token refresh', () => {
      expect(() => logAuth('token_refresh', 'user-789', 'admin@example.com')).not.toThrow()
    })

    it('should log authentication failure', () => {
      expect(() =>
        logAuth('auth_failure', undefined, 'wrong@example.com', { reason: 'invalid_password' })
      ).not.toThrow()
    })

    it('should log auth events with additional details', () => {
      const details = {
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        duration: 150
      }

      expect(() => logAuth('login', 'user-123', 'user@example.com', details)).not.toThrow()
    })

    it('should handle all auth event types', () => {
      const events: Array<'login' | 'logout' | 'token_refresh' | 'auth_failure'> = [
        'login',
        'logout',
        'token_refresh',
        'auth_failure'
      ]

      events.forEach(event => {
        expect(() => logAuth(event, 'user-id', 'email@test.com')).not.toThrow()
      })
    })
  })

  describe('logEmail', () => {
    it('should log successful email send', () => {
      expect(() => logEmail('recipient@example.com', 'Test Subject', true)).not.toThrow()
    })

    it('should log failed email send', () => {
      expect(() =>
        logEmail('recipient@example.com', 'Test Subject', false, 'SMTP connection failed')
      ).not.toThrow()
    })

    it('should handle different email subjects', () => {
      const subjects = [
        'Votre témoignage a bien été reçu',
        'Demande d\'adhésion reçue',
        'Message bien reçu',
        'Notification admin'
      ]

      subjects.forEach(subject => {
        expect(() => logEmail('test@example.com', subject, true)).not.toThrow()
      })
    })

    it('should log emails with detailed error messages', () => {
      const errors = [
        'SMTP connection timeout',
        'Invalid recipient address',
        'Authentication failed',
        'Rate limit exceeded'
      ]

      errors.forEach(error => {
        expect(() => logEmail('test@example.com', 'Subject', false, error)).not.toThrow()
      })
    })
  })

  describe('Logger configuration', () => {
    it('should use appropriate log level', () => {
      expect(logger.level).toBeDefined()
      expect(typeof logger.level).toBe('string')
    })

    it('should have child loggers with domain bindings', () => {
      // Child loggers should have bindings
      expect(apiLogger).toBeDefined()
      expect(dbLogger).toBeDefined()
      expect(authLogger).toBeDefined()
      expect(emailLogger).toBeDefined()
    })
  })

  describe('Integration scenarios', () => {
    it('should handle complete request lifecycle logging', () => {
      const mockEvent = {
        node: {
          req: {
            method: 'POST',
            url: '/api/testimonies'
          }
        }
      }

      expect(() => {
        logRequest(mockEvent)
        logDbQuery('INSERT INTO testimonies VALUES ($1)', ['data'], 45)
        logResponse(mockEvent, 201, 150)
      }).not.toThrow()
    })

    it('should handle error scenario with context', () => {
      const mockEvent = {
        node: {
          req: {
            method: 'GET',
            url: '/api/members/999'
          }
        }
      }

      expect(() => {
        logRequest(mockEvent)
        const error = new Error('Member not found')
        logError(error, {
          route: '/api/members/999',
          memberId: '999'
        })
        logResponse(mockEvent, 404, 50)
      }).not.toThrow()
    })

    it('should handle email sending workflow', () => {
      expect(() => {
        logEmail('user@example.com', 'Confirmation', true)
        logEmail('admin@example.com', 'Notification', true)
      }).not.toThrow()
    })

    it('should handle authentication workflow', () => {
      expect(() => {
        logAuth('login', 'user-123', 'user@example.com', { duration: 100 })
        logDbQuery('SELECT * FROM admins WHERE email = $1', ['user@example.com'], 15)
        logAuth('token_refresh', 'user-123', 'user@example.com')
      }).not.toThrow()
    })
  })
})

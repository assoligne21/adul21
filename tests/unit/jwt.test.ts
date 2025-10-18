import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createToken, verifyToken, getTokenFromCookie, setTokenCookie, clearTokenCookie, requireAuth } from '~/server/utils/jwt'
import type { JWTPayload } from '~/server/utils/jwt'
import type { H3Event } from 'h3'

describe('JWT Utils', () => {
  const validPayload: JWTPayload = {
    userId: '123',
    email: 'test@example.com',
    name: 'Test User'
  }

  describe('createToken', () => {
    it('should create a valid JWT token', () => {
      const token = createToken(validPayload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT format: header.payload.signature
    })

    it('should create token with all payload fields', () => {
      const token = createToken(validPayload)
      const decoded = verifyToken(token)

      expect(decoded).toBeDefined()
      expect(decoded?.userId).toBe(validPayload.userId)
      expect(decoded?.email).toBe(validPayload.email)
      expect(decoded?.name).toBe(validPayload.name)
    })

    it('should create token for different users', () => {
      const payload1: JWTPayload = {
        userId: '1',
        email: 'user1@example.com',
        name: 'User 1'
      }
      const payload2: JWTPayload = {
        userId: '2',
        email: 'user2@example.com',
        name: 'User 2'
      }

      const token1 = createToken(payload1)
      const token2 = createToken(payload2)

      expect(token1).not.toBe(token2)

      const decoded1 = verifyToken(token1)
      const decoded2 = verifyToken(token2)

      expect(decoded1?.userId).toBe('1')
      expect(decoded2?.userId).toBe('2')
    })

    it('should handle special characters in payload', () => {
      const payload: JWTPayload = {
        userId: '123',
        email: 'test+special@example.com',
        name: "O'Brien-Smith"
      }

      const token = createToken(payload)
      const decoded = verifyToken(token)

      expect(decoded?.email).toBe(payload.email)
      expect(decoded?.name).toBe(payload.name)
    })

    it('should handle unicode characters in name', () => {
      const payload: JWTPayload = {
        userId: '123',
        email: 'test@example.com',
        name: 'François Müller'
      }

      const token = createToken(payload)
      const decoded = verifyToken(token)

      expect(decoded?.name).toBe(payload.name)
    })
  })

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const token = createToken(validPayload)
      const decoded = verifyToken(token)

      expect(decoded).not.toBeNull()
      expect(decoded?.userId).toBe(validPayload.userId)
      expect(decoded?.email).toBe(validPayload.email)
      expect(decoded?.name).toBe(validPayload.name)
    })

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid.token.here'
      const decoded = verifyToken(invalidToken)

      expect(decoded).toBeNull()
    })

    it('should return null for malformed token', () => {
      const malformedToken = 'not-a-jwt-token'
      const decoded = verifyToken(malformedToken)

      expect(decoded).toBeNull()
    })

    it('should return null for empty token', () => {
      const decoded = verifyToken('')

      expect(decoded).toBeNull()
    })

    it('should return null for token with wrong signature', () => {
      const token = createToken(validPayload)
      // Modify the signature part
      const parts = token.split('.')
      parts[2] = 'wrongSignature'
      const tamperedToken = parts.join('.')

      const decoded = verifyToken(tamperedToken)

      expect(decoded).toBeNull()
    })

    it('should include standard JWT claims', () => {
      const token = createToken(validPayload)
      const decoded = verifyToken(token) as JWTPayload & { iat: number; exp: number }

      expect(decoded).toBeDefined()
      expect(decoded.iat).toBeDefined() // issued at
      expect(decoded.exp).toBeDefined() // expiration
      expect(typeof decoded.iat).toBe('number')
      expect(typeof decoded.exp).toBe('number')
      expect(decoded.exp).toBeGreaterThan(decoded.iat)
    })

    it('should verify token expires in 7 days', () => {
      const token = createToken(validPayload)
      const decoded = verifyToken(token) as JWTPayload & { iat: number; exp: number }

      const expectedExpiration = 7 * 24 * 60 * 60 // 7 days in seconds
      const actualExpiration = decoded.exp - decoded.iat

      // Allow 1 second margin for test execution time
      expect(actualExpiration).toBeGreaterThanOrEqual(expectedExpiration - 1)
      expect(actualExpiration).toBeLessThanOrEqual(expectedExpiration + 1)
    })
  })

  describe('Token lifecycle', () => {
    it('should create and verify token successfully', () => {
      const payload: JWTPayload = {
        userId: '456',
        email: 'admin@adul21.fr',
        name: 'Admin User'
      }

      const token = createToken(payload)
      const decoded = verifyToken(token)

      expect(decoded).not.toBeNull()
      expect(decoded).toMatchObject(payload)
    })

    it('should verify token created for different payload', () => {
      const payload1: JWTPayload = {
        userId: '1',
        email: 'user1@test.com',
        name: 'User One'
      }
      const payload2: JWTPayload = {
        userId: '2',
        email: 'user2@test.com',
        name: 'User Two'
      }

      const token1 = createToken(payload1)
      const token2 = createToken(payload2)

      expect(verifyToken(token1)).toMatchObject(payload1)
      expect(verifyToken(token2)).toMatchObject(payload2)
      expect(verifyToken(token1)).not.toMatchObject(payload2)
    })
  })

  describe('Security', () => {
    it('should not allow token modification', () => {
      const token = createToken(validPayload)
      const parts = token.split('.')

      // Try to decode and modify payload
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
      payload.userId = '999' // Attacker tries to change userId

      // Re-encode modified payload
      const modifiedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
      parts[1] = modifiedPayload
      const tamperedToken = parts.join('.')

      // Verification should fail
      const decoded = verifyToken(tamperedToken)
      expect(decoded).toBeNull()
    })

    it('should reject token with invalid structure', () => {
      expect(verifyToken('header.payload')).toBeNull()
      expect(verifyToken('header')).toBeNull()
      expect(verifyToken('header.payload.signature.extra')).toBeNull()
    })
  })

  describe('Cookie operations', () => {
    it('should get token from cookie', () => {
      const token = createToken(validPayload)
      const mockEvent = {
        node: {
          req: {
            headers: {
              cookie: `admin_token=${token}`
            }
          }
        }
      } as unknown as H3Event

      const extractedToken = getTokenFromCookie(mockEvent)
      expect(extractedToken).toBe(token)
    })

    it('should return null when no cookie present', () => {
      const mockEvent = {
        node: {
          req: {
            headers: {}
          }
        }
      } as unknown as H3Event

      const token = getTokenFromCookie(mockEvent)
      expect(token).toBeNull()
    })

    it('should set token cookie', () => {
      const token = createToken(validPayload)
      const cookies: string[] = []
      const mockEvent = {
        node: {
          res: {
            setHeader: (name: string, value: string) => {
              if (name.toLowerCase() === 'set-cookie') {
                cookies.push(value)
              }
            },
            getHeader: () => undefined
          }
        }
      } as unknown as H3Event

      setTokenCookie(mockEvent, token)
      expect(cookies.length).toBeGreaterThan(0)
      expect(cookies[0]).toContain('admin_token=')
      expect(cookies[0]).toContain('HttpOnly')
    })

    it('should clear token cookie', () => {
      const cookies: string[] = []
      const mockEvent = {
        node: {
          res: {
            setHeader: (name: string, value: string) => {
              if (name.toLowerCase() === 'set-cookie') {
                cookies.push(value)
              }
            },
            getHeader: () => undefined
          }
        }
      } as unknown as H3Event

      clearTokenCookie(mockEvent)
      expect(cookies.length).toBeGreaterThan(0)
      expect(cookies[0]).toContain('admin_token=')
      expect(cookies[0]).toContain('Max-Age=0')
    })
  })

  describe('requireAuth', () => {
    it('should return payload for valid token', async () => {
      const token = createToken(validPayload)
      const mockEvent = {
        node: {
          req: {
            headers: {
              cookie: `admin_token=${token}`
            }
          }
        }
      } as unknown as H3Event

      const payload = await requireAuth(mockEvent)
      expect(payload).toMatchObject(validPayload)
    })

    it('should throw 401 when no token present', async () => {
      const mockEvent = {
        node: {
          req: {
            headers: {}
          }
        }
      } as unknown as H3Event

      await expect(requireAuth(mockEvent)).rejects.toThrow('Non authentifié')
    })

    it('should throw 401 for invalid token', async () => {
      const mockEvent = {
        node: {
          req: {
            headers: {
              cookie: 'admin_token=invalid.token.here'
            }
          }
        }
      } as unknown as H3Event

      await expect(requireAuth(mockEvent)).rejects.toThrow('Token invalide ou expiré')
    })
  })
})

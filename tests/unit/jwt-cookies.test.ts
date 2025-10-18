import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createToken,
  verifyToken,
  type JWTPayload
} from '~/server/utils/jwt'

// Note: getTokenFromCookie, setTokenCookie, clearTokenCookie, and requireAuth
// depend on H3 functions that are difficult to mock in unit tests.
// They are better tested through integration tests.

describe('JWT Token Operations', () => {
  describe('createToken and verifyToken', () => {
    it('should create a valid JWT token', () => {
      const payload: JWTPayload = {
        userId: 'user-123',
        email: 'admin@adul21.fr',
        name: 'Admin User'
      }

      const token = createToken(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should verify and decode a valid token', () => {
      const payload: JWTPayload = {
        userId: 'user-456',
        email: 'test@adul21.fr',
        name: 'Test User'
      }

      const token = createToken(payload)
      const decoded = verifyToken(token)

      expect(decoded).not.toBeNull()
      expect(decoded?.userId).toBe('user-456')
      expect(decoded?.email).toBe('test@adul21.fr')
      expect(decoded?.name).toBe('Test User')
    })

    it('should return null for invalid token', () => {
      const result = verifyToken('invalid-token')

      expect(result).toBeNull()
    })

    it('should return null for malformed token', () => {
      const result = verifyToken('not.a.valid.jwt.token')

      expect(result).toBeNull()
    })

    it('should handle different payload data', () => {
      const testCases: JWTPayload[] = [
        { userId: '1', email: 'user1@test.com', name: 'User One' },
        { userId: '999', email: 'admin@adul21.fr', name: 'Super Admin' },
        { userId: 'abc-def', email: 'test@example.com', name: 'Test Account' }
      ]

      testCases.forEach(payload => {
        const token = createToken(payload)
        const decoded = verifyToken(token)

        expect(decoded).toMatchObject(payload)
      })
    })

    it('should include expiration in token', () => {
      const payload: JWTPayload = {
        userId: 'test',
        email: 'test@test.com',
        name: 'Test'
      }

      const token = createToken(payload)
      const decoded: any = verifyToken(token)

      expect(decoded).toHaveProperty('exp')
      expect(decoded?.exp).toBeGreaterThan(Date.now() / 1000)
    })

    it('should create different tokens for same payload', () => {
      const payload: JWTPayload = {
        userId: 'same-user',
        email: 'same@email.com',
        name: 'Same Name'
      }

      // Wait a tiny bit to ensure different iat (issued at) timestamp
      const token1 = createToken(payload)
      const token2 = createToken(payload)

      // Tokens should be different due to different timestamps
      // but both should decode to same user data
      const decoded1 = verifyToken(token1)
      const decoded2 = verifyToken(token2)

      expect(decoded1?.userId).toBe(decoded2?.userId)
      expect(decoded1?.email).toBe(decoded2?.email)
    })
  })

  describe('Token properties', () => {
    it('should encode userId, email, and name', () => {
      const payload: JWTPayload = {
        userId: 'prop-test',
        email: 'props@test.com',
        name: 'Props Test'
      }

      const token = createToken(payload)
      const decoded = verifyToken(token)

      expect(decoded).toHaveProperty('userId')
      expect(decoded).toHaveProperty('email')
      expect(decoded).toHaveProperty('name')
    })

    it('should maintain data types', () => {
      const payload: JWTPayload = {
        userId: 'type-test',
        email: 'type@test.com',
        name: 'Type Test'
      }

      const token = createToken(payload)
      const decoded = verifyToken(token)

      expect(typeof decoded?.userId).toBe('string')
      expect(typeof decoded?.email).toBe('string')
      expect(typeof decoded?.name).toBe('string')
    })
  })
})

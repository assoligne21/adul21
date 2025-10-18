import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createToken, verifyToken, type JWTPayload } from '~/server/utils/jwt'

describe('JWT Extended Tests', () => {
  const testPayload: JWTPayload = {
    userId: '123-abc',
    email: 'admin@adul21.fr',
    name: 'Test Admin'
  }

  describe('Token lifecycle', () => {
    it('should create and verify token successfully', () => {
      const token = createToken(testPayload)
      const decoded = verifyToken(token)

      expect(decoded).toMatchObject(testPayload)
      expect(decoded?.userId).toBe(testPayload.userId)
      expect(decoded?.email).toBe(testPayload.email)
      expect(decoded?.name).toBe(testPayload.name)
    })

    it('should include expiration in token', () => {
      const token = createToken(testPayload)
      const decoded = verifyToken(token)

      expect(decoded).toHaveProperty('iat') // issued at
      expect(decoded).toHaveProperty('exp') // expiration
    })

    it('should create valid tokens for same payload', () => {
      const token1 = createToken(testPayload)
      const token2 = createToken(testPayload)

      // Both tokens should be valid
      const decoded1 = verifyToken(token1)
      const decoded2 = verifyToken(token2)

      expect(decoded1?.userId).toBe(testPayload.userId)
      expect(decoded2?.userId).toBe(testPayload.userId)
      expect(decoded1?.email).toBe(decoded2?.email)
    })
  })

  describe('Token payload variations', () => {
    it('should handle different user IDs', () => {
      const payloads = [
        { ...testPayload, userId: '1' },
        { ...testPayload, userId: 'uuid-123-456' },
        { ...testPayload, userId: 'admin-001' }
      ]

      payloads.forEach(payload => {
        const token = createToken(payload)
        const decoded = verifyToken(token)
        expect(decoded?.userId).toBe(payload.userId)
      })
    })

    it('should handle different email formats', () => {
      const emails = [
        'test@example.com',
        'admin@adul21.fr',
        'user.name+tag@domain.co.uk'
      ]

      emails.forEach(email => {
        const token = createToken({ ...testPayload, email })
        const decoded = verifyToken(token)
        expect(decoded?.email).toBe(email)
      })
    })

    it('should handle names with special characters', () => {
      const names = [
        'Jean-Pierre Dupont',
        'Marie-José O\'Connor',
        'François Müller'
      ]

      names.forEach(name => {
        const token = createToken({ ...testPayload, name })
        const decoded = verifyToken(token)
        expect(decoded?.name).toBe(name)
      })
    })
  })

  describe('Token validation edge cases', () => {
    it('should return null for empty string token', () => {
      const result = verifyToken('')
      expect(result).toBeNull()
    })

    it('should return null for malformed token', () => {
      const result = verifyToken('not.a.valid.token')
      expect(result).toBeNull()
    })

    it('should return null for token with wrong signature', () => {
      const token = createToken(testPayload)
      // Tamper with the token
      const tamperedToken = token.slice(0, -5) + 'xxxxx'
      const result = verifyToken(tamperedToken)
      expect(result).toBeNull()
    })

    it('should return null for invalid JSON token', () => {
      const result = verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature')
      expect(result).toBeNull()
    })
  })

  describe('Token security', () => {
    it('should create tokens with JWT structure', () => {
      const token = createToken(testPayload)
      const parts = token.split('.')

      // JWT has 3 parts: header.payload.signature
      expect(parts).toHaveLength(3)
      expect(parts[0]).toBeTruthy() // header
      expect(parts[1]).toBeTruthy() // payload
      expect(parts[2]).toBeTruthy() // signature
    })

    it('should not include sensitive data in plain text', () => {
      const token = createToken(testPayload)

      // Token should not contain plain text email or name
      // (they should be base64 encoded in payload)
      const plainToken = token.toLowerCase()
      expect(plainToken).not.toContain('@adul21.fr')
      expect(plainToken).not.toContain('test admin')
    })
  })

  describe('Token consistency', () => {
    it('should maintain data integrity through encode/decode cycle', () => {
      const complexPayload: JWTPayload = {
        userId: 'user-123-abc-def-456',
        email: 'test.user+tag@example.com',
        name: 'Jean-François O\'Reilly'
      }

      const token = createToken(complexPayload)
      const decoded = verifyToken(token)

      expect(decoded).toMatchObject(complexPayload)
    })

    it('should handle multiple encode/decode cycles', () => {
      let payload = testPayload

      for (let i = 0; i < 5; i++) {
        const token = createToken(payload)
        const decoded = verifyToken(token)

        expect(decoded?.userId).toBe(testPayload.userId)
        expect(decoded?.email).toBe(testPayload.email)
        expect(decoded?.name).toBe(testPayload.name)
      }
    })
  })
})

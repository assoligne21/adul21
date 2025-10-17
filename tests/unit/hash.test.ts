import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '~/server/utils/hash'

describe('Hash Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'mySecurePassword123'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(0)
      expect(hash).toMatch(/^\$2[aby]\$/) // bcrypt hash format
    })

    it('should generate different hashes for the same password', async () => {
      const password = 'samePassword'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2) // Different salts
    })

    it('should hash different passwords differently', async () => {
      const hash1 = await hashPassword('password1')
      const hash2 = await hashPassword('password2')

      expect(hash1).not.toBe(hash2)
    })

    it('should hash empty string', async () => {
      const hash = await hashPassword('')
      expect(hash).toBeDefined()
      expect(hash.length).toBeGreaterThan(0)
    })

    it('should hash special characters', async () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).toMatch(/^\$2[aby]\$/)
    })

    it('should hash unicode characters', async () => {
      const password = 'Mot de passe avec accents: éèêë'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).toMatch(/^\$2[aby]\$/)
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'correctPassword123'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(password, hash)

      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'correctPassword'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword('wrongPassword', hash)

      expect(isValid).toBe(false)
    })

    it('should reject empty password against valid hash', async () => {
      const hash = await hashPassword('somePassword')
      const isValid = await verifyPassword('', hash)

      expect(isValid).toBe(false)
    })

    it('should verify empty password if hash is for empty string', async () => {
      const hash = await hashPassword('')
      const isValid = await verifyPassword('', hash)

      expect(isValid).toBe(true)
    })

    it('should be case sensitive', async () => {
      const password = 'CaseSensitive'
      const hash = await hashPassword(password)

      expect(await verifyPassword('CaseSensitive', hash)).toBe(true)
      expect(await verifyPassword('casesensitive', hash)).toBe(false)
      expect(await verifyPassword('CASESENSITIVE', hash)).toBe(false)
    })

    it('should handle special characters correctly', async () => {
      const password = 'P@ssw0rd!2023#'
      const hash = await hashPassword(password)

      expect(await verifyPassword(password, hash)).toBe(true)
      expect(await verifyPassword('P@ssw0rd!2023', hash)).toBe(false)
    })

    it('should handle long passwords', async () => {
      const password = 'a'.repeat(100)
      const hash = await hashPassword(password)

      expect(await verifyPassword(password, hash)).toBe(true)
      // bcrypt truncates passwords over 72 bytes, so shorter passwords won't necessarily fail
      const differentPassword = 'b'.repeat(100)
      expect(await verifyPassword(differentPassword, hash)).toBe(false)
    })

    it('should reject invalid hash format', async () => {
      const isValid = await verifyPassword('password', 'notAValidHash')
      expect(isValid).toBe(false)
    })
  })

  describe('Integration', () => {
    it('should work with full authentication flow', async () => {
      const originalPassword = 'userPassword123'

      // Registration: hash password
      const hashedPassword = await hashPassword(originalPassword)

      // Login: verify password
      const loginSuccess = await verifyPassword(originalPassword, hashedPassword)
      expect(loginSuccess).toBe(true)

      // Wrong login attempt
      const loginFail = await verifyPassword('wrongPassword', hashedPassword)
      expect(loginFail).toBe(false)
    })
  })
})

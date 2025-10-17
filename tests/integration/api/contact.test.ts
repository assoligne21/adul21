import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import * as emailModule from '~/server/utils/email'

// Mock the email module
vi.mock('~/server/utils/email', () => ({
  sendEmail: vi.fn().mockResolvedValue(true)
}))

describe('/api/contact', async () => {
  await setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should validate required fields', async () => {
    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: {}
      })
      expect.fail('Should have thrown validation error')
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
    }
  })

  it('should reject invalid email format', async () => {
    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: {
          civility: 'M.',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'invalid-email',
          subject: 'other',
          message: 'This is a test message with enough characters',
          acceptsProcessing: true
        }
      })
      expect.fail('Should have thrown validation error')
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
    }
  })

  it('should reject message too short', async () => {
    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: {
          civility: 'M.',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@example.com',
          subject: 'other',
          message: 'Short',
          acceptsProcessing: true
        }
      })
      expect.fail('Should have thrown validation error')
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
    }
  })

  it('should reject without RGPD consent', async () => {
    try {
      await $fetch('/api/contact', {
        method: 'POST',
        body: {
          civility: 'M.',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@example.com',
          subject: 'other',
          message: 'This is a test message with enough characters',
          acceptsProcessing: false
        }
      })
      expect.fail('Should have thrown validation error')
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
    }
  })

  it('should accept valid contact form submission', async () => {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        civility: 'Mme',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        phone: '0612345678',
        subject: 'testimony',
        message: 'Ceci est un message de test avec suffisamment de caractères pour être valide.',
        acceptsProcessing: true
      }
    })

    expect(response).toMatchObject({
      success: true,
      message: expect.stringContaining('succès')
    })

    // Verify email was sent
    expect(emailModule.sendEmail).toHaveBeenCalledTimes(2) // Admin + user confirmation
  })

  it('should accept all valid subject types', async () => {
    const subjects = ['testimony', 'membership', 'volunteering', 'press', 'legal', 'other']

    for (const subject of subjects) {
      const response = await $fetch('/api/contact', {
        method: 'POST',
        body: {
          civility: 'M.',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          subject,
          message: 'This is a test message with enough characters to be valid.',
          acceptsProcessing: true
        }
      })

      expect(response.success).toBe(true)
    }
  })

  it('should sanitize input to prevent XSS', async () => {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        civility: 'M.',
        firstName: '<script>alert("XSS")</script>Jean',
        lastName: '<img src=x onerror=alert(1)>Dupont',
        email: 'test@example.com',
        subject: 'other',
        message: 'Normal message <script>alert("test")</script> with XSS attempt',
        acceptsProcessing: true
      }
    })

    expect(response.success).toBe(true)

    // Verify sendEmail was called with sanitized data
    const emailCalls = vi.mocked(emailModule.sendEmail).mock.calls
    const adminEmail = emailCalls[0][0].html

    // Should not contain script tags
    expect(adminEmail).not.toContain('<script>')
    expect(adminEmail).not.toContain('onerror')
  })

  it('should accept optional phone field', async () => {
    const response = await $fetch('/api/contact', {
      method: 'POST',
      body: {
        civility: 'M.',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        // phone omitted
        subject: 'other',
        message: 'This is a test message without phone number provided.',
        acceptsProcessing: true
      }
    })

    expect(response.success).toBe(true)
  })
})

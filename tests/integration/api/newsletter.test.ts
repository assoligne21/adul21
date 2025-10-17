import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('/api/newsletter/subscribe', async () => {
  await setup()

  it('should validate email format', async () => {
    try {
      await $fetch('/api/newsletter/subscribe', {
        method: 'POST',
        body: {
          email: 'invalid-email'
        }
      })
      expect.fail('Should have thrown validation error')
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
    }
  })

  it('should require email field', async () => {
    try {
      await $fetch('/api/newsletter/subscribe', {
        method: 'POST',
        body: {}
      })
      expect.fail('Should have thrown validation error')
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
    }
  })

  it('should accept valid newsletter subscription', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`

    const response = await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: {
        email: uniqueEmail
      }
    })

    expect(response).toMatchObject({
      success: true,
      message: expect.any(String)
    })
  })

  it('should handle duplicate email subscription gracefully', async () => {
    const email = `duplicate-${Date.now()}@example.com`

    // First subscription
    await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: { email }
    })

    // Second subscription with same email
    try {
      const response = await $fetch('/api/newsletter/subscribe', {
        method: 'POST',
        body: { email }
      })

      // Should either succeed (idempotent) or return appropriate error
      expect(response.success || response.statusCode === 409).toBeTruthy()
    } catch (error: any) {
      // Duplicate error is acceptable
      expect([400, 409, 500]).toContain(error.statusCode)
    }
  })

  it('should sanitize email input', async () => {
    try {
      await $fetch('/api/newsletter/subscribe', {
        method: 'POST',
        body: {
          email: '<script>alert("XSS")</script>@example.com'
        }
      })
      expect.fail('Should have rejected invalid email')
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
    }
  })

  it('should reject email longer than 255 characters', async () => {
    try {
      await $fetch('/api/newsletter/subscribe', {
        method: 'POST',
        body: {
          email: 'a'.repeat(250) + '@example.com'
        }
      })
      expect.fail('Should have rejected email too long')
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
    }
  })
})

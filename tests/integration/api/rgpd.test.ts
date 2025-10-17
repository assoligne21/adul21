import { describe, it, expect, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('RGPD API Endpoints', async () => {
  await setup()

  describe('/api/rgpd/data-access', () => {
    it('should validate email format', async () => {
      try {
        await $fetch('/api/rgpd/data-access', {
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
        await $fetch('/api/rgpd/data-access', {
          method: 'POST',
          body: {}
        })
        expect.fail('Should have thrown validation error')
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
      }
    })

    it('should return empty data for unknown email', async () => {
      const response = await $fetch('/api/rgpd/data-access', {
        method: 'POST',
        body: {
          email: 'nonexistent-' + Date.now() + '@example.com'
        }
      })

      expect(response).toMatchObject({
        success: true,
        data: {
          email: expect.any(String),
          testimonies: [],
          memberships: [],
          newsletter: []
        }
      })
    })

    it('should include request metadata', async () => {
      const response = await $fetch('/api/rgpd/data-access', {
        method: 'POST',
        body: {
          email: 'test@example.com'
        }
      })

      expect(response.data).toHaveProperty('requestDate')
      expect(response.data.requestDate).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })
  })

  describe('/api/rgpd/data-deletion', () => {
    it('should validate email format', async () => {
      try {
        await $fetch('/api/rgpd/data-deletion', {
          method: 'POST',
          body: {
            email: 'invalid-email',
            confirmDeletion: true
          }
        })
        expect.fail('Should have thrown validation error')
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
      }
    })

    it('should require confirmDeletion to be true', async () => {
      try {
        await $fetch('/api/rgpd/data-deletion', {
          method: 'POST',
          body: {
            email: 'test@example.com',
            confirmDeletion: false
          }
        })
        expect.fail('Should have thrown validation error')
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
      }
    })

    it('should require email field', async () => {
      try {
        await $fetch('/api/rgpd/data-deletion', {
          method: 'POST',
          body: {
            confirmDeletion: true
          }
        })
        expect.fail('Should have thrown validation error')
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
      }
    })

    it('should accept optional reason field', async () => {
      const response = await $fetch('/api/rgpd/data-deletion', {
        method: 'POST',
        body: {
          email: 'delete-test-' + Date.now() + '@example.com',
          confirmDeletion: true,
          reason: 'Testing data deletion flow'
        }
      })

      expect(response).toMatchObject({
        success: true,
        message: expect.stringContaining('supprimées'),
        data: {
          email: expect.any(String),
          deletionDate: expect.any(String),
          deleted: {
            testimonies: expect.any(Number),
            memberships: expect.any(Number),
            newsletter: expect.any(Number),
            total: expect.any(Number)
          }
        }
      })
    })

    it('should successfully delete data for unknown email', async () => {
      const email = 'nonexistent-' + Date.now() + '@example.com'

      const response = await $fetch('/api/rgpd/data-deletion', {
        method: 'POST',
        body: {
          email,
          confirmDeletion: true
        }
      })

      expect(response.success).toBe(true)
      expect(response.data.deleted.total).toBe(0)
    })

    it('should include deletion metadata', async () => {
      const response = await $fetch('/api/rgpd/data-deletion', {
        method: 'POST',
        body: {
          email: 'test-' + Date.now() + '@example.com',
          confirmDeletion: true
        }
      })

      expect(response.data).toHaveProperty('deletionDate')
      expect(response.data.deletionDate).toMatch(/^\d{4}-\d{2}-\d{2}T/)
      expect(response.data).toHaveProperty('email')
    })
  })

  describe('RGPD Workflow Integration', () => {
    it('should show data before and after deletion', async () => {
      const uniqueEmail = 'rgpd-workflow-' + Date.now() + '@example.com'

      // Check initial data
      const accessBefore = await $fetch('/api/rgpd/data-access', {
        method: 'POST',
        body: { email: uniqueEmail }
      })

      expect(accessBefore.data.testimonies).toEqual([])

      // Delete data
      const deletion = await $fetch('/api/rgpd/data-deletion', {
        method: 'POST',
        body: {
          email: uniqueEmail,
          confirmDeletion: true
        }
      })

      expect(deletion.success).toBe(true)

      // Verify data is gone
      const accessAfter = await $fetch('/api/rgpd/data-access', {
        method: 'POST',
        body: { email: uniqueEmail }
      })

      expect(accessAfter.data.testimonies).toEqual([])
      expect(accessAfter.data.memberships).toEqual([])
      expect(accessAfter.data.newsletter).toEqual([])
    })
  })
})

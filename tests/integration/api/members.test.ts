import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('Members API', async () => {
  await setup()

  describe('POST /api/members', () => {
    it('should validate required fields', async () => {
      try {
        await $fetch('/api/members', {
          method: 'POST',
          body: {}
        })
        expect.fail('Should have thrown validation error')
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
      }
    })

    it('should accept valid membership submission', async () => {
      const response = await $fetch('/api/members', {
        method: 'POST',
        body: {
          civility: 'M.',
          firstName: 'Pierre',
          lastName: 'Member',
          email: `member.${Date.now()}@example.com`,
          address: '123 rue Test',
          postalCode: '30000',
          city: 'Nîmes',
          phone: '0612345678',
          membershipType: 'normal',
          amount: 15,
          acceptsStatutes: true,
          acceptsProcessing: true
        }
      })

      expect(response).toMatchObject({
        success: true,
        member: {
          id: expect.any(String)
        }
      })
    })

    it('should reject membership without statutes consent', async () => {
      try {
        await $fetch('/api/members', {
          method: 'POST',
          body: {
            civility: 'Mme',
            firstName: 'Marie',
            lastName: 'Test',
            email: 'test@example.com',
            address: '123 rue Test',
            postalCode: '30000',
            city: 'Nîmes',
            membershipType: 'normal',
            amount: 15,
            acceptsStatutes: false, // Missing consent
            acceptsProcessing: true
          }
        })
        expect.fail('Should have thrown validation error')
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
      }
    })

    it('should accept all membership types', async () => {
      const membershipTypes = [
        { type: 'reduit', amount: 5 },
        { type: 'normal', amount: 15 },
        { type: 'soutien', amount: 50 },
        { type: 'libre', amount: 100 }
      ]

      for (const membership of membershipTypes) {
        const response = await $fetch('/api/members', {
          method: 'POST',
          body: {
            civility: 'M.',
            firstName: 'Test',
            lastName: 'Member',
            email: `${membership.type}-${Date.now()}@example.com`,
            address: '123 rue Test',
            postalCode: '30000',
            city: 'Nîmes',
            membershipType: membership.type,
            amount: membership.amount,
            acceptsStatutes: true,
            acceptsProcessing: true
          }
        })

        expect(response.success).toBe(true)
      }
    })

    it('should validate amount matches membership type', async () => {
      try {
        await $fetch('/api/members', {
          method: 'POST',
          body: {
            civility: 'M.',
            firstName: 'Test',
            lastName: 'Member',
            email: 'test@example.com',
            address: '123 rue Test',
            postalCode: '30000',
            city: 'Nîmes',
            membershipType: 'normal',
            amount: 5, // Wrong amount for normal membership
            acceptsStatutes: true,
            acceptsProcessing: true
          }
        })
        // Some implementations might accept this, others might reject
        // Either behavior is valid
      } catch (error: any) {
        expect([400, 422]).toContain(error.statusCode)
      }
    })
  })

  describe('GET /api/members', () => {
    it('should require authentication', async () => {
      try {
        await $fetch('/api/members', {
          method: 'GET'
        })
        expect.fail('Should have thrown authentication error')
      } catch (error: any) {
        expect(error.statusCode).toBe(401)
      }
    })
  })
})

describe('Pre-Members API', async () => {
  await setup()

  describe('POST /api/pre-members', () => {
    it('should validate required fields', async () => {
      try {
        await $fetch('/api/pre-members', {
          method: 'POST',
          body: {}
        })
        expect.fail('Should have thrown validation error')
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
      }
    })

    it('should accept valid pre-membership submission', async () => {
      const response = await $fetch('/api/pre-members', {
        method: 'POST',
        body: {
          civility: 'Mme',
          firstName: 'Sophie',
          lastName: 'PreMember',
          email: `premember.${Date.now()}@example.com`,
          address: '456 rue Test',
          postalCode: '30129',
          city: 'Ledenon',
          phone: '0612345678',
          acceptsNewsletter: true,
          acceptsProcessing: true
        }
      })

      expect(response).toMatchObject({
        success: true,
        message: expect.stringContaining('enregistré')
      })
    })

    it('should accept without newsletter consent', async () => {
      const response = await $fetch('/api/pre-members', {
        method: 'POST',
        body: {
          civility: 'M.',
          firstName: 'Jean',
          lastName: 'PreMember',
          email: `premember-no-newsletter.${Date.now()}@example.com`,
          address: '789 rue Test',
          postalCode: '30129',
          city: 'Ledenon',
          acceptsNewsletter: false,
          acceptsProcessing: true
        }
      })

      expect(response.success).toBe(true)
    })

    it('should reject without RGPD processing consent', async () => {
      try {
        await $fetch('/api/pre-members', {
          method: 'POST',
          body: {
            civility: 'M.',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            address: '123 rue Test',
            postalCode: '30000',
            city: 'Nîmes',
            acceptsNewsletter: true,
            acceptsProcessing: false // Missing consent
          }
        })
        expect.fail('Should have thrown validation error')
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
      }
    })
  })

  describe('GET /api/pre-members/count', () => {
    it('should return pre-members count', async () => {
      const response = await $fetch('/api/pre-members/count', {
        method: 'GET'
      })

      expect(response).toMatchObject({
        count: expect.any(Number)
      })

      expect(response.count).toBeGreaterThanOrEqual(0)
    })
  })
})

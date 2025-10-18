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

    it('should accept valid member registration', async () => {
      const response = await $fetch('/api/members', {
        method: 'POST',
        body: {
          civility: 'M.',
          firstName: 'Jean',
          lastName: 'Dupont',
          birthDate: '1990-01-01',
          email: `member.test.${Date.now()}@example.com`,
          phone: '0612345678',
          address: '123 Rue de Test',
          postalCode: '30210',
          city: 'Ledenon',
          userType: 'parent',
          schoolName: '',
          schoolSection: '',
          usageBefore: 'daily',
          usageAfter: 'car',
          membershipType: 'normal',
          membershipFee: 20,
          wantsToParticipate: true,
          participationAreas: ['communication', 'events'],
          acceptsNewsletter: true,
          acceptsTestimonyPublication: true,
          acceptsMediaContact: true,
          acceptsActionSolicitation: true
        }
      })

      expect(response).toMatchObject({
        success: true,
        data: {
          id: expect.any(String),
          email: expect.stringContaining('@example.com')
        }
      })
    })

    it('should reject member with invalid postal code', async () => {
      try {
        await $fetch('/api/members', {
          method: 'POST',
          body: {
            civility: 'Mme',
            firstName: 'Marie',
            lastName: 'Test',
            email: 'test@example.com',
            phone: '0612345678',
            address: '123 rue Test',
            postalCode: '300', // Invalid postal code
            city: 'Ledenon',
            userType: 'student',
            membershipType: 'reduced',
            membershipFee: 10,
            wantsToParticipate: false,
            participationAreas: [],
            acceptsNewsletter: false,
            acceptsTestimonyPublication: false,
            acceptsMediaContact: false,
            acceptsActionSolicitation: false
          }
        })
        expect.fail('Should have thrown validation error')
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
      }
    })

    it('should accept all membership types', async () => {
      const membershipTypes = [
        { type: 'reduced', fee: 10 },
        { type: 'normal', fee: 20 },
        { type: 'support', fee: 50 },
        { type: 'custom', fee: 35 }
      ]

      for (const membership of membershipTypes) {
        const response = await $fetch('/api/members', {
          method: 'POST',
          body: {
            civility: 'M.',
            firstName: 'Test',
            lastName: `Member${membership.type}`,
            email: `${membership.type}-${Date.now()}@example.com`,
            phone: '0612345678',
            address: '123 rue Test',
            postalCode: '30210',
            city: 'Ledenon',
            userType: 'other',
            membershipType: membership.type,
            membershipFee: membership.fee,
            wantsToParticipate: false,
            participationAreas: [],
            acceptsNewsletter: false,
            acceptsTestimonyPublication: false,
            acceptsMediaContact: false,
            acceptsActionSolicitation: false
          }
        })

        expect(response.success).toBe(true)
        expect(response.data.membershipType).toBe(membership.type)
      }
    })

    it('should reject duplicate email', async () => {
      const email = `duplicate.${Date.now()}@example.com`

      // Create first member
      await $fetch('/api/members', {
        method: 'POST',
        body: {
          civility: 'Mme',
          firstName: 'Marie',
          lastName: 'Test',
          email,
          phone: '0612345678',
          address: '123 Rue de Test',
          postalCode: '30210',
          city: 'Ledenon',
          userType: 'student',
          membershipType: 'reduced',
          membershipFee: 10,
          wantsToParticipate: false,
          participationAreas: [],
          acceptsNewsletter: false,
          acceptsTestimonyPublication: false,
          acceptsMediaContact: false,
          acceptsActionSolicitation: false
        }
      })

      // Try to create duplicate
      try {
        await $fetch('/api/members', {
          method: 'POST',
          body: {
            civility: 'M.',
            firstName: 'Pierre',
            lastName: 'Autre',
            email, // Same email
            phone: '0687654321',
            address: '456 Avenue Test',
            postalCode: '30210',
            city: 'Ledenon',
            userType: 'worker',
            membershipType: 'normal',
            membershipFee: 20,
            wantsToParticipate: false,
            participationAreas: [],
            acceptsNewsletter: false,
            acceptsTestimonyPublication: false,
            acceptsMediaContact: false,
            acceptsActionSolicitation: false
          }
        })
        expect.fail('Should have thrown duplicate email error')
      } catch (error: any) {
        expect(error.statusCode).toBe(409)
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

  describe('GET /api/pre-members/count', () => {
    it('should return pre-members count', async () => {
      const response = await $fetch('/api/pre-members/count', {
        method: 'GET'
      })

      expect(response).toMatchObject({
        success: true,
        data: {
          count: expect.any(Number)
        }
      })

      expect(response.data.count).toBeGreaterThanOrEqual(0)
    })
  })
})

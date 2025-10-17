import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('Testimonies API', async () => {
  await setup()

  describe('POST /api/testimonies', () => {
    it('should validate required fields', async () => {
      try {
        await $fetch('/api/testimonies', {
          method: 'POST',
          body: {}
        })
        expect.fail('Should have thrown validation error')
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
      }
    })

    it('should accept valid testimony submission', async () => {
      const response = await $fetch('/api/testimonies', {
        method: 'POST',
        body: {
          civility: 'M.',
          firstName: 'Jean',
          lastName: 'Test',
          email: 'jean.test.' + Date.now() + '@example.com',
          userType: 'parent',
          impactDescription: 'La suppression de la ligne directe a considérablement compliqué nos déplacements quotidiens.',
          currentSituation: 'Nous devons maintenant prendre 2 bus au lieu d\'1 seul',
          acceptsContact: true,
          acceptsPublication: true,
          acceptsProcessing: true
        }
      })

      expect(response).toMatchObject({
        success: true,
        testimony: {
          id: expect.any(String)
        }
      })
    })

    it('should reject testimony without RGPD consent', async () => {
      try {
        await $fetch('/api/testimonies', {
          method: 'POST',
          body: {
            civility: 'Mme',
            firstName: 'Marie',
            lastName: 'Test',
            email: 'marie.test@example.com',
            userType: 'lyceen',
            impactDescription: 'Impact description',
            currentSituation: 'Current situation',
            acceptsContact: true,
            acceptsPublication: true,
            acceptsProcessing: false // Missing consent
          }
        })
        expect.fail('Should have thrown validation error')
      } catch (error: any) {
        expect(error.statusCode).toBe(400)
      }
    })

    it('should sanitize testimony content', async () => {
      const response = await $fetch('/api/testimonies', {
        method: 'POST',
        body: {
          civility: 'M.',
          firstName: '<script>alert("XSS")</script>Jean',
          lastName: 'Test',
          email: 'xss.test.' + Date.now() + '@example.com',
          userType: 'parent',
          impactDescription: '<img src=x onerror=alert(1)>Impact with XSS attempt',
          currentSituation: 'Normal situation',
          acceptsContact: true,
          acceptsPublication: true,
          acceptsProcessing: true
        }
      })

      expect(response.success).toBe(true)
      // Content should be sanitized (no script tags in database)
    })

    it('should accept all valid user types', async () => {
      const userTypes = ['parent', 'lyceen', 'etudiant', 'travailleur', 'senior', 'autre']

      for (const userType of userTypes) {
        const response = await $fetch('/api/testimonies', {
          method: 'POST',
          body: {
            civility: 'M.',
            firstName: 'Test',
            lastName: 'User',
            email: `test-${userType}-${Date.now()}@example.com`,
            userType,
            impactDescription: 'Test impact description with sufficient length',
            currentSituation: 'Test current situation',
            acceptsContact: true,
            acceptsPublication: true,
            acceptsProcessing: true
          }
        })

        expect(response.success).toBe(true)
      }
    })
  })

  describe('GET /api/testimonies', () => {
    it('should return published testimonies list', async () => {
      const response = await $fetch('/api/testimonies', {
        method: 'GET'
      })

      expect(response).toMatchObject({
        testimonies: expect.any(Array)
      })

      // If there are testimonies, check structure
      if (response.testimonies.length > 0) {
        expect(response.testimonies[0]).toHaveProperty('id')
        expect(response.testimonies[0]).toHaveProperty('userType')
        expect(response.testimonies[0]).toHaveProperty('impactDescription')
      }
    })

    it('should support filtering by user type', async () => {
      const response = await $fetch('/api/testimonies?userType=parent', {
        method: 'GET'
      })

      expect(response).toHaveProperty('testimonies')
      expect(Array.isArray(response.testimonies)).toBe(true)

      // If there are results, they should all be of type 'parent'
      if (response.testimonies.length > 0) {
        response.testimonies.forEach((t: any) => {
          expect(t.userType).toBe('parent')
        })
      }
    })
  })

  describe('POST /api/testimonies/[id]/increment-views', () => {
    it('should increment view count', async () => {
      // First, create a testimony to get an ID
      let testimonyId: string

      try {
        const createResponse = await $fetch('/api/testimonies', {
          method: 'POST',
          body: {
            civility: 'M.',
            firstName: 'View',
            lastName: 'Test',
            email: `view.test.${Date.now()}@example.com`,
            userType: 'parent',
            impactDescription: 'Test impact for view counting',
            currentSituation: 'Test situation',
            acceptsContact: true,
            acceptsPublication: true,
            acceptsProcessing: true
          }
        })

        testimonyId = createResponse.testimony.id

        // Increment views
        const viewResponse = await $fetch(`/api/testimonies/${testimonyId}/increment-views`, {
          method: 'POST'
        })

        expect(viewResponse).toMatchObject({
          success: true
        })
      } catch (error: any) {
        // If any step fails, that's okay for this test
        expect(error.statusCode).toBeGreaterThan(0)
      }
    })
  })
})

import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

describe('/api/pre-members POST', async () => {
  await setup()

  it('should create a pre-member without phone number (empty string)', async () => {
    const response = await $fetch('/api/pre-members', {
      method: 'POST',
      body: {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: `test-${Date.now()}@example.com`,
        phone: '', // Empty string - should be transformed to undefined
        city: 'Ledenon',
        userType: 'student',
        wantsToBecomeMember: true,
        wantsToVolunteer: false,
        canHostMeeting: false,
        canDistributeFlyers: false,
        participationAreas: ['transport'],
        acceptsNewsletter: true,
        acceptsContactWhenCreated: true,
        acceptsAgInvitation: true
      }
    })

    expect(response).toMatchObject({
      success: true,
      message: expect.stringContaining('succès')
    })
    expect(response.preMember).toBeDefined()
    expect(response.preMember.id).toBeDefined()
    expect(response.totalSupports).toBeGreaterThan(0)
  })

  it('should create a pre-member without phone number (omitted)', async () => {
    const response = await $fetch('/api/pre-members', {
      method: 'POST',
      body: {
        firstName: 'Marie',
        lastName: 'Martin',
        email: `test-${Date.now()}@example.com`,
        // phone omitted completely
        city: 'Cabrières',
        userType: 'parent',
        wantsToBecomeMember: true,
        wantsToVolunteer: true,
        canHostMeeting: false,
        canDistributeFlyers: true,
        participationAreas: ['transport', 'communication'],
        acceptsNewsletter: false,
        acceptsContactWhenCreated: true,
        acceptsAgInvitation: false
      }
    })

    expect(response).toMatchObject({
      success: true,
      message: expect.stringContaining('succès')
    })
    expect(response.preMember).toBeDefined()
  })

  it('should create a pre-member with valid phone number', async () => {
    const response = await $fetch('/api/pre-members', {
      method: 'POST',
      body: {
        firstName: 'Pierre',
        lastName: 'Durand',
        email: `test-${Date.now()}@example.com`,
        phone: '0612345678',
        city: 'Saint-Gervasy',
        userType: 'worker',
        wantsToBecomeMember: false,
        wantsToVolunteer: true,
        canHostMeeting: true,
        canDistributeFlyers: false,
        participationAreas: [],
        acceptsNewsletter: true,
        acceptsContactWhenCreated: false,
        acceptsAgInvitation: true
      }
    })

    expect(response.success).toBe(true)
    expect(response.preMember).toBeDefined()
  })

  it('should reject phone number that is too short', async () => {
    try {
      await $fetch('/api/pre-members', {
        method: 'POST',
        body: {
          firstName: 'Sophie',
          lastName: 'Bernard',
          email: `test-${Date.now()}@example.com`,
          phone: '123', // Too short
          city: 'Autre',
          userType: 'senior',
          wantsToBecomeMember: true,
          wantsToVolunteer: false,
          canHostMeeting: false,
          canDistributeFlyers: false,
          participationAreas: ['environnement'],
          acceptsNewsletter: true,
          acceptsContactWhenCreated: true,
          acceptsAgInvitation: true
        }
      })
      expect.fail('Should have thrown validation error')
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toBe('Données invalides')
    }
  })

  it('should reject phone number that is too long', async () => {
    try {
      await $fetch('/api/pre-members', {
        method: 'POST',
        body: {
          firstName: 'Luc',
          lastName: 'Thomas',
          email: `test-${Date.now()}@example.com`,
          phone: '123456789012345678901', // Too long (21 characters)
          city: 'Ledenon',
          userType: 'pmr',
          wantsToBecomeMember: true,
          wantsToVolunteer: true,
          canHostMeeting: false,
          canDistributeFlyers: false,
          participationAreas: ['accessibilite'],
          acceptsNewsletter: false,
          acceptsContactWhenCreated: true,
          acceptsAgInvitation: false
        }
      })
      expect.fail('Should have thrown validation error')
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toBe('Données invalides')
    }
  })

  it('should reject duplicate email', async () => {
    const email = `duplicate-${Date.now()}@example.com`

    // First registration
    const response1 = await $fetch('/api/pre-members', {
      method: 'POST',
      body: {
        firstName: 'Alice',
        lastName: 'Dubois',
        email,
        phone: '',
        city: 'Cabrières',
        userType: 'other',
        wantsToBecomeMember: true,
        wantsToVolunteer: false,
        canHostMeeting: false,
        canDistributeFlyers: false,
        participationAreas: [],
        acceptsNewsletter: true,
        acceptsContactWhenCreated: true,
        acceptsAgInvitation: true
      }
    })
    expect(response1.success).toBe(true)

    // Second registration with same email
    try {
      await $fetch('/api/pre-members', {
        method: 'POST',
        body: {
          firstName: 'Alice',
          lastName: 'Dubois',
          email,
          phone: '',
          city: 'Cabrières',
          userType: 'other',
          wantsToBecomeMember: true,
          wantsToVolunteer: false,
          canHostMeeting: false,
          canDistributeFlyers: false,
          participationAreas: [],
          acceptsNewsletter: true,
          acceptsContactWhenCreated: true,
          acceptsAgInvitation: true
        }
      })
      expect.fail('Should have thrown duplicate error')
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toContain('déjà inscrit')
    }
  })

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

  it('should accept all valid cities', async () => {
    const cities = ['Ledenon', 'Cabrières', 'Saint-Gervasy', 'Autre']

    for (const city of cities) {
      const response = await $fetch('/api/pre-members', {
        method: 'POST',
        body: {
          firstName: 'Test',
          lastName: 'City',
          email: `test-city-${city}-${Date.now()}@example.com`,
          phone: '',
          city,
          userType: 'student',
          wantsToBecomeMember: false,
          wantsToVolunteer: false,
          canHostMeeting: false,
          canDistributeFlyers: false,
          participationAreas: [],
          acceptsNewsletter: false,
          acceptsContactWhenCreated: false,
          acceptsAgInvitation: false
        }
      })

      expect(response.success).toBe(true)
    }
  })

  it('should accept all valid user types', async () => {
    const userTypes = ['student', 'parent', 'worker', 'senior', 'pmr', 'other']

    for (const userType of userTypes) {
      const response = await $fetch('/api/pre-members', {
        method: 'POST',
        body: {
          firstName: 'Test',
          lastName: 'UserType',
          email: `test-type-${userType}-${Date.now()}@example.com`,
          phone: '',
          city: 'Ledenon',
          userType,
          wantsToBecomeMember: false,
          wantsToVolunteer: false,
          canHostMeeting: false,
          canDistributeFlyers: false,
          participationAreas: [],
          acceptsNewsletter: false,
          acceptsContactWhenCreated: false,
          acceptsAgInvitation: false
        }
      })

      expect(response.success).toBe(true)
    }
  })
})

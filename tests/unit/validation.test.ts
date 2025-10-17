import { describe, it, expect } from 'vitest'
import {
  contactSchema,
  incidentSchema,
  newsletterSchema,
  donationSchema
} from '~/server/validation/schemas'

describe('validation schemas', () => {
  describe('contactSchema', () => {
    const validContact = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0612345678',
      subject: 'Question about bus line 21',
      message: 'I would like to know more about the bus schedule',
      acceptsContact: true
    }

    it('should validate correct contact data', () => {
      const result = contactSchema.safeParse(validContact)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = contactSchema.safeParse({
        ...validContact,
        email: 'invalid-email'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Email invalide')
      }
    })

    it('should reject short name', () => {
      const result = contactSchema.safeParse({
        ...validContact,
        name: 'J'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('au moins 2 caractères')
      }
    })

    it('should reject short subject', () => {
      const result = contactSchema.safeParse({
        ...validContact,
        subject: 'Hi'
      })
      expect(result.success).toBe(false)
    })

    it('should reject short message', () => {
      const result = contactSchema.safeParse({
        ...validContact,
        message: 'Too short'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('au moins 20 caractères')
      }
    })

    it('should require acceptsContact to be boolean', () => {
      const result = contactSchema.safeParse({
        ...validContact,
        acceptsContact: 'yes'
      })
      expect(result.success).toBe(false)
    })

    it('should allow optional phone', () => {
      const { phone, ...contactWithoutPhone } = validContact
      const result = contactSchema.safeParse(contactWithoutPhone)
      expect(result.success).toBe(true)
    })
  })

  describe('incidentSchema', () => {
    const validIncident = {
      incident_date: '2025-10-17',
      incident_time: '08:30',
      incident_type: 'missed_correspondence',
      bus_line: '21',
      description: 'The bus was 15 minutes late, causing me to miss my train connection',
      consequence: 'late_work',
      consequence_details: 'Arrived 30 minutes late to work',
      taxi_cost: 25.50,
      email: 'user@example.com'
    }

    it('should validate correct incident data', () => {
      const result = incidentSchema.safeParse(validIncident)
      expect(result.success).toBe(true)
    })

    it('should reject invalid date format', () => {
      const result = incidentSchema.safeParse({
        ...validIncident,
        incident_date: '17/10/2025'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Date invalide')
      }
    })

    it('should reject invalid time format', () => {
      const result = incidentSchema.safeParse({
        ...validIncident,
        incident_time: '8:30'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Heure invalide')
      }
    })

    it('should accept valid time format', () => {
      const result = incidentSchema.safeParse({
        ...validIncident,
        incident_time: '08:30'
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid incident type', () => {
      const result = incidentSchema.safeParse({
        ...validIncident,
        incident_type: 'invalid_type'
      })
      expect(result.success).toBe(false)
    })

    it('should accept valid incident types', () => {
      const types = [
        'missed_correspondence',
        'delay',
        'no_bus',
        'accessibility',
        'extra_cost',
        'other'
      ]

      types.forEach(type => {
        const result = incidentSchema.safeParse({
          ...validIncident,
          incident_type: type
        })
        expect(result.success).toBe(true)
      })
    })

    it('should reject short description', () => {
      const result = incidentSchema.safeParse({
        ...validIncident,
        description: 'Too short'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('au moins 20 caractères')
      }
    })

    it('should reject negative taxi cost', () => {
      const result = incidentSchema.safeParse({
        ...validIncident,
        taxi_cost: -10
      })
      expect(result.success).toBe(false)
    })

    it('should allow optional fields', () => {
      const minimalIncident = {
        incident_date: '2025-10-17',
        incident_type: 'delay',
        description: 'The bus was very late today and I had to wait 30 minutes'
      }
      const result = incidentSchema.safeParse(minimalIncident)
      expect(result.success).toBe(true)
    })
  })

  describe('newsletterSchema', () => {
    it('should validate correct newsletter data', () => {
      const result = newsletterSchema.safeParse({
        email: 'user@example.com',
        first_name: 'John',
        last_name: 'Doe',
        source: 'footer'
      })
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = newsletterSchema.safeParse({
        email: 'invalid-email'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Email invalide')
      }
    })

    it('should allow minimal data (email only)', () => {
      const result = newsletterSchema.safeParse({
        email: 'user@example.com'
      })
      expect(result.success).toBe(true)
    })

    it('should default source to footer', () => {
      const result = newsletterSchema.safeParse({
        email: 'user@example.com'
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.source).toBe('footer')
      }
    })

    it('should accept different sources', () => {
      const result = newsletterSchema.safeParse({
        email: 'user@example.com',
        source: 'homepage'
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.source).toBe('homepage')
      }
    })
  })

  describe('donationSchema', () => {
    const validDonation = {
      email: 'donor@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      amount: 50,
      type: 'one_time',
      accepts_newsletter: true,
      message: 'Supporting your cause'
    }

    it('should validate correct donation data', () => {
      const result = donationSchema.safeParse(validDonation)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = donationSchema.safeParse({
        ...validDonation,
        email: 'invalid'
      })
      expect(result.success).toBe(false)
    })

    it('should reject negative amount', () => {
      const result = donationSchema.safeParse({
        ...validDonation,
        amount: -10
      })
      expect(result.success).toBe(false)
    })

    it('should reject zero amount', () => {
      const result = donationSchema.safeParse({
        ...validDonation,
        amount: 0
      })
      expect(result.success).toBe(false)
    })

    it('should require minimum amount of 1€', () => {
      const result = donationSchema.safeParse({
        ...validDonation,
        amount: 0.5
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('minimum est de 1€')
      }
    })

    it('should accept valid donation types', () => {
      const oneTimeResult = donationSchema.safeParse({
        ...validDonation,
        type: 'one_time'
      })
      expect(oneTimeResult.success).toBe(true)

      const monthlyResult = donationSchema.safeParse({
        ...validDonation,
        type: 'monthly'
      })
      expect(monthlyResult.success).toBe(true)
    })

    it('should reject invalid donation type', () => {
      const result = donationSchema.safeParse({
        ...validDonation,
        type: 'yearly'
      })
      expect(result.success).toBe(false)
    })

    it('should allow minimal data', () => {
      const result = donationSchema.safeParse({
        email: 'donor@example.com',
        amount: 25,
        type: 'one_time',
        accepts_newsletter: false
      })
      expect(result.success).toBe(true)
    })
  })

  describe('Email validation across schemas', () => {
    const invalidEmails = [
      'invalid',
      'invalid@',
      '@invalid.com',
      'invalid@domain',
      'invalid domain@email.com',
      'invalid@.com'
    ]

    const validEmails = [
      'user@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
      'user123@test-domain.com'
    ]

    it('should reject invalid emails in all schemas', () => {
      invalidEmails.forEach(email => {
        expect(contactSchema.safeParse({ ...{
          name: 'Test',
          email,
          subject: 'Test subject',
          message: 'Test message that is long enough',
          acceptsContact: true
        } }).success).toBe(false)

        expect(newsletterSchema.safeParse({ email }).success).toBe(false)

        expect(donationSchema.safeParse({
          email,
          amount: 10,
          type: 'one_time',
          accepts_newsletter: true
        }).success).toBe(false)
      })
    })

    it('should accept valid emails in all schemas', () => {
      validEmails.forEach(email => {
        expect(contactSchema.safeParse({
          name: 'Test',
          email,
          subject: 'Test subject',
          message: 'Test message that is long enough',
          acceptsContact: true
        }).success).toBe(true)

        expect(newsletterSchema.safeParse({ email }).success).toBe(true)

        expect(donationSchema.safeParse({
          email,
          amount: 10,
          type: 'one_time',
          accepts_newsletter: true
        }).success).toBe(true)
      })
    })
  })
})

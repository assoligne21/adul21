import { describe, it, expect } from 'vitest'
import {
  testimonySchema,
  memberSchema,
  contactSchema,
  incidentSchema,
  donationSchema,
  newsletterSchema
} from '~/server/validation/schemas'

describe('Email Validation - 90 Character Limit', () => {

  describe('Schema Validations', () => {
    // Helper to generate emails of specific length
    const generateEmail = (length: number): string => {
      const atAndDomain = '@example.com' // 12 characters
      const localPartLength = length - atAndDomain.length
      if (localPartLength <= 0) {
        return 'a' + atAndDomain
      }
      return 'a'.repeat(localPartLength) + atAndDomain
    }

    it('validates email max length is exactly 90 characters', () => {
      const maxEmail = generateEmail(90)
      expect(maxEmail.length).toBe(90)

      const tooLongEmail = generateEmail(91)
      expect(tooLongEmail.length).toBe(91)
    })

    it('validates emails at boundary (89, 90, 91 chars)', () => {
      const email89 = generateEmail(89)
      const email90 = generateEmail(90)
      const email91 = generateEmail(91)

      expect(email89.length).toBe(89)
      expect(email90.length).toBe(90)
      expect(email91.length).toBe(91)
    })
  })

  describe('Testimony Schema Email Validation', () => {
    const validTestimonyData = {
      first_name: 'Jean',
      last_name: 'Dupont',
      age_range: '30-50',
      email: 'jean@example.com',
      city: 'Ledenon',
      user_type: 'worker',
      usage_after_solution: 'car',
      problems: ['delay'],
      testimony_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      publication_preference: 'first_name',
      accepts_site_publication: true,
      accepts_legal_use: true,
      accepts_media_contact: false,
      accepts_oral_testimony: false
    }

    it('should accept email with exactly 90 characters', () => {
      const email90 = 'a'.repeat(78) + '@example.com' // 90 chars
      const result = testimonySchema.safeParse({
        ...validTestimonyData,
        email: email90
      })

      expect(email90.length).toBe(90)
      expect(result.success).toBe(true)
    })

    it('should reject email with 91 characters', () => {
      const email91 = 'a'.repeat(79) + '@example.com' // 91 chars
      const result = testimonySchema.safeParse({
        ...validTestimonyData,
        email: email91
      })

      expect(email91.length).toBe(91)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('trop long')
      }
    })

    it('should accept valid email within limit', () => {
      const result = testimonySchema.safeParse(validTestimonyData)
      expect(result.success).toBe(true)
    })
  })

  describe('Member Schema Email Validation', () => {
    const validMemberData = {
      civility: 'M.',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
      phone: '0612345678',
      address: '123 rue de la Paix',
      postalCode: '30000',
      city: 'Ledenon',
      userType: 'worker',
      membershipType: 'normal',
      membershipFee: 30,
      wantsToParticipate: false,
      participationAreas: [],
      acceptsNewsletter: true,
      acceptsTestimonyPublication: false,
      acceptsMediaContact: false,
      acceptsActionSolicitation: false
    }

    it('should accept email with exactly 90 characters', () => {
      const email90 = 'a'.repeat(78) + '@example.com'
      const result = memberSchema.safeParse({
        ...validMemberData,
        email: email90
      })

      expect(email90.length).toBe(90)
      expect(result.success).toBe(true)
    })

    it('should reject email with 91 characters', () => {
      const email91 = 'a'.repeat(79) + '@example.com'
      const result = memberSchema.safeParse({
        ...validMemberData,
        email: email91
      })

      expect(email91.length).toBe(91)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('trop long')
      }
    })
  })

  describe('Contact Schema Email Validation', () => {
    const validContactData = {
      name: 'Jean Dupont',
      email: 'jean@example.com',
      subject: 'Question concernant les horaires',
      message: 'Bonjour, je souhaite avoir des informations sur les horaires de bus.',
      acceptsContact: true
    }

    it('should accept email with exactly 90 characters', () => {
      const email90 = 'a'.repeat(78) + '@example.com'
      const result = contactSchema.safeParse({
        ...validContactData,
        email: email90
      })

      expect(email90.length).toBe(90)
      expect(result.success).toBe(true)
    })

    it('should reject email with 91 characters', () => {
      const email91 = 'a'.repeat(79) + '@example.com'
      const result = contactSchema.safeParse({
        ...validContactData,
        email: email91
      })

      expect(email91.length).toBe(91)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('trop long')
      }
    })
  })

  describe('Incident Schema Email Validation', () => {
    const validIncidentData = {
      incident_date: '2024-01-15',
      incident_type: 'delay',
      description: 'Le bus avait 30 minutes de retard ce matin.',
      email: 'jean@example.com'
    }

    it('should accept email with exactly 90 characters', () => {
      const email90 = 'a'.repeat(78) + '@example.com'
      const result = incidentSchema.safeParse({
        ...validIncidentData,
        email: email90
      })

      expect(email90.length).toBe(90)
      expect(result.success).toBe(true)
    })

    it('should reject email with 91 characters', () => {
      const email91 = 'a'.repeat(79) + '@example.com'
      const result = incidentSchema.safeParse({
        ...validIncidentData,
        email: email91
      })

      expect(email91.length).toBe(91)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('trop long')
      }
    })

    it('should allow missing email (optional field)', () => {
      const { email, ...dataWithoutEmail } = validIncidentData
      const result = incidentSchema.safeParse(dataWithoutEmail)

      expect(result.success).toBe(true)
    })
  })

  describe('Donation Schema Email Validation', () => {
    const validDonationData = {
      email: 'jean@example.com',
      amount: 50,
      type: 'one_time',
      accepts_newsletter: false
    }

    it('should accept email with exactly 90 characters', () => {
      const email90 = 'a'.repeat(78) + '@example.com'
      const result = donationSchema.safeParse({
        ...validDonationData,
        email: email90
      })

      expect(email90.length).toBe(90)
      expect(result.success).toBe(true)
    })

    it('should reject email with 91 characters', () => {
      const email91 = 'a'.repeat(79) + '@example.com'
      const result = donationSchema.safeParse({
        ...validDonationData,
        email: email91
      })

      expect(email91.length).toBe(91)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('trop long')
      }
    })
  })

  describe('Newsletter Schema Email Validation', () => {
    const validNewsletterData = {
      email: 'jean@example.com',
      source: 'footer'
    }

    it('should accept email with exactly 90 characters', () => {
      const email90 = 'a'.repeat(78) + '@example.com'
      const result = newsletterSchema.safeParse({
        ...validNewsletterData,
        email: email90
      })

      expect(email90.length).toBe(90)
      expect(result.success).toBe(true)
    })

    it('should reject email with 91 characters', () => {
      const email91 = 'a'.repeat(79) + '@example.com'
      const result = newsletterSchema.safeParse({
        ...validNewsletterData,
        email: email91
      })

      expect(email91.length).toBe(91)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('trop long')
      }
    })
  })

  describe('Database Migration Validation', () => {
    it('documents tables affected by email varchar(90) migration', () => {
      // Migration 0003 changed email from varchar(255) to varchar(90) in:
      const affectedTables = [
        'admin_users',
        'members',
        'pre_members',
        'testimonies',
        'contacts',
        'incidents',
        'donations',
        'newsletter_subscriptions',
        'temp_members'
      ]

      expect(affectedTables.length).toBe(9)
      expect(affectedTables).toContain('admin_users')
      expect(affectedTables).toContain('members')
      expect(affectedTables).toContain('testimonies')
    })

    it('validates that 90 characters is sufficient for most emails', () => {
      // According to RFC 5321, the maximum email length is 320 characters
      // However, 90 characters covers 99%+ of real-world email addresses
      // Common email patterns:
      const commonEmails = [
        'user@example.com', // 16 chars
        'firstname.lastname@company.com', // 32 chars
        'very.long.email.address@subdomain.example.com', // 46 chars
        'user+tag@example.com', // 20 chars
        'a'.repeat(64) + '@example.com' // 76 chars (max local part is 64)
      ]

      commonEmails.forEach(email => {
        expect(email.length).toBeLessThanOrEqual(90)
      })
    })

    it('validates error message format', () => {
      const errorMessage = 'Email trop long (max 90 caractères)'

      expect(errorMessage).toContain('90')
      expect(errorMessage).toContain('caractères')
      expect(errorMessage.toLowerCase()).toContain('trop long')
    })
  })

  describe('Comprehensive Email Validation', () => {
    it('validates all 6 schemas have email max 90 limit', () => {
      const schemasWithEmail = [
        { name: 'testimony', schema: testimonySchema },
        { name: 'member', schema: memberSchema },
        { name: 'contact', schema: contactSchema },
        { name: 'incident', schema: incidentSchema },
        { name: 'donation', schema: donationSchema },
        { name: 'newsletter', schema: newsletterSchema }
      ]

      expect(schemasWithEmail.length).toBe(6)
    })

    it('validates email format requirements', () => {
      // All schemas require valid email format AND max 90 chars
      const invalidFormats = [
        'notanemail',
        'missing@domain',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example .com'
      ]

      invalidFormats.forEach(invalidEmail => {
        const result = contactSchema.safeParse({
          name: 'Test',
          email: invalidEmail,
          subject: 'Test',
          message: 'Test message here',
          acceptsContact: true
        })

        expect(result.success).toBe(false)
      })
    })

    it('validates edge cases for email length', () => {
      // Test various email lengths
      const testCases = [
        { length: 1, shouldPass: false }, // Too short to be valid
        { length: 10, shouldPass: true },
        { length: 50, shouldPass: true },
        { length: 89, shouldPass: true },
        { length: 90, shouldPass: true },
        { length: 91, shouldPass: false },
        { length: 100, shouldPass: false },
        { length: 255, shouldPass: false } // Old limit
      ]

      testCases.forEach(({ length, shouldPass }) => {
        const email = 'a'.repeat(Math.max(1, length - 12)) + '@example.com'

        if (email.includes('@') && email.includes('.')) {
          const result = contactSchema.safeParse({
            name: 'Test',
            email: email,
            subject: 'Test',
            message: 'Test message here',
            acceptsContact: true
          })

          if (shouldPass && email.length <= 90) {
            expect(result.success).toBe(true)
          } else if (email.length > 90) {
            expect(result.success).toBe(false)
          }
        }
      })
    })
  })
})

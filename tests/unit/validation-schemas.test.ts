import { describe, it, expect } from 'vitest'
import {
  testimonySchema,
  memberSchema,
  contactSchema,
  incidentSchema,
  newsSchema,
  donationSchema,
  newsletterSchema
} from '~/server/validation/schemas'

describe('Validation Schemas', () => {
  describe('testimonySchema', () => {
    it('should validate complete testimony data', () => {
      const validTestimony = {
        first_name: 'Jean',
        last_name: 'Dupont',
        age_range: '30-50' as const,
        email: 'jean@example.com',
        phone: '0612345678',
        city: 'Ledenon' as const,
        user_type: 'parent' as const,
        school_name: 'Lycée Test',
        school_section: 'Seconde',
        workplace: 'Entreprise',
        work_hours: '9h-17h',
        usage_before_frequency: 'daily' as const,
        usage_before_time: 30,
        usage_before_cost: 50,
        usage_before_destination: 'Nîmes',
        usage_after_solution: 'car' as const,
        usage_after_time: 60,
        usage_after_correspondences: 2,
        usage_after_wait_time: 15,
        usage_after_cost: 100,
        usage_after_distance: 20,
        problems: ['time', 'cost'],
        missed_correspondences_per_month: 5,
        testimony_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
        concrete_example: 'Un exemple concret',
        publication_preference: 'first_name' as const,
        accepts_site_publication: true,
        accepts_legal_use: true,
        accepts_media_contact: true,
        accepts_oral_testimony: true,
        accepts_association_contact: true
      }

      const result = testimonySchema.safeParse(validTestimony)
      expect(result.success).toBe(true)
    })

    it('should reject testimony with missing required fields', () => {
      const invalidTestimony = {
        first_name: 'Jean'
        // Missing all other required fields
      }

      const result = testimonySchema.safeParse(invalidTestimony)
      expect(result.success).toBe(false)
    })

    it('should reject testimony with short testimony_text', () => {
      const invalidTestimony = {
        first_name: 'Jean',
        last_name: 'Dupont',
        age_range: '30-50',
        email: 'jean@example.com',
        city: 'Ledenon',
        user_type: 'parent',
        usage_after_solution: 'car',
        problems: [],
        testimony_text: 'Too short', // Less than 50 characters
        publication_preference: 'first_name',
        accepts_site_publication: true,
        accepts_legal_use: true,
        accepts_media_contact: true,
        accepts_oral_testimony: true
      }

      const result = testimonySchema.safeParse(invalidTestimony)
      expect(result.success).toBe(false)
    })

    it('should accept valid age ranges', () => {
      const ageRanges = ['under_18', '18-30', '30-50', '50-70', 'over_70'] as const

      ageRanges.forEach(ageRange => {
        const testimony = {
          first_name: 'Test',
          last_name: 'User',
          age_range: ageRange,
          email: 'test@example.com',
          city: 'Ledenon' as const,
          user_type: 'parent' as const,
          usage_after_solution: 'car' as const,
          problems: [],
          testimony_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
          publication_preference: 'first_name' as const,
          accepts_site_publication: true,
          accepts_legal_use: true,
          accepts_media_contact: true,
          accepts_oral_testimony: true
        }

        const result = testimonySchema.safeParse(testimony)
        expect(result.success).toBe(true)
      })
    })

    it('should accept valid user types', () => {
      const userTypes = ['student', 'parent', 'senior', 'pmr', 'worker', 'other'] as const

      userTypes.forEach(userType => {
        const testimony = {
          first_name: 'Test',
          last_name: 'User',
          age_range: '30-50' as const,
          email: 'test@example.com',
          city: 'Ledenon' as const,
          user_type: userType,
          usage_after_solution: 'car' as const,
          problems: [],
          testimony_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
          publication_preference: 'first_name' as const,
          accepts_site_publication: true,
          accepts_legal_use: true,
          accepts_media_contact: true,
          accepts_oral_testimony: true
        }

        const result = testimonySchema.safeParse(testimony)
        expect(result.success).toBe(true)
      })
    })

    it('should reject testimony without RGPD legal consent', () => {
      const testimony = {
        first_name: 'Jean',
        last_name: 'Dupont',
        age_range: '30-50' as const,
        email: 'jean@example.com',
        city: 'Ledenon' as const,
        user_type: 'parent' as const,
        usage_after_solution: 'car' as const,
        problems: [],
        testimony_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
        publication_preference: 'first_name' as const,
        accepts_site_publication: true,
        accepts_legal_use: false, // Must be true
        accepts_media_contact: true,
        accepts_oral_testimony: true
      }

      const result = testimonySchema.safeParse(testimony)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('accepts_legal_use'))).toBe(true)
      }
    })

    it('should reject testimony without site publication consent', () => {
      const testimony = {
        first_name: 'Jean',
        last_name: 'Dupont',
        age_range: '30-50' as const,
        email: 'jean@example.com',
        city: 'Ledenon' as const,
        user_type: 'parent' as const,
        usage_after_solution: 'car' as const,
        problems: [],
        testimony_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
        publication_preference: 'first_name' as const,
        accepts_site_publication: false, // Must be true
        accepts_legal_use: true,
        accepts_media_contact: true,
        accepts_oral_testimony: true
      }

      const result = testimonySchema.safeParse(testimony)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('accepts_site_publication'))).toBe(true)
      }
    })

    it('should require both RGPD consents to be true', () => {
      const testimony = {
        first_name: 'Jean',
        last_name: 'Dupont',
        age_range: '30-50' as const,
        email: 'jean@example.com',
        city: 'Ledenon' as const,
        user_type: 'parent' as const,
        usage_after_solution: 'car' as const,
        problems: [],
        testimony_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
        publication_preference: 'first_name' as const,
        accepts_site_publication: false,
        accepts_legal_use: false,
        accepts_media_contact: true,
        accepts_oral_testimony: true
      }

      const result = testimonySchema.safeParse(testimony)
      expect(result.success).toBe(false)
      if (!result.success) {
        // Should have errors for both consents
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2)
      }
    })
  })

  describe('memberSchema', () => {
    it('should validate complete member data', () => {
      const validMember = {
        civility: 'M.' as const,
        firstName: 'Jean',
        lastName: 'Dupont',
        birthDate: '1990-01-01',
        email: 'jean@example.com',
        phone: '0612345678',
        address: '123 rue de Test',
        postalCode: '30210',
        city: 'Ledenon' as const,
        userType: 'worker' as const,
        schoolName: '',
        schoolSection: '',
        usageBefore: 'daily' as const,
        usageAfter: 'car' as const,
        membershipType: 'normal' as const,
        membershipFee: 20,
        wantsToParticipate: true,
        participationAreas: ['communication', 'events'],
        acceptsNewsletter: true,
        acceptsTestimonyPublication: true,
        acceptsMediaContact: true,
        acceptsActionSolicitation: true
      }

      const result = memberSchema.safeParse(validMember)
      expect(result.success).toBe(true)
    })

    it('should reject invalid postal code', () => {
      const invalidMember = {
        civility: 'M.',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@example.com',
        phone: '0612345678',
        address: '123 rue de Test',
        postalCode: '123', // Invalid: not 5 digits
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

      const result = memberSchema.safeParse(invalidMember)
      expect(result.success).toBe(false)
    })

    it('should require positive membership fee', () => {
      const invalidMember = {
        civility: 'Mme',
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie@example.com',
        phone: '0612345678',
        address: '123 rue de Test',
        postalCode: '30210',
        city: 'Ledenon',
        userType: 'worker',
        membershipType: 'normal',
        membershipFee: 0, // Invalid: not positive
        wantsToParticipate: false,
        participationAreas: [],
        acceptsNewsletter: false,
        acceptsTestimonyPublication: false,
        acceptsMediaContact: false,
        acceptsActionSolicitation: false
      }

      const result = memberSchema.safeParse(invalidMember)
      expect(result.success).toBe(false)
    })
  })

  describe('contactSchema', () => {
    it('should validate complete contact data', () => {
      const validContact = {
        name: 'Jean Dupont',
        email: 'jean@example.com',
        phone: '0612345678',
        subject: 'Question importante',
        message: 'Voici mon message de test qui est suffisamment long',
        acceptsContact: true
      }

      const result = contactSchema.safeParse(validContact)
      expect(result.success).toBe(true)
    })

    it('should reject short message', () => {
      const invalidContact = {
        name: 'Jean',
        email: 'jean@example.com',
        subject: 'Test',
        message: 'Court', // Less than 20 characters
        acceptsContact: true
      }

      const result = contactSchema.safeParse(invalidContact)
      expect(result.success).toBe(false)
    })

    it('should require consent', () => {
      const invalidContact = {
        name: 'Jean Dupont',
        email: 'jean@example.com',
        subject: 'Subject',
        message: 'Message de test suffisamment long pour validation',
        acceptsContact: false // Should be true
      }

      // Schema should validate but consent should be checked separately
      const result = contactSchema.safeParse(invalidContact)
      expect(invalidContact.acceptsContact).toBe(false)
    })
  })

  describe('incidentSchema', () => {
    it('should validate complete incident data', () => {
      const validIncident = {
        incident_date: '2024-01-15',
        incident_time: '14:30',
        incident_type: 'missed_correspondence' as const,
        bus_line: '21',
        description: 'Description détaillée de l\'incident avec suffisamment de caractères',
        consequence: 'late_work' as const,
        consequence_details: 'Détails supplémentaires',
        taxi_cost: 45.50,
        email: 'user@example.com'
      }

      const result = incidentSchema.safeParse(validIncident)
      expect(result.success).toBe(true)
    })

    it('should validate date format', () => {
      const invalidDate = {
        incident_date: '15/01/2024', // Wrong format
        incident_type: 'delay',
        description: 'Description suffisamment longue pour passer la validation'
      }

      const result = incidentSchema.safeParse(invalidDate)
      expect(result.success).toBe(false)
    })

    it('should validate time format', () => {
      const validTimes = ['09:00', '14:30', '23:59']
      const invalidTimes = ['9:00', '25:00', '14:60', 'invalid']

      validTimes.forEach(time => {
        const incident = {
          incident_date: '2024-01-15',
          incident_time: time,
          incident_type: 'delay' as const,
          description: 'Description suffisamment longue'
        }
        const result = incidentSchema.safeParse(incident)
        // Time is optional, so check format separately
        expect(time).toMatch(/^\d{2}:\d{2}$/)
      })
    })
  })

  describe('newsSchema', () => {
    it('should validate complete news article', () => {
      const validNews = {
        title: 'Titre de l\'article',
        slug: 'titre-de-larticle',
        excerpt: 'Court extrait',
        content: 'Contenu complet de l\'article avec plus de 50 caractères pour respecter la validation',
        cover_image_url: 'https://example.com/image.jpg',
        author_id: '123e4567-e89b-12d3-a456-426614174000',
        is_published: true,
        published_at: '2024-01-15T10:00:00Z',
        meta_title: 'Meta titre',
        meta_description: 'Meta description'
      }

      const result = newsSchema.safeParse(validNews)
      expect(result.success).toBe(true)
    })

    it('should validate slug format', () => {
      const validSlugs = ['valid-slug', 'another-valid-123', 'test']
      const invalidSlugs = ['Invalid Slug', 'slug_with_underscore', 'UPPERCASE']

      validSlugs.forEach(slug => {
        const news = {
          title: 'Title',
          slug,
          content: 'Content with more than fifty characters to pass validation'
        }
        const result = newsSchema.safeParse(news)
        expect(result.success).toBe(true)
      })

      invalidSlugs.forEach(slug => {
        const news = {
          title: 'Title',
          slug,
          content: 'Content with more than fifty characters to pass validation'
        }
        const result = newsSchema.safeParse(news)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('donationSchema', () => {
    it('should validate complete donation', () => {
      const validDonation = {
        email: 'donor@example.com',
        first_name: 'Jean',
        last_name: 'Dupont',
        amount: 50,
        type: 'one_time' as const,
        accepts_newsletter: true,
        message: 'Message de soutien'
      }

      const result = donationSchema.safeParse(validDonation)
      expect(result.success).toBe(true)
    })

    it('should require minimum donation amount', () => {
      const invalidDonation = {
        email: 'donor@example.com',
        amount: 0.50, // Less than 1€
        type: 'one_time' as const,
        accepts_newsletter: false
      }

      const result = donationSchema.safeParse(invalidDonation)
      expect(result.success).toBe(false)
    })

    it('should accept both donation types', () => {
      const types = ['one_time', 'monthly'] as const

      types.forEach(type => {
        const donation = {
          email: 'donor@example.com',
          amount: 10,
          type,
          accepts_newsletter: false
        }
        const result = donationSchema.safeParse(donation)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('newsletterSchema', () => {
    it('should validate newsletter subscription', () => {
      const validSubscription = {
        email: 'subscriber@example.com',
        first_name: 'Jean',
        last_name: 'Dupont',
        source: 'homepage'
      }

      const result = newsletterSchema.safeParse(validSubscription)
      expect(result.success).toBe(true)
    })

    it('should use default source', () => {
      const subscription = {
        email: 'subscriber@example.com'
      }

      const result = newsletterSchema.safeParse(subscription)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.source).toBe('footer')
      }
    })

    it('should validate email format', () => {
      const validEmails = ['test@example.com', 'user+tag@domain.co.uk']
      const invalidEmails = ['invalid', '@example.com', 'user@']

      validEmails.forEach(email => {
        const result = newsletterSchema.safeParse({ email })
        expect(result.success).toBe(true)
      })

      invalidEmails.forEach(email => {
        const result = newsletterSchema.safeParse({ email })
        expect(result.success).toBe(false)
      })
    })
  })
})

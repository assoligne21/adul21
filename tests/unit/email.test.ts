import { describe, it, expect } from 'vitest'

// Import actual email utilities to test
import { emailTemplates } from '~/server/utils/email'

describe('Email Utils', () => {
  describe('Email validation', () => {
    it('should validate email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'admin@adul21.fr'
      ]

      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user @example.com'
      ]

      validEmails.forEach(email => {
        expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      })

      invalidEmails.forEach(email => {
        expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      })
    })
  })

  describe('Email templates', () => {
    describe('testimonyConfirmation', () => {
      it('should generate testimony confirmation email', () => {
        const template = emailTemplates.testimonyConfirmation({
          firstName: 'Jean',
          city: 'Ledenon',
          userType: 'parent'
        })

        expect(template).toHaveProperty('subject')
        expect(template).toHaveProperty('html')
        expect(template.subject).toBe('Votre témoignage a bien été reçu')
        expect(template.html).toContain('Jean')
        expect(template.html).toContain('Ledenon')
        expect(template.html).toContain('Parent')
      })

      it('should include all user types', () => {
        const userTypes = ['student', 'parent', 'worker', 'retired', 'other']

        userTypes.forEach(userType => {
          const template = emailTemplates.testimonyConfirmation({
            firstName: 'Test',
            city: 'Ledenon',
            userType
          })

          expect(template.html).toBeTruthy()
          expect(template.html.length).toBeGreaterThan(100)
        })
      })

      it('should handle special characters in names', () => {
        const template = emailTemplates.testimonyConfirmation({
          firstName: "Jean-François D'Amélie",
          city: 'Saint-Gervasy',
          userType: 'parent'
        })

        expect(template.html).toContain("Jean-François D'Amélie")
        expect(template.html).toContain('Saint-Gervasy')
      })
    })

    describe('contactConfirmation', () => {
      it('should generate contact confirmation email', () => {
        const template = emailTemplates.contactConfirmation({
          firstName: 'Marie',
          subject: 'testimony'
        })

        expect(template).toHaveProperty('subject')
        expect(template).toHaveProperty('html')
        expect(template.subject).toBe('Nous avons bien reçu votre message')
        expect(template.html).toContain('Marie')
        expect(template.html).toContain('Témoignage')
      })

      it('should handle all subject types', () => {
        const subjects = ['testimony', 'membership', 'volunteering', 'press', 'legal', 'other']

        subjects.forEach(subject => {
          const template = emailTemplates.contactConfirmation({
            firstName: 'Test',
            subject
          })

          expect(template.html).toBeTruthy()
          expect(template.html.length).toBeGreaterThan(100)
        })
      })

      it('should include ADUL21 branding', () => {
        const template = emailTemplates.contactConfirmation({
          firstName: 'Test',
          subject: 'other'
        })

        expect(template.html).toContain('ADUL21')
        expect(template.html).toContain('adul21.fr')
        expect(template.html).toContain('assoligne21@gmail.com')
      })
    })

    describe('membershipConfirmation', () => {
      it('should generate membership confirmation email', () => {
        const template = emailTemplates.membershipConfirmation({
          firstName: 'Pierre',
          lastName: 'Dupont',
          membershipType: 'individual',
          amount: 20
        })

        expect(template).toHaveProperty('subject')
        expect(template).toHaveProperty('html')
        expect(template.subject).toBe("Demande d'adhésion reçue")
        expect(template.html).toContain('Pierre')
        expect(template.html).toContain('Dupont')
        expect(template.html).toContain('20€')
        expect(template.html).toContain('Adhérent individuel')
      })

      it('should handle all membership types', () => {
        const types = ['individual', 'family', 'student', 'support']

        types.forEach(membershipType => {
          const template = emailTemplates.membershipConfirmation({
            firstName: 'Test',
            lastName: 'User',
            membershipType,
            amount: 20
          })

          expect(template.html).toBeTruthy()
          expect(template.html.length).toBeGreaterThan(100)
        })
      })

      it('should include payment information', () => {
        const template = emailTemplates.membershipConfirmation({
          firstName: 'Test',
          lastName: 'User',
          membershipType: 'individual',
          amount: 20
        })

        expect(template.html).toContain('Virement bancaire')
        expect(template.html).toContain('IBAN')
        expect(template.html).toContain('BIC')
      })

      it('should handle different amounts', () => {
        const amounts = [10, 20, 50, 100]

        amounts.forEach(amount => {
          const template = emailTemplates.membershipConfirmation({
            firstName: 'Test',
            lastName: 'User',
            membershipType: 'individual',
            amount
          })

          expect(template.html).toContain(`${amount}€`)
        })
      })
    })

    describe('Template structure', () => {
      it('all templates should have subject and html', () => {
        const templates = [
          emailTemplates.testimonyConfirmation({ firstName: 'Test', city: 'Ledenon', userType: 'parent' }),
          emailTemplates.contactConfirmation({ firstName: 'Test', subject: 'other' }),
          emailTemplates.membershipConfirmation({ firstName: 'Test', lastName: 'User', membershipType: 'individual', amount: 20 })
        ]

        templates.forEach(template => {
          expect(template).toHaveProperty('subject')
          expect(template).toHaveProperty('html')
          expect(typeof template.subject).toBe('string')
          expect(typeof template.html).toBe('string')
          expect(template.subject.length).toBeGreaterThan(0)
          expect(template.html.length).toBeGreaterThan(100)
        })
      })

      it('all templates should include footer', () => {
        const templates = [
          emailTemplates.testimonyConfirmation({ firstName: 'Test', city: 'Ledenon', userType: 'parent' }),
          emailTemplates.contactConfirmation({ firstName: 'Test', subject: 'other' }),
          emailTemplates.membershipConfirmation({ firstName: 'Test', lastName: 'User', membershipType: 'individual', amount: 20 })
        ]

        templates.forEach(template => {
          expect(template.html).toContain('footer')
          expect(template.html).toContain('adul21.fr')
          expect(template.html).toContain('assoligne21@gmail.com')
        })
      })

      it('all templates should be valid HTML', () => {
        const templates = [
          emailTemplates.testimonyConfirmation({ firstName: 'Test', city: 'Ledenon', userType: 'parent' }),
          emailTemplates.contactConfirmation({ firstName: 'Test', subject: 'other' }),
          emailTemplates.membershipConfirmation({ firstName: 'Test', lastName: 'User', membershipType: 'individual', amount: 20 })
        ]

        templates.forEach(template => {
          expect(template.html).toContain('<!DOCTYPE html>')
          expect(template.html).toContain('<html>')
          expect(template.html).toContain('</html>')
          expect(template.html).toContain('<body>')
          expect(template.html).toContain('</body>')
        })
      })
    })
  })
})

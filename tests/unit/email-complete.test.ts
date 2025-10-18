import { describe, it, expect, vi, beforeEach } from 'vitest'
import { emailTemplates } from '~/server/utils/email'

// Note: getEmailTransporter and sendEmail depend on nodemailer and useRuntimeConfig
// which are complex to mock properly in unit tests due to singleton caching.
// These functions are better tested through integration tests.
// Here we focus on testing the email templates and helper functions.

describe('Email Utilities - Templates and Helpers', () => {
  describe('emailTemplates.testimonyConfirmation', () => {
    it('should generate testimony confirmation email', () => {
      const data = {
        firstName: 'Jean',
        city: 'Ledenon',
        userType: 'student'
      }

      const email = emailTemplates.testimonyConfirmation(data)

      expect(email.subject).toBe('Votre témoignage a bien été reçu')
      expect(email.html).toContain('Jean')
      expect(email.html).toContain('Ledenon')
      expect(email.html).toContain('Lycéen')
      expect(email.html).toContain('ADUL21')
      expect(email.html).toContain('assoligne21@gmail.com')
    })

    it('should include correct user type labels', () => {
      const testCases = [
        { userType: 'student', expected: 'Lycéen' },
        { userType: 'parent', expected: 'Parent' },
        { userType: 'worker', expected: 'Actif' },
        { userType: 'retired', expected: 'Retraité' },
        { userType: 'other', expected: 'Autre' }
      ]

      testCases.forEach(({ userType, expected }) => {
        const email = emailTemplates.testimonyConfirmation({
          firstName: 'Test',
          city: 'Ledenon',
          userType
        })

        expect(email.html).toContain(expected)
      })
    })

    it('should handle unknown user type', () => {
      const email = emailTemplates.testimonyConfirmation({
        firstName: 'Test',
        city: 'Ledenon',
        userType: 'unknown-type'
      })

      expect(email.html).toContain('unknown-type')
    })

    it('should include HTML structure with styles', () => {
      const email = emailTemplates.testimonyConfirmation({
        firstName: 'Test',
        city: 'Ledenon',
        userType: 'student'
      })

      expect(email.html).toContain('<!DOCTYPE html>')
      expect(email.html).toContain('<style>')
      expect(email.html).toContain('font-family')
      expect(email.html).toContain('container')
    })
  })

  describe('emailTemplates.contactConfirmation', () => {
    it('should generate contact confirmation email', () => {
      const data = {
        firstName: 'Marie',
        subject: 'testimony'
      }

      const email = emailTemplates.contactConfirmation(data)

      expect(email.subject).toBe('Nous avons bien reçu votre message')
      expect(email.html).toContain('Marie')
      expect(email.html).toContain('Témoignage')
      expect(email.html).toContain('48h ouvrées')
    })

    it('should include correct subject labels', () => {
      const testCases = [
        { subject: 'testimony', expected: 'Témoignage' },
        { subject: 'membership', expected: 'Adhésion' },
        { subject: 'volunteering', expected: 'Bénévolat' },
        { subject: 'press', expected: 'Demande presse/média' },
        { subject: 'legal', expected: 'Question juridique' },
        { subject: 'other', expected: 'Autre' }
      ]

      testCases.forEach(({ subject, expected }) => {
        const email = emailTemplates.contactConfirmation({
          firstName: 'Test',
          subject
        })

        expect(email.html).toContain(expected)
      })
    })

    it('should fallback to original subject if unknown', () => {
      const email = emailTemplates.contactConfirmation({
        firstName: 'Test',
        subject: 'unknown-subject'
      })

      expect(email.html).toContain('unknown-subject')
    })
  })

  describe('emailTemplates.membershipConfirmation', () => {
    it('should generate membership confirmation email', () => {
      const data = {
        firstName: 'Pierre',
        lastName: 'Martin',
        membershipType: 'individual',
        amount: 20
      }

      const email = emailTemplates.membershipConfirmation(data)

      expect(email.subject).toBe('Demande d\'adhésion reçue')
      expect(email.html).toContain('Pierre')
      expect(email.html).toContain('Martin')
      expect(email.html).toContain('20€')
      expect(email.html).toContain('Adhérent individuel')
    })

    it('should include correct membership type labels', () => {
      const testCases = [
        { type: 'individual', expected: 'Adhérent individuel' },
        { type: 'family', expected: 'Adhérent famille' },
        { type: 'student', expected: 'Adhérent étudiant' },
        { type: 'support', expected: 'Adhérent de soutien' }
      ]

      testCases.forEach(({ type, expected }) => {
        const email = emailTemplates.membershipConfirmation({
          firstName: 'Test',
          lastName: 'User',
          membershipType: type,
          amount: 10
        })

        expect(email.html).toContain(expected)
      })
    })

    it('should handle unknown membership type', () => {
      const email = emailTemplates.membershipConfirmation({
        firstName: 'Test',
        lastName: 'User',
        membershipType: 'unknown-type',
        amount: 10
      })

      expect(email.html).toContain('unknown-type')
    })

    it('should include payment instructions', () => {
      const email = emailTemplates.membershipConfirmation({
        firstName: 'Test',
        lastName: 'User',
        membershipType: 'individual',
        amount: 15
      })

      expect(email.html).toContain('Virement bancaire')
      expect(email.html).toContain('IBAN')
      expect(email.html).toContain('BIC')
      expect(email.html).toContain('Adhésion Test User')
    })

    it('should include membership benefits', () => {
      const email = emailTemplates.membershipConfirmation({
        firstName: 'Test',
        lastName: 'User',
        membershipType: 'individual',
        amount: 20
      })

      expect(email.html).toContain('assemblées générales')
      expect(email.html).toContain('informations en avant-première')
      expect(email.html).toContain('mobilisation juridique')
    })

    it('should warn that payment activates membership', () => {
      const email = emailTemplates.membershipConfirmation({
        firstName: 'Test',
        lastName: 'User',
        membershipType: 'individual',
        amount: 20
      })

      expect(email.html).toContain('effective dès réception du paiement')
    })
  })

  describe('Email Template Common Elements', () => {
    it('all templates should include ADUL21 branding', () => {
      const templates = [
        emailTemplates.testimonyConfirmation({ firstName: 'Test', city: 'Ledenon', userType: 'student' }),
        emailTemplates.contactConfirmation({ firstName: 'Test', subject: 'testimony' }),
        emailTemplates.membershipConfirmation({ firstName: 'Test', lastName: 'User', membershipType: 'individual', amount: 20 })
      ]

      templates.forEach(template => {
        expect(template.html).toContain('ADUL21')
        expect(template.html).toContain('Association de Défense des Usagers de la Ligne 21')
      })
    })

    it('all templates should include contact information', () => {
      const templates = [
        emailTemplates.testimonyConfirmation({ firstName: 'Test', city: 'Ledenon', userType: 'student' }),
        emailTemplates.contactConfirmation({ firstName: 'Test', subject: 'testimony' }),
        emailTemplates.membershipConfirmation({ firstName: 'Test', lastName: 'User', membershipType: 'individual', amount: 20 })
      ]

      templates.forEach(template => {
        expect(template.html).toContain('assoligne21@gmail.com')
        expect(template.html).toContain('adul21.fr')
      })
    })

    it('all templates should use responsive HTML structure', () => {
      const templates = [
        emailTemplates.testimonyConfirmation({ firstName: 'Test', city: 'Ledenon', userType: 'student' }),
        emailTemplates.contactConfirmation({ firstName: 'Test', subject: 'testimony' }),
        emailTemplates.membershipConfirmation({ firstName: 'Test', lastName: 'User', membershipType: 'individual', amount: 20 })
      ]

      templates.forEach(template => {
        expect(template.html).toContain('max-width: 600px')
        expect(template.html).toContain('<!DOCTYPE html>')
        expect(template.html).toContain('<meta charset="utf-8">')
      })
    })
  })

  describe('Helper Functions Coverage', () => {
    it('should handle all user type labels', () => {
      const types = ['student', 'parent', 'worker', 'retired', 'other', 'unknown']

      types.forEach(type => {
        const email = emailTemplates.testimonyConfirmation({
          firstName: 'Test',
          city: 'Ledenon',
          userType: type
        })

        expect(email.html).toBeTruthy()
      })
    })

    it('should handle all subject labels', () => {
      const subjects = ['testimony', 'membership', 'volunteering', 'press', 'legal', 'other', 'unknown']

      subjects.forEach(subject => {
        const email = emailTemplates.contactConfirmation({
          firstName: 'Test',
          subject
        })

        expect(email.html).toBeTruthy()
      })
    })

    it('should handle all membership type labels', () => {
      const types = ['individual', 'family', 'student', 'support', 'unknown']

      types.forEach(type => {
        const email = emailTemplates.membershipConfirmation({
          firstName: 'Test',
          lastName: 'User',
          membershipType: type,
          amount: 10
        })

        expect(email.html).toBeTruthy()
      })
    })
  })
})

import { describe, it, expect } from 'vitest'
import { emailTemplates } from '~/server/utils/email'

describe('Email Templates', () => {
  describe('testimonyConfirmation', () => {
    it('should generate testimony confirmation email with correct data', () => {
      const data = {
        firstName: 'Jean',
        city: 'Dijon',
        userType: 'parent'
      }

      const template = emailTemplates.testimonyConfirmation(data)

      expect(template.subject).toBe('Votre témoignage a bien été reçu')
      expect(template.html).toContain('Jean')
      expect(template.html).toContain('Dijon')
      expect(template.html).toContain('Parent')
      expect(template.html).toContain('ADUL21')
      expect(template.html).toContain('modération')
    })

    it('should handle all user types correctly', () => {
      const userTypes = ['student', 'parent', 'worker', 'retired', 'other']

      userTypes.forEach(userType => {
        const template = emailTemplates.testimonyConfirmation({
          firstName: 'Test',
          city: 'Dijon',
          userType
        })

        expect(template.html).toBeDefined()
        expect(template.subject).toBeDefined()
      })
    })

    it('should include required email sections', () => {
      const template = emailTemplates.testimonyConfirmation({
        firstName: 'Jean',
        city: 'Dijon',
        userType: 'parent'
      })

      expect(template.html).toContain('<!DOCTYPE html>')
      expect(template.html).toContain('assoligne21@gmail.com')
      expect(template.html).toContain('adul21.fr')
    })
  })

  describe('contactConfirmation', () => {
    it('should generate contact confirmation email', () => {
      const data = {
        firstName: 'Marie',
        subject: 'testimony'
      }

      const template = emailTemplates.contactConfirmation(data)

      expect(template.subject).toBe('Nous avons bien reçu votre message')
      expect(template.html).toContain('Marie')
      expect(template.html).toContain('Témoignage')
      expect(template.html).toContain('48h ouvrées')
    })

    it('should handle all subject types', () => {
      const subjects = ['testimony', 'membership', 'volunteering', 'press', 'legal', 'other']

      subjects.forEach(subject => {
        const template = emailTemplates.contactConfirmation({
          firstName: 'Test',
          subject
        })

        expect(template.html).toBeDefined()
        expect(template.html).toContain('Test')
      })
    })

    it('should include contact information', () => {
      const template = emailTemplates.contactConfirmation({
        firstName: 'Test',
        subject: 'other'
      })

      expect(template.html).toContain('assoligne21@gmail.com')
      expect(template.html).toContain('ADUL21')
    })
  })

  describe('membershipConfirmation', () => {
    it('should generate membership confirmation email', () => {
      const data = {
        firstName: 'Pierre',
        lastName: 'Dupont',
        membershipType: 'individual',
        amount: 20
      }

      const template = emailTemplates.membershipConfirmation(data)

      expect(template.subject).toBe('Demande d\'adhésion reçue')
      expect(template.html).toContain('Pierre')
      expect(template.html).toContain('Dupont')
      expect(template.html).toContain('Adhérent individuel')
      expect(template.html).toContain('20€')
    })

    it('should handle all membership types', () => {
      const types = ['individual', 'family', 'student', 'support']
      const amounts = [20, 30, 10, 50]

      types.forEach((type, index) => {
        const template = emailTemplates.membershipConfirmation({
          firstName: 'Test',
          lastName: 'User',
          membershipType: type,
          amount: amounts[index]
        })

        expect(template.html).toContain(`${amounts[index]}€`)
        expect(template.html).toBeDefined()
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
      expect(template.html).toContain('Libellé')
      expect(template.html).toContain('Adhésion Test User')
    })

    it('should include member benefits', () => {
      const template = emailTemplates.membershipConfirmation({
        firstName: 'Test',
        lastName: 'User',
        membershipType: 'individual',
        amount: 20
      })

      expect(template.html).toContain('avantages adhérent')
      expect(template.html).toContain('assemblées générales')
      expect(template.html).toContain('mobilisation juridique')
    })
  })

  describe('Email template structure', () => {
    it('should have consistent structure across all templates', () => {
      const templates = [
        emailTemplates.testimonyConfirmation({ firstName: 'Test', city: 'City', userType: 'parent' }),
        emailTemplates.contactConfirmation({ firstName: 'Test', subject: 'other' }),
        emailTemplates.membershipConfirmation({ firstName: 'Test', lastName: 'User', membershipType: 'individual', amount: 20 })
      ]

      templates.forEach(template => {
        expect(template).toHaveProperty('subject')
        expect(template).toHaveProperty('html')
        expect(template.subject).toBeTruthy()
        expect(template.html).toContain('<!DOCTYPE html>')
        expect(template.html).toContain('<html>')
        expect(template.html).toContain('</html>')
        expect(template.html).toContain('ADUL21')
      })
    })

    it('should include responsive styles', () => {
      const template = emailTemplates.contactConfirmation({ firstName: 'Test', subject: 'other' })

      expect(template.html).toContain('<style>')
      expect(template.html).toContain('max-width: 600px')
      expect(template.html).toContain('font-family')
    })
  })
})

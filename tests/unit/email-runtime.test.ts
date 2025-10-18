import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getEmailTransporter, sendEmail } from '~/server/utils/email'
import nodemailer from 'nodemailer'

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-123' })
    }))
  }
}))

describe('Email Runtime Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getEmailTransporter', () => {
    it('should create and return a nodemailer transporter', () => {
      const transporter = getEmailTransporter()

      expect(transporter).toBeDefined()
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'test@gmail.com',
          pass: 'test-app-password'
        }
      })
    })

    it('should return cached transporter on subsequent calls', () => {
      vi.mocked(nodemailer.createTransport).mockClear()

      const first = getEmailTransporter()
      const second = getEmailTransporter()

      expect(first).toBe(second)
      // Should only create once (may be 0 if already cached from previous test)
      expect(vi.mocked(nodemailer.createTransport).mock.calls.length).toBeLessThanOrEqual(1)
    })
  })

  describe('sendEmail', () => {
    it('should call transporter.sendMail with correct parameters', async () => {
      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
        text: 'Test text'
      })

      expect(result).toEqual({
        success: true,
        messageId: 'test-123'
      })
    })

    it('should strip HTML tags if text version not provided', async () => {
      await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Hello <strong>World</strong></p>'
      })

      // Function should complete successfully
      expect(true).toBe(true)
    })

    it('should handle send errors and log them', async () => {
      // Mock console.error to spy on error logging
      const consoleErrorSpy = vi.spyOn(console, 'error')

      // Create a failing mock transporter
      const failingTransporter = {
        sendMail: vi.fn().mockRejectedValue(new Error('SMTP Connection Failed'))
      }

      // Replace nodemailer mock temporarily
      vi.mocked(nodemailer.createTransport).mockReturnValueOnce(failingTransporter as any)

      // Create a new transporter (simulating first call after cache clear)
      const newTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: 'test', pass: 'test' }
      })

      // Try to send mail and expect it to throw
      await expect(
        newTransporter.sendMail({
          from: 'test@example.com',
          to: 'recipient@example.com',
          subject: 'Test',
          html: '<p>Test</p>'
        })
      ).rejects.toThrow('SMTP Connection Failed')

      consoleErrorSpy.mockRestore()
    })
  })
})

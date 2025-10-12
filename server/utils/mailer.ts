import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let transporter: Transporter | null = null

/**
 * Get or create Gmail SMTP transporter
 */
export const getMailTransporter = () => {
  if (transporter) {
    return transporter
  }

  const config = useRuntimeConfig()

  if (!config.gmailUser || !config.gmailAppPassword) {
    console.error('Gmail SMTP credentials not configured')
    throw new Error('Email configuration is missing. Please check your environment variables.')
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.gmailUser,
      pass: config.gmailAppPassword
    },
    tls: {
      rejectUnauthorized: true
    }
  })

  return transporter
}

/**
 * Send email using Gmail SMTP
 */
export const sendEmail = async (options: {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  cc?: string | string[]
  bcc?: string | string[]
  replyTo?: string
}) => {
  try {
    const config = useRuntimeConfig()
    const transporter = getMailTransporter()

    const info = await transporter.sendMail({
      from: config.emailFrom,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
      replyTo: options.replyTo
    })

    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

/**
 * Verify SMTP connection
 */
export const verifyMailConnection = async () => {
  try {
    const transporter = getMailTransporter()
    await transporter.verify()
    console.log('Gmail SMTP connection verified successfully')
    return true
  } catch (error) {
    console.error('Gmail SMTP connection verification failed:', error)
    return false
  }
}

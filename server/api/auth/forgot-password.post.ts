import { eq } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { adminUsers } from '~/server/database/schema'
import { z } from 'zod'
import crypto from 'crypto'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide')
})

export default defineEventHandler(async (event) => {
  // Get database connection with runtime config
  const db = getDb(event)

  try {
    const body = await readBody(event)
    const { email } = forgotPasswordSchema.parse(body)

    // Find admin user
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1)

    // Always return success to prevent email enumeration
    if (!admin) {
      return {
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
      }
    }

    if (!admin.isActive) {
      return {
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
      }
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    // Save token to database
    await db
      .update(adminUsers)
      .set({
        resetToken,
        resetTokenExpiresAt
      })
      .where(eq(adminUsers.id, admin.id))

    // TODO: Send email with reset link
    // For now, we'll just log the token (in production, this should send an email)
    console.log(`Password reset token for ${email}: ${resetToken}`)
    console.log(`Reset URL: ${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}`)

    return {
      success: true,
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
      // REMOVE IN PRODUCTION - Only for development
      ...(process.env.NODE_ENV === 'development' && { token: resetToken })
    }
  } catch (error) {
    console.error('Error in forgot password:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la demande de réinitialisation'
    })
  }
})

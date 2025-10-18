import { eq, and, gt } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { adminUsers } from '~/server/database/schema'
import { hashPassword } from '~/server/utils/hash'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères')
})

export default defineEventHandler(async (event) => {
  // Get database connection with runtime config
  const db = getDb(event)

  try {
    const body = await readBody(event)
    const { token, password } = resetPasswordSchema.parse(body)

    // Find admin user with valid token
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(
        and(
          eq(adminUsers.resetToken, token),
          gt(adminUsers.resetTokenExpiresAt, new Date())
        )
      )
      .limit(1)

    if (!admin) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token invalide ou expiré'
      })
    }

    // Hash new password
    const passwordHash = await hashPassword(password)

    // Update password and clear reset token
    await db
      .update(adminUsers)
      .set({
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
        updatedAt: new Date()
      })
      .where(eq(adminUsers.id, admin.id))

    return {
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    }
  } catch (error: any) {
    console.error('Error in reset password:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la réinitialisation du mot de passe'
    })
  }
})

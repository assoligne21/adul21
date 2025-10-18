import { eq } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { adminUsers } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'
import { hashPassword } from '~/server/utils/hash'
import { z } from 'zod'
import { handleApiError } from '~/server/utils/error-handler'

const updateAdminUserSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  email: z.string().email('Email invalide').max(90, 'Email trop long (max 90 caractères)').optional(),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').optional(),
  isActive: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
  // Require admin authentication
  await requireAuth(event)

  // Get database connection with runtime config
  const db = getDb(event)

  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de l\'utilisateur manquant'
      })
    }

    const body = await readBody(event)
    const validatedData = updateAdminUserSchema.parse(body)

    // Build update object
    const updateData: any = {
      updatedAt: new Date()
    }

    if (validatedData.name) {
      updateData.name = validatedData.name
    }

    if (validatedData.email) {
      updateData.email = validatedData.email
    }

    if (validatedData.password) {
      updateData.passwordHash = await hashPassword(validatedData.password)
    }

    if (validatedData.isActive !== undefined) {
      updateData.isActive = validatedData.isActive
    }

    // Update user
    const [updatedUser] = await db
      .update(adminUsers)
      .set(updateData)
      .where(eq(adminUsers.id, id))
      .returning({
        id: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        isActive: adminUsers.isActive,
        lastLoginAt: adminUsers.lastLoginAt,
        createdAt: adminUsers.createdAt
      })

    if (!updatedUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur introuvable'
      })
    }

    return {
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: updatedUser
    }
  } catch (error) {
    handleApiError(error, 'Erreur lors de la mise à jour de l\'utilisateur')
  }
})

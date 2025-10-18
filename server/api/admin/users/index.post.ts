import { getDb } from '~/server/database/connection'
import { adminUsers } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'
import { hashPassword } from '~/server/utils/hash'
import { z } from 'zod'
import { handleApiError } from '~/server/utils/error-handler'

const createAdminUserSchema = z.object({
  email: z.string().email('Email invalide').max(90, 'Email trop long (max 90 caractères)'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères')
})

export default defineEventHandler(async (event) => {
  // Require admin authentication
  await requireAuth(event)

  // Get database connection with runtime config
  const db = getDb(event)

  try {
    const body = await readBody(event)
    const validatedData = createAdminUserSchema.parse(body)

    // Hash password
    const passwordHash = await hashPassword(validatedData.password)

    // Create admin user
    const [newUser] = await db
      .insert(adminUsers)
      .values({
        email: validatedData.email,
        name: validatedData.name,
        passwordHash,
        isActive: true
      })
      .returning({
        id: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        isActive: adminUsers.isActive,
        createdAt: adminUsers.createdAt
      })

    return {
      success: true,
      message: 'Utilisateur admin créé avec succès',
      data: newUser
    }
  } catch (error) {
    handleApiError(error, 'Erreur lors de la création de l\'utilisateur')
  }
})

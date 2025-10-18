import { getDb } from '~/server/database/connection'
import { adminUsers } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Require admin authentication
  await requireAuth(event)

  // Get database connection with runtime config
  const db = getDb(event)

  try {
    const users = await db
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        isActive: adminUsers.isActive,
        lastLoginAt: adminUsers.lastLoginAt,
        createdAt: adminUsers.createdAt
      })
      .from(adminUsers)
      .orderBy(adminUsers.createdAt)

    return {
      success: true,
      data: users
    }
  } catch (error) {
    console.error('Error fetching admin users:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des utilisateurs'
    })
  }
})

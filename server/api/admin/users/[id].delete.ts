import { eq, ne } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { adminUsers } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Require admin authentication
  const currentUser = await requireAuth(event)

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

    // Prevent self-deletion
    if (id === currentUser.userId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Vous ne pouvez pas supprimer votre propre compte'
      })
    }

    // Check if this is the last active admin
    const activeAdmins = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.isActive, true))

    if (activeAdmins.length === 1 && activeAdmins[0].id === id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Impossible de supprimer le dernier administrateur actif'
      })
    }

    // Delete user
    const [deletedUser] = await db
      .delete(adminUsers)
      .where(eq(adminUsers.id, id))
      .returning()

    if (!deletedUser) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur introuvable'
      })
    }

    return {
      success: true,
      message: 'Utilisateur supprimé avec succès'
    }
  } catch (error: unknown) {
    console.error('Error deleting admin user:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la suppression'
    })
  }
})

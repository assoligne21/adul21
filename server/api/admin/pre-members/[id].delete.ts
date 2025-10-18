import { eq } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { preMembers } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'

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
        statusMessage: 'ID du soutien manquant'
      })
    }

    // Delete pre-member
    const [deletedPreMember] = await db
      .delete(preMembers)
      .where(eq(preMembers.id, id))
      .returning()

    if (!deletedPreMember) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Soutien introuvable'
      })
    }

    return {
      success: true,
      message: 'Soutien supprimé avec succès'
    }
  } catch (error: unknown) {
    console.error('Error deleting pre-member:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la suppression'
    })
  }
})

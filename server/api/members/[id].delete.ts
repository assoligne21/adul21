import { eq } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { members } from '~/server/database/schema'
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
        statusMessage: 'ID de l\'adh�rent manquant'
      })
    }

    // Delete member
    const [deletedMember] = await db
      .delete(members)
      .where(eq(members.id, id))
      .returning()

    if (!deletedMember) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Adh�rent introuvable'
      })
    }

    return {
      success: true,
      message: 'Adh�rent supprim� avec succ�s'
    }
  } catch (error: unknown) {
    console.error('Error deleting member:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la suppression'
    })
  }
})

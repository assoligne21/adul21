import { eq } from 'drizzle-orm'
import { db } from '~/server/database/connection'
import { testimonies } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Require admin authentication
  await requireAuth(event)

  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID du t�moignage manquant'
      })
    }

    // Delete testimony
    const [deletedTestimony] = await db
      .delete(testimonies)
      .where(eq(testimonies.id, id))
      .returning()

    if (!deletedTestimony) {
      throw createError({
        statusCode: 404,
        statusMessage: 'T�moignage introuvable'
      })
    }

    return {
      success: true,
      message: 'T�moignage supprim� avec succ�s'
    }
  } catch (error: unknown) {
    console.error('Error deleting testimony:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la suppression'
    })
  }
})

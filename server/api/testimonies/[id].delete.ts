import { eq } from 'drizzle-orm'
import { db } from '~/server/database/connection'
import { testimonies } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID du témoignage manquant'
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
        statusMessage: 'Témoignage introuvable'
      })
    }

    return {
      success: true,
      message: 'Témoignage supprimé avec succès'
    }
  } catch (error: any) {
    console.error('Error deleting testimony:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la suppression'
    })
  }
})

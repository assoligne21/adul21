import { eq } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { newsletterSubscribers } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Require admin authentication
  await requireAuth(event)
  const db = getDb(event)

  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de l\'abonné manquant'
      })
    }

    // Delete subscriber
    const [deletedSubscriber] = await db
      .delete(newsletterSubscribers)
      .where(eq(newsletterSubscribers.id, id))
      .returning()

    if (!deletedSubscriber) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Abonné introuvable'
      })
    }

    return {
      success: true,
      message: 'Abonné supprimé avec succès'
    }
  } catch (error: unknown) {
    console.error('Error deleting newsletter subscriber:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la suppression'
    })
  }
})

import { eq } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { contactMessages } from '~/server/database/schema'
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
        statusMessage: 'ID du message manquant'
      })
    }

    // Delete contact message
    const [deletedMessage] = await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id))
      .returning()

    if (!deletedMessage) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Message introuvable'
      })
    }

    return {
      success: true,
      message: 'Message supprimé avec succès'
    }
  } catch (error: unknown) {
    console.error('Error deleting contact message:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la suppression'
    })
  }
})

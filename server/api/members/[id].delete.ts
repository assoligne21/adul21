import { eq } from 'drizzle-orm'
import { db } from '~/server/database/connection'
import { members } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de l\'adhérent manquant'
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
        statusMessage: 'Adhérent introuvable'
      })
    }

    return {
      success: true,
      message: 'Adhérent supprimé avec succès'
    }
  } catch (error: any) {
    console.error('Error deleting member:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la suppression'
    })
  }
})

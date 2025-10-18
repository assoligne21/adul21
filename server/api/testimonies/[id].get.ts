import { eq, and } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { testimonies } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  try {
    // Get database connection with runtime config
    const db = getDb(event)

    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID du témoignage manquant'
      })
    }

    // Fetch testimony by ID
    const [testimony] = await db
      .select()
      .from(testimonies)
      .where(
        and(
          eq(testimonies.id, id),
          eq(testimonies.isPublished, true),
          eq(testimonies.moderationStatus, 'approved')
        )
      )
      .limit(1)

    if (!testimony) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Témoignage introuvable'
      })
    }

    return {
      success: true,
      data: testimony
    }
  } catch (error: unknown) {
    console.error('Error fetching testimony:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Une erreur est survenue'
    })
  }
})

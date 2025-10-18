import { eq } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { members } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
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

    // Fetch member by ID
    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1)

    if (!member) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Adh�rent introuvable'
      })
    }

    return {
      success: true,
      data: member
    }
  } catch (error: unknown) {
    console.error('Error fetching member:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Une erreur est survenue'
    })
  }
})

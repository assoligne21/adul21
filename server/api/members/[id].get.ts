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

    // Fetch member by ID
    const [member] = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1)

    if (!member) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Adhérent introuvable'
      })
    }

    return {
      success: true,
      data: member
    }
  } catch (error: any) {
    console.error('Error fetching member:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Une erreur est survenue'
    })
  }
})

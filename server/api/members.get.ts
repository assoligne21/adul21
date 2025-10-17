import { desc } from 'drizzle-orm'
import { db } from '~/server/database/connection'
import { members } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Require admin authentication
  await requireAuth(event)

  // Get pagination parameters
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 100

  try {
    // Fetch members sorted by creation date (newest first)
    const membersList = await db
      .select()
      .from(members)
      .orderBy(desc(members.createdAt))
      .limit(limit)

    return membersList
  } catch (error) {
    console.error('Error fetching members:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des membres'
    })
  }
})

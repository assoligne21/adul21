import { desc, eq } from 'drizzle-orm'
import { db } from '~/server/database/connection'
import { contactMessages } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Require admin authentication
  await requireAuth(event)

  // Get pagination parameters
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 100

  try {
    // Fetch contact messages
    // Sort by status (new first) then by date (newest first)
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(limit)

    // Sort in memory to prioritize "new" status
    const sorted = messages.sort((a, b) => {
      // New messages first
      if (a.status === 'new' && b.status !== 'new') return -1
      if (a.status !== 'new' && b.status === 'new') return 1

      // Then by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return sorted
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des messages'
    })
  }
})

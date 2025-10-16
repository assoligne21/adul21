import { db } from '~/server/database/connection'
import { newsletterSubscribers } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Require authentication
  await requireAuth(event)

  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 1000

  // Get all newsletter subscribers, sorted by most recent first
  const subscribersList = await db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt))
    .limit(limit)

  return subscribersList
})

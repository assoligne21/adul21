import { db } from '~/server/database/connection'
import { preMembers } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'
import { desc, eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Require authentication
  await requireAuth(event)

  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 500

  // Get all pre-members, sorted by most recent first
  const preMembersList = await db
    .select()
    .from(preMembers)
    .orderBy(desc(preMembers.createdAt))
    .limit(limit)

  return preMembersList
})

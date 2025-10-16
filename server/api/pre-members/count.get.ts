import { db } from '~/server/database/connection'
import { preMembers } from '~/server/database/schema'
import { count as drizzleCount } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const [{ value: totalCount }] = await db
      .select({ value: drizzleCount() })
      .from(preMembers)

    return {
      success: true,
      data: {
        count: totalCount || 0
      }
    }
  } catch (error: any) {
    console.error('Error fetching pre-members count:', error)

    return {
      success: true,
      data: {
        count: 0
      }
    }
  }
})

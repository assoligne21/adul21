import { eq, and, like, or, desc } from 'drizzle-orm'
import { db } from '~/server/database/connection'
import { members } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    // Build where conditions
    const conditions = []

    // Filter by membership status
    if (query.membership_status) {
      conditions.push(eq(members.membershipStatus, query.membership_status as string))
    }

    // Filter by membership type
    if (query.membership_type) {
      conditions.push(eq(members.membershipType, query.membership_type as string))
    }

    // Filter by city
    if (query.city) {
      conditions.push(eq(members.city, query.city as string))
    }

    // Filter by user type
    if (query.user_type) {
      conditions.push(eq(members.userType, query.user_type as string))
    }

    // Filter by wants to participate
    if (query.wants_to_participate !== undefined) {
      conditions.push(eq(members.wantsToParticipate, query.wants_to_participate === 'true'))
    }

    // Search in name or email
    if (query.search) {
      const searchTerm = `%${query.search}%`
      conditions.push(
        or(
          like(members.firstName, searchTerm),
          like(members.lastName, searchTerm),
          like(members.email, searchTerm)
        )
      )
    }

    // Build query
    let queryBuilder = db
      .select()
      .from(members)
      .orderBy(desc(members.createdAt))
      .$dynamic()

    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions))
    }

    // Apply limit
    if (query.limit) {
      queryBuilder = queryBuilder.limit(parseInt(query.limit as string))
    }

    // Execute query
    const result = await queryBuilder

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Error fetching members:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des adhérents'
    })
  }
})

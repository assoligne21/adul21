import { eq, and, like, or, desc } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { testimonies } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  try {
    // Get database connection with runtime config
    const db = getDb(event)

    const query = getQuery(event)

    // Build where conditions
    const conditions = []

    // Filter by moderation status
    // Empty string means "all", undefined/null means default filter
    if (query.moderation_status !== undefined && query.moderation_status !== '') {
      conditions.push(eq(testimonies.moderationStatus, query.moderation_status as string))
    } else if (query.moderation_status === undefined) {
      // Default to approved testimonies for public (only when param not provided at all)
      conditions.push(eq(testimonies.moderationStatus, 'approved'))
    }

    // Filter by published status
    // Empty string means "all", undefined/null means default filter
    if (query.published !== undefined && query.published !== '') {
      conditions.push(eq(testimonies.isPublished, query.published === 'true'))
    } else if (query.published === undefined) {
      // Default to published testimonies for public (only when param not provided at all)
      conditions.push(eq(testimonies.isPublished, true))
    }

    // Filter by featured
    if (query.featured !== undefined) {
      conditions.push(eq(testimonies.isFeatured, query.featured === 'true'))
    }

    // Filter by city
    if (query.city) {
      conditions.push(eq(testimonies.city, query.city as string))
    }

    // Filter by user type
    if (query.user_type) {
      conditions.push(eq(testimonies.userType, query.user_type as string))
    }

    // Search in testimony text and author name
    if (query.search) {
      const searchTerm = `%${query.search}%`
      conditions.push(
        or(
          like(testimonies.testimonyText, searchTerm),
          like(testimonies.firstName, searchTerm),
          like(testimonies.lastName, searchTerm)
        )
      )
    }

    // Build query
    let queryBuilder = db
      .select()
      .from(testimonies)
      .where(and(...conditions))
      .orderBy(desc(testimonies.createdAt))
      .$dynamic()

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
    console.error('Error fetching testimonies:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération des témoignages'
    })
  }
})

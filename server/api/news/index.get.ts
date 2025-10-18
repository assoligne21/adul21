import { eq, and, desc } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { news } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  const db = getDb(event)

  try {
    const query = getQuery(event)

    const conditions = []

    // Filter by published status (default: published)
    if (query.published !== undefined) {
      conditions.push(eq(news.isPublished, query.published === 'true'))
    } else {
      conditions.push(eq(news.isPublished, true))
    }

    // Build query
    let queryBuilder = db
      .select()
      .from(news)
      .orderBy(desc(news.publishedAt))
      .$dynamic()

    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions))
    }

    if (query.limit) {
      queryBuilder = queryBuilder.limit(parseInt(query.limit as string))
    }

    const result = await queryBuilder

    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Error fetching news:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la r�cup�ration des actualit�s'
    })
  }
})

import { serverSupabaseServiceRole } from '~/server/utils/supabase-compat'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const supabase = serverSupabaseServiceRole(event)

    let queryBuilder = supabase
      .from('testimonies')
      .select('*')
      .eq('is_published', true)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })

    // Apply filters if provided
    if (query.city) {
      queryBuilder = queryBuilder.eq('city', query.city as string)
    }

    if (query.user_type) {
      queryBuilder = queryBuilder.eq('user_type', query.user_type as string)
    }

    if (query.limit) {
      queryBuilder = queryBuilder.limit(parseInt(query.limit as string))
    }

    const { data, error } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la récupération des témoignages'
      })
    }

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    console.error('Error fetching testimonies:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Une erreur est survenue'
    })
  }
})

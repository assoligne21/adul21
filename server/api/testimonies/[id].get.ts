import { serverSupabaseServiceRole } from '~/server/utils/supabase-compat'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID du témoignage manquant'
      })
    }

    const supabase = serverSupabaseServiceRole(event)

    const { data, error } = await supabase
      .from('testimonies')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .eq('moderation_status', 'approved')
      .single()

    if (error || !data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Témoignage introuvable'
      })
    }

    return {
      success: true,
      data
    }
  } catch (error: any) {
    console.error('Error fetching testimony:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Une erreur est survenue'
    })
  }
})

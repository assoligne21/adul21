import { serverSupabaseServiceRole } from '../../../utils/supabase-compat.ts'

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

    // Get current testimony to increment views
    const { data: testimony, error: fetchError } = await supabase
      .from('testimonies')
      .select('views_count')
      .eq('id', id)
      .single()

    if (fetchError || !testimony) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Témoignage introuvable'
      })
    }

    // Update views count
    const { error: updateError } = await supabase
      .from('testimonies')
      .update({ views_count: testimony.views_count + 1 })
      .eq('id', id)

    if (updateError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de la mise à jour des vues'
      })
    }

    return {
      success: true,
      views_count: testimony.views_count + 1
    }
  } catch (error: unknown) {
    console.error('Error incrementing views:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Une erreur est survenue'
    })
  }
})

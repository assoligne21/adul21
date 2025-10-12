import { serverSupabaseServiceRole } from '../../utils/supabase-compat.ts'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)

    const { count, error } = await supabase
      .from('pre_members')
      .select('*', { count: 'exact', head: true })

    if (error) {
      throw error
    }

    return {
      success: true,
      data: {
        count: count || 0
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

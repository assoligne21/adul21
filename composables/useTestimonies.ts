import type { Database } from '~/types/database.types'

type Testimony = Database['public']['Tables']['testimonies']['Row']
type TestimonyInsert = Database['public']['Tables']['testimonies']['Insert']

export const useTestimonies = () => {
  const { supabase } = useSupabase()

  // Récupérer les témoignages publiés
  const getPublishedTestimonies = async (filters?: {
    city?: string
    user_type?: string
    limit?: number
  }) => {
    let query = supabase
      .from('testimonies')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (filters?.city) {
      query = query.eq('city', filters.city)
    }

    if (filters?.user_type) {
      query = query.eq('user_type', filters.user_type)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    return { data, error }
  }

  // Récupérer un témoignage par ID
  const getTestimonyById = async (id: string) => {
    const { data, error } = await supabase
      .from('testimonies')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    return { data, error }
  }

  // Soumettre un nouveau témoignage
  const submitTestimony = async (testimony: TestimonyInsert) => {
    const { data, error } = await supabase
      .from('testimonies')
      .insert(testimony)
      .select()
      .single()

    return { data, error }
  }

  // Incrémenter les vues d'un témoignage
  const incrementViews = async (id: string) => {
    const { error } = await supabase.rpc('increment_testimony_views', { testimony_id: id })
    return { error }
  }

  return {
    getPublishedTestimonies,
    getTestimonyById,
    submitTestimony,
    incrementViews
  }
}

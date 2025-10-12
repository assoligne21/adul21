import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export const useSupabase = () => {
  const config = useRuntimeConfig()

  // Client Supabase avec clé publique (pour le front-end)
  const supabase = createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseKey
  )

  return {
    supabase
  }
}

// Pour usage serveur uniquement (avec service role key)
export const useSupabaseServer = () => {
  const config = useRuntimeConfig()

  const supabaseServer = createClient<Database>(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  )

  return {
    supabaseServer
  }
}

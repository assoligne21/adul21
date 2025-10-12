// Types auto-générés depuis Supabase
// Pour générer ces types : npx supabase gen types typescript --project-id <project-id> > types/database.types.ts

export type Database = {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          civility: 'M.' | 'Mme' | 'Autre'
          first_name: string
          last_name: string
          birth_date: string | null
          email: string
          phone: string | null
          address: string
          postal_code: string
          city: 'Ledenon' | 'Cabrières' | 'Saint-Gervasy' | 'Autre'
          user_type: 'student' | 'parent' | 'senior' | 'pmr' | 'worker' | 'other'
          school_name: string | null
          school_section: string | null
          usage_before: 'daily' | '2-3_per_week' | 'weekly' | 'occasional' | null
          usage_after: 'car' | 'correspondences' | 'depends_on_someone' | 'stopped' | null
          membership_fee: number
          membership_type: 'reduced' | 'normal' | 'support' | 'custom'
          membership_status: 'pending' | 'active' | 'expired' | 'cancelled'
          membership_start_date: string | null
          membership_end_date: string | null
          payment_method: 'card' | 'paypal' | 'check' | 'transfer' | 'cash' | null
          stripe_customer_id: string | null
          wants_to_participate: boolean
          participation_areas: string[] | null
          accepts_newsletter: boolean
          accepts_testimony_publication: boolean
          accepts_media_contact: boolean
          accepts_action_solicitation: boolean
          is_admin: boolean
          password_hash: string | null
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['members']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['members']['Insert']>
      }
      testimonies: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string | null
          email: string
          phone: string | null
          city: 'Ledenon' | 'Cabrières' | 'Saint-Gervasy' | 'Autre'
          age_range: 'under_18' | '18-30' | '30-50' | '50-70' | 'over_70'
          user_type: 'student' | 'parent' | 'senior' | 'pmr' | 'worker' | 'other'
          school_name: string | null
          school_section: string | null
          workplace: string | null
          work_hours: string | null
          usage_before_frequency: 'daily' | '2-3_per_week' | 'weekly' | 'occasional' | null
          usage_before_time: number | null
          usage_before_destination: string | null
          usage_before_cost: number | null
          usage_after_solution: 'car' | 'correspondences' | 'depends_on_someone' | 'stopped' | null
          usage_after_time: number | null
          usage_after_correspondences: number | null
          usage_after_wait_time: number | null
          usage_after_cost: number | null
          usage_after_distance: number | null
          problems: string[] | null
          missed_correspondences_per_month: number | null
          testimony_text: string
          concrete_example: string | null
          publication_preference: 'first_name' | 'initials' | 'anonymous'
          accepts_site_publication: boolean
          accepts_legal_use: boolean
          accepts_association_contact: boolean
          accepts_media_contact: boolean
          accepts_oral_testimony: boolean
          photo_url: string | null
          moderation_status: 'pending' | 'approved' | 'rejected' | 'needs_modification'
          moderation_notes: string | null
          moderated_by: string | null
          moderated_at: string | null
          views_count: number
          reactions_count: number
          shares_count: number
          is_published: boolean
          is_featured: boolean
        }
        Insert: Omit<Database['public']['Tables']['testimonies']['Row'], 'id' | 'created_at' | 'updated_at' | 'views_count' | 'reactions_count' | 'shares_count'>
        Update: Partial<Database['public']['Tables']['testimonies']['Insert']>
      }
      donations: {
        Row: {
          id: string
          created_at: string
          email: string
          first_name: string | null
          last_name: string | null
          amount: number
          currency: string
          payment_method: 'card' | 'paypal' | 'check' | 'transfer' | 'cash' | null
          stripe_payment_intent_id: string | null
          stripe_customer_id: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          completed_at: string | null
          receipt_sent: boolean
          receipt_sent_at: string | null
          accepts_newsletter: boolean
          message: string | null
        }
        Insert: Omit<Database['public']['Tables']['donations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['donations']['Insert']>
      }
      news: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          cover_image_url: string | null
          author_id: string | null
          is_published: boolean
          published_at: string | null
          meta_title: string | null
          meta_description: string | null
          views_count: number
        }
        Insert: Omit<Database['public']['Tables']['news']['Row'], 'id' | 'created_at' | 'updated_at' | 'views_count'>
        Update: Partial<Database['public']['Tables']['news']['Insert']>
      }
    }
    Views: {
      members_by_city: {
        Row: {
          city: string
          total: number
          active: number
          total_fees: number
        }
      }
      testimonies_stats: {
        Row: {
          moderation_status: string
          count: number
        }
      }
      donations_stats: {
        Row: {
          month: string
          count: number
          total_amount: number
        }
      }
    }
  }
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

// Testimony API Types
export interface Testimony {
  id: string
  created_at: string
  updated_at: string

  // Author
  first_name: string
  last_name?: string
  email: string
  phone?: string
  city: string
  age_range: string

  // Profile
  user_type: string
  school_name?: string
  school_section?: string
  workplace?: string
  work_hours?: string

  // Usage before
  usage_before_frequency?: string
  usage_before_time?: number
  usage_before_destination?: string
  usage_before_cost?: number

  // Usage after
  usage_after_solution?: string
  usage_after_time?: number
  usage_after_correspondences?: number
  usage_after_wait_time?: number
  usage_after_cost?: number
  usage_after_distance?: number
  problems?: string[]
  missed_correspondences_per_month?: number

  // Testimony
  testimony_text: string
  concrete_example?: string

  // Publication
  publication_preference: string
  accepts_site_publication: boolean
  accepts_legal_use: boolean
  accepts_association_contact: boolean
  accepts_media_contact: boolean
  accepts_oral_testimony: boolean

  // Photo
  photo_url?: string

  // Moderation
  moderation_status: 'pending' | 'approved' | 'rejected' | 'needs_modification'
  moderation_notes?: string
  moderated_by?: string
  moderated_at?: string

  // Statistics
  views_count: number
  reactions_count: number
  shares_count: number

  // Flags
  is_published: boolean
  is_featured: boolean
}

// Member API Types
export interface Member {
  id: string
  created_at: string
  updated_at: string

  // Personal info
  civility: string
  first_name: string
  last_name: string
  birth_date?: string

  // Contact
  email: string
  phone?: string
  address: string
  postal_code: string
  city: string

  // Profile
  user_type: string
  school_name?: string
  school_section?: string
  usage_before?: string
  usage_after?: string

  // Membership
  membership_fee: number
  membership_type: string
  membership_status: 'pending' | 'active' | 'expired' | 'cancelled'
  membership_start_date?: string
  membership_end_date?: string
  payment_method?: string
  stripe_customer_id?: string

  // Engagement
  wants_to_participate: boolean
  participation_areas?: string[]

  // Consents
  accepts_newsletter: boolean
  accepts_testimony_publication: boolean
  accepts_media_contact: boolean
  accepts_action_solicitation: boolean

  // Admin
  is_admin: boolean
  notes?: string
}

// News API Types
export interface News {
  id: string
  created_at: string
  updated_at: string

  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image_url?: string

  author_id?: string

  is_published: boolean
  published_at?: string

  meta_title?: string
  meta_description?: string

  views_count: number
}

// Donation API Types
export interface Donation {
  id: string
  created_at: string

  email: string
  first_name?: string
  last_name?: string

  amount: number
  currency: string
  payment_method?: string

  stripe_payment_intent_id?: string
  stripe_customer_id?: string

  status: 'pending' | 'completed' | 'failed' | 'refunded'
  completed_at?: string

  receipt_sent: boolean
  receipt_sent_at?: string

  accepts_newsletter: boolean
  message?: string
}

// Subscription API Types
export interface Subscription {
  id: string
  created_at: string
  updated_at: string

  email: string
  first_name?: string
  last_name?: string

  amount: number
  currency: string
  billing_day: number

  stripe_subscription_id: string
  stripe_customer_id: string

  status: 'active' | 'paused' | 'cancelled' | 'past_due'
  start_date: string
  end_date?: string
  cancel_at_period_end: boolean

  accepts_newsletter: boolean
}

// Incident API Types
export interface Incident {
  id: string
  created_at: string

  incident_date: string
  incident_time?: string

  incident_type: string
  bus_line?: string
  description: string

  consequence?: string
  consequence_details?: string
  taxi_cost?: number

  email?: string
}

// Download tracking API Types
export interface Download {
  id: string
  created_at: string

  file_name: string
  file_type: string

  ip_address?: string
  user_agent?: string

  country_code?: string
  city?: string
}

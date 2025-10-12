// Testimony Form Types
export interface TestimonyForm {
  // Step 1: Personal info
  first_name: string
  last_name?: string
  age_range: 'under_18' | '18-30' | '30-50' | '50-70' | 'over_70' | ''
  email: string
  phone?: string
  city: 'Ledenon' | 'Cabrières' | 'Saint-Gervasy' | 'Autre' | ''
  user_type: 'student' | 'parent' | 'senior' | 'pmr' | 'worker' | 'other' | ''
  school_name?: string
  school_section?: string
  workplace?: string
  work_hours?: string

  // Step 2: Before
  usage_before_frequency?: 'daily' | '2-3_per_week' | 'weekly' | 'occasional' | ''
  usage_before_time?: number | null
  usage_before_cost?: number | null
  usage_before_destination?: string

  // Step 3: After
  usage_after_solution: 'car' | 'correspondences' | 'depends_on_someone' | 'stopped' | ''
  usage_after_time?: number | null
  usage_after_correspondences?: number | null
  usage_after_wait_time?: number | null
  usage_after_cost?: number | null
  usage_after_distance?: number | null
  problems: string[]
  missed_correspondences_per_month?: number | null

  // Step 4: Testimony
  testimony_text: string
  concrete_example?: string
  publication_preference: 'first_name' | 'initials' | 'anonymous' | ''
  accepts_site_publication: boolean
  accepts_legal_use: boolean
  accepts_media_contact: boolean
  accepts_oral_testimony: boolean
}

// Member/Adhesion Form Types
export interface MemberForm {
  // Step 1: Personal info
  civility: 'M.' | 'Mme' | 'Autre' | ''
  firstName: string
  lastName: string
  birthDate?: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: 'Ledenon' | 'Cabrières' | 'Saint-Gervasy' | 'Autre' | ''

  // Step 2: User profile
  userType: 'student' | 'parent' | 'worker' | 'senior' | 'pmr' | 'other' | ''
  schoolName?: string
  schoolSection?: string
  usageBefore?: 'daily' | '2-3_per_week' | 'weekly' | 'occasional' | ''
  usageAfter?: 'car' | 'correspondences' | 'depends_on_someone' | 'stopped' | ''

  // Step 3: Membership
  membershipType: 'reduced' | 'normal' | 'support' | 'custom' | ''
  membershipFee: number

  // Step 4: Engagement
  wantsToParticipate: boolean
  participationAreas: string[]
  acceptsNewsletter: boolean
  acceptsTestimonyPublication: boolean
  acceptsMediaContact: boolean
  acceptsActionSolicitation: boolean
}

// Contact Form Types
export interface ContactForm {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  acceptsContact: boolean
}

// Incident Report Form Types
export interface IncidentForm {
  incident_date: string
  incident_time?: string
  incident_type: 'missed_correspondence' | 'delay' | 'no_bus' | 'accessibility' | 'extra_cost' | 'other'
  bus_line?: string
  description: string
  consequence?: 'late_work' | 'missed_appointment' | 'taxi_cost' | 'abandoned_trip' | 'other'
  consequence_details?: string
  taxi_cost?: number
  email?: string
}

// Donation Form Types
export interface DonationForm {
  email: string
  first_name?: string
  last_name?: string
  amount: number
  type: 'one_time' | 'monthly'
  accepts_newsletter: boolean
  message?: string
}

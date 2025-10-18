import { z } from 'zod'

// Testimony Validation Schema
export const testimonySchema = z.object({
  // Step 1: Personal info
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().optional(),
  age_range: z.enum(['under_18', '18-30', '30-50', '50-70', 'over_70']),
  email: z.string().email('Email invalide').max(90, 'Email trop long (max 90 caractères)'),
  phone: z.string().optional(),
  city: z.enum(['Ledenon', 'Cabrières', 'Saint-Gervasy', 'Autre']),
  user_type: z.enum(['student', 'parent', 'senior', 'pmr', 'worker', 'other']),
  school_name: z.string().optional(),
  school_section: z.string().optional(),
  workplace: z.string().optional(),
  work_hours: z.string().optional(),

  // Step 2: Before
  usage_before_frequency: z.enum(['daily', '2-3_per_week', 'weekly', 'occasional']).optional(),
  usage_before_time: z.number().int().positive().optional().nullable(),
  usage_before_cost: z.number().positive().optional().nullable(),
  usage_before_destination: z.string().optional(),

  // Step 3: After
  usage_after_solution: z.enum(['car', 'correspondences', 'depends_on_someone', 'stopped']),
  usage_after_time: z.number().int().positive().optional().nullable(),
  usage_after_correspondences: z.number().int().positive().optional().nullable(),
  usage_after_wait_time: z.number().int().positive().optional().nullable(),
  usage_after_cost: z.number().positive().optional().nullable(),
  usage_after_distance: z.number().positive().optional().nullable(),
  problems: z.array(z.string()),
  missed_correspondences_per_month: z.number().int().positive().optional().nullable(),

  // Step 4: Testimony
  testimony_text: z.string().min(50, 'Le témoignage doit contenir au moins 50 caractères'),
  concrete_example: z.string().optional(),
  publication_preference: z.enum(['first_name', 'initials', 'anonymous']),
  accepts_site_publication: z.boolean(),
  accepts_legal_use: z.boolean(),
  accepts_media_contact: z.boolean(),
  accepts_oral_testimony: z.boolean(),
  accepts_association_contact: z.boolean().optional().default(false)
}).refine(
  (data) => data.accepts_legal_use === true,
  {
    message: 'Vous devez accepter l\'utilisation de votre témoignage conformément au RGPD',
    path: ['accepts_legal_use']
  }
).refine(
  (data) => data.accepts_site_publication === true,
  {
    message: 'Vous devez accepter la publication de votre témoignage sur le site',
    path: ['accepts_site_publication']
  }
)

export type TestimonyInput = z.infer<typeof testimonySchema>

// Member Validation Schema
export const memberSchema = z.object({
  // Step 1: Personal info
  civility: z.enum(['M.', 'Mme', 'Autre']),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  birthDate: z.string().optional(),
  email: z.string().email('Email invalide').max(90, 'Email trop long (max 90 caractères)'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  address: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  postalCode: z.string().regex(/^\d{5}$/, 'Code postal invalide'),
  city: z.enum(['Ledenon', 'Cabrières', 'Saint-Gervasy', 'Autre']),

  // Step 2: User profile
  userType: z.enum(['student', 'parent', 'worker', 'senior', 'pmr', 'other']),
  schoolName: z.string().optional(),
  schoolSection: z.string().optional(),
  usageBefore: z.enum(['daily', '2-3_per_week', 'weekly', 'occasional']).optional(),
  usageAfter: z.enum(['car', 'correspondences', 'depends_on_someone', 'stopped']).optional(),

  // Step 3: Membership
  membershipType: z.enum(['reduced', 'normal', 'support', 'custom']),
  membershipFee: z.number().positive('Le montant de la cotisation doit être positif'),

  // Step 4: Engagement
  wantsToParticipate: z.boolean(),
  participationAreas: z.array(z.string()),
  acceptsNewsletter: z.boolean(),
  acceptsTestimonyPublication: z.boolean(),
  acceptsMediaContact: z.boolean(),
  acceptsActionSolicitation: z.boolean()
})

export type MemberInput = z.infer<typeof memberSchema>

// Contact Form Validation Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide').max(90, 'Email trop long (max 90 caractères)'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères'),
  message: z.string().min(20, 'Le message doit contenir au moins 20 caractères'),
  acceptsContact: z.boolean()
})

export type ContactInput = z.infer<typeof contactSchema>

// Incident Report Validation Schema
export const incidentSchema = z.object({
  incident_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide (format: YYYY-MM-DD)'),
  incident_time: z.string().regex(/^\d{2}:\d{2}$/, 'Heure invalide (format: HH:MM)').optional(),
  incident_type: z.enum(['missed_correspondence', 'delay', 'no_bus', 'accessibility', 'extra_cost', 'other']),
  bus_line: z.string().optional(),
  description: z.string().min(20, 'La description doit contenir au moins 20 caractères'),
  consequence: z.enum(['late_work', 'missed_appointment', 'taxi_cost', 'abandoned_trip', 'other']).optional(),
  consequence_details: z.string().optional(),
  taxi_cost: z.number().positive().optional(),
  email: z.string().email('Email invalide').max(90, 'Email trop long (max 90 caractères)').optional()
})

export type IncidentInput = z.infer<typeof incidentSchema>

// News Validation Schema
export const newsSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  slug: z.string().min(3, 'Le slug doit contenir au moins 3 caractères').regex(/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'),
  excerpt: z.string().optional(),
  content: z.string().min(50, 'Le contenu doit contenir au moins 50 caractères'),
  cover_image_url: z.string().url('URL invalide').optional(),
  author_id: z.string().uuid('ID auteur invalide').optional(),
  is_published: z.boolean().optional().default(false),
  published_at: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional()
})

export type NewsInput = z.infer<typeof newsSchema>

// Donation Validation Schema
export const donationSchema = z.object({
  email: z.string().email('Email invalide').max(90, 'Email trop long (max 90 caractères)'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  amount: z.number().positive('Le montant doit être positif').min(1, 'Le montant minimum est de 1€'),
  type: z.enum(['one_time', 'monthly']),
  accepts_newsletter: z.boolean(),
  message: z.string().optional()
})

export type DonationInput = z.infer<typeof donationSchema>

// Newsletter Subscription Validation Schema
export const newsletterSchema = z.object({
  email: z.string().email('Email invalide').max(90, 'Email trop long (max 90 caractères)'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  source: z.string().default('footer')
})

export type NewsletterInput = z.infer<typeof newsletterSchema>

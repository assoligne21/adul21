import { pgTable, uuid, text, timestamp, integer, boolean, decimal, json, varchar } from 'drizzle-orm/pg-core'

// Testimonies Table
export const testimonies = pgTable('testimonies', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  // Author
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  city: varchar('city', { length: 100 }).notNull(),
  ageRange: varchar('age_range', { length: 50 }).notNull(),

  // Profile
  userType: varchar('user_type', { length: 50 }).notNull(),
  schoolName: varchar('school_name', { length: 255 }),
  schoolSection: varchar('school_section', { length: 255 }),
  workplace: varchar('workplace', { length: 255 }),
  workHours: varchar('work_hours', { length: 255 }),

  // Usage before
  usageBeforeFrequency: varchar('usage_before_frequency', { length: 50 }),
  usageBeforeTime: integer('usage_before_time'),
  usageBeforeDestination: text('usage_before_destination'),
  usageBeforeCost: decimal('usage_before_cost', { precision: 10, scale: 2 }),

  // Usage after
  usageAfterSolution: varchar('usage_after_solution', { length: 50 }),
  usageAfterTime: integer('usage_after_time'),
  usageAfterCorrespondences: integer('usage_after_correspondences'),
  usageAfterWaitTime: integer('usage_after_wait_time'),
  usageAfterCost: decimal('usage_after_cost', { precision: 10, scale: 2 }),
  usageAfterDistance: decimal('usage_after_distance', { precision: 10, scale: 2 }),
  problems: json('problems').$type<string[]>(),
  missedCorrespondencesPerMonth: integer('missed_correspondences_per_month'),

  // Testimony
  testimonyText: text('testimony_text').notNull(),
  concreteExample: text('concrete_example'),

  // Publication
  publicationPreference: varchar('publication_preference', { length: 50 }).notNull(),
  acceptsSitePublication: boolean('accepts_site_publication').notNull().default(false),
  acceptsLegalUse: boolean('accepts_legal_use').notNull().default(false),
  acceptsAssociationContact: boolean('accepts_association_contact').notNull().default(false),
  acceptsMediaContact: boolean('accepts_media_contact').notNull().default(false),
  acceptsOralTestimony: boolean('accepts_oral_testimony').notNull().default(false),

  // Photo
  photoUrl: text('photo_url'),

  // Moderation
  moderationStatus: varchar('moderation_status', { length: 50 }).notNull().default('pending'),
  moderationNotes: text('moderation_notes'),
  moderatedBy: varchar('moderated_by', { length: 255 }),
  moderatedAt: timestamp('moderated_at'),

  // Statistics
  viewsCount: integer('views_count').notNull().default(0),
  reactionsCount: integer('reactions_count').notNull().default(0),
  sharesCount: integer('shares_count').notNull().default(0),

  // Flags
  isPublished: boolean('is_published').notNull().default(false),
  isFeatured: boolean('is_featured').notNull().default(false)
})

// Members Table
export const members = pgTable('members', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  // Personal info
  civility: varchar('civility', { length: 10 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  birthDate: varchar('birth_date', { length: 10 }),

  // Contact
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  address: text('address').notNull(),
  postalCode: varchar('postal_code', { length: 10 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),

  // Profile
  userType: varchar('user_type', { length: 50 }).notNull(),
  schoolName: varchar('school_name', { length: 255 }),
  schoolSection: varchar('school_section', { length: 255 }),
  usageBefore: varchar('usage_before', { length: 50 }),
  usageAfter: varchar('usage_after', { length: 50 }),

  // Membership
  membershipFee: decimal('membership_fee', { precision: 10, scale: 2 }).notNull(),
  membershipType: varchar('membership_type', { length: 50 }).notNull(),
  membershipStatus: varchar('membership_status', { length: 50 }).notNull().default('pending'),
  membershipStartDate: timestamp('membership_start_date'),
  membershipEndDate: timestamp('membership_end_date'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),

  // Engagement
  wantsToParticipate: boolean('wants_to_participate').notNull().default(false),
  participationAreas: json('participation_areas').$type<string[]>(),

  // Consents
  acceptsNewsletter: boolean('accepts_newsletter').notNull().default(false),
  acceptsTestimonyPublication: boolean('accepts_testimony_publication').notNull().default(false),
  acceptsMediaContact: boolean('accepts_media_contact').notNull().default(false),
  acceptsActionSolicitation: boolean('accepts_action_solicitation').notNull().default(false),

  // Admin
  isAdmin: boolean('is_admin').notNull().default(false),
  notes: text('notes')
})

// News Table
export const news = pgTable('news', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImageUrl: text('cover_image_url'),

  authorId: uuid('author_id'),

  isPublished: boolean('is_published').notNull().default(false),
  publishedAt: timestamp('published_at'),

  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),

  viewsCount: integer('views_count').notNull().default(0)
})

// Donations Table
export const donations = pgTable('donations', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),

  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),

  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('EUR'),
  paymentMethod: varchar('payment_method', { length: 50 }),

  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),

  status: varchar('status', { length: 50 }).notNull().default('pending'),
  completedAt: timestamp('completed_at'),

  receiptSent: boolean('receipt_sent').notNull().default(false),
  receiptSentAt: timestamp('receipt_sent_at'),

  acceptsNewsletter: boolean('accepts_newsletter').notNull().default(false),
  message: text('message')
})

// Subscriptions Table
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),

  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('EUR'),
  billingDay: integer('billing_day').notNull(),

  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }).notNull().unique(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).notNull(),

  status: varchar('status', { length: 50 }).notNull().default('active'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),

  acceptsNewsletter: boolean('accepts_newsletter').notNull().default(false)
})

// Incidents Table
export const incidents = pgTable('incidents', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),

  incidentDate: varchar('incident_date', { length: 10 }).notNull(),
  incidentTime: varchar('incident_time', { length: 5 }),

  incidentType: varchar('incident_type', { length: 100 }).notNull(),
  busLine: varchar('bus_line', { length: 50 }),
  description: text('description').notNull(),

  consequence: varchar('consequence', { length: 100 }),
  consequenceDetails: text('consequence_details'),
  taxiCost: decimal('taxi_cost', { precision: 10, scale: 2 }),

  email: varchar('email', { length: 255 })
})

// Downloads Table
export const downloads = pgTable('downloads', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),

  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(),

  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),

  countryCode: varchar('country_code', { length: 2 }),
  city: varchar('city', { length: 100 })
})

// Newsletter Subscribers Table
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),

  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),

  isActive: boolean('is_active').notNull().default(true),
  unsubscribedAt: timestamp('unsubscribed_at'),

  source: varchar('source', { length: 50 }).notNull() // 'footer', 'adhesion', 'donation', etc.
})

// Contact Messages Table
export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),

  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: text('message').notNull(),
  acceptsContact: boolean('accepts_contact').notNull().default(false),

  status: varchar('status', { length: 50 }).notNull().default('new'), // 'new', 'read', 'replied', 'archived'
  repliedAt: timestamp('replied_at'),
  repliedBy: varchar('replied_by', { length: 255 }),
  replyNotes: text('reply_notes')
})

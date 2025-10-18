import { eq, or } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '~/server/database/connection'
import { testimonies, members, newsletterSubscribers } from '~/server/database/schema'
import { apiLogger, logError } from '~/server/utils/logger'

const dataAccessSchema = z.object({
  email: z.string().email('Email invalide')
})

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Get database connection with runtime config
    const db = getDb(event)

    // Validate request
    const body = await readBody(event)
    const { email } = dataAccessSchema.parse(body)

    apiLogger.info({ email }, 'RGPD data access request')

    // Search for user data across all tables
    const [userTestimonies, userMemberships, userNewsletter] = await Promise.all([
      // Testimonies
      db
        .select()
        .from(testimonies)
        .where(eq(testimonies.email, email)),

      // Memberships
      db
        .select()
        .from(members)
        .where(eq(members.email, email)),

      // Newsletter subscriptions
      db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, email))
    ])

    // Compile all data
    const userData = {
      email,
      requestDate: new Date().toISOString(),
      testimonies: userTestimonies.map(t => ({
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        city: t.city,
        userType: t.userType,
        testimonyText: t.testimonyText,
        concreteExample: t.concreteExample,
        createdAt: t.createdAt,
        moderationStatus: t.moderationStatus,
        isPublished: t.isPublished,
        viewsCount: t.viewsCount,
        // Include all usage data
        usageBeforeFrequency: t.usageBeforeFrequency,
        usageBeforeTime: t.usageBeforeTime,
        usageBeforeCost: t.usageBeforeCost,
        usageBeforeDestination: t.usageBeforeDestination,
        usageAfterSolution: t.usageAfterSolution,
        usageAfterTime: t.usageAfterTime,
        usageAfterCorrespondences: t.usageAfterCorrespondences,
        usageAfterWaitTime: t.usageAfterWaitTime,
        usageAfterCost: t.usageAfterCost,
        usageAfterDistance: t.usageAfterDistance
      })),

      memberships: userMemberships.map(m => ({
        id: m.id,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        phone: m.phone,
        address: m.address,
        postalCode: m.postalCode,
        city: m.city,
        membershipType: m.membershipType,
        amount: m.amount,
        paymentStatus: m.paymentStatus,
        paymentDate: m.paymentDate,
        createdAt: m.createdAt,
        status: m.status
      })),

      newsletter: userNewsletter.map(n => ({
        id: n.id,
        email: n.email,
        firstName: n.firstName,
        lastName: n.lastName,
        isActive: n.isActive,
        source: n.source,
        createdAt: n.createdAt,
        unsubscribedAt: n.unsubscribedAt
      })),

      summary: {
        testimoniesCount: userTestimonies.length,
        membershipsCount: userMemberships.length,
        newsletterSubscriptions: userNewsletter.length,
        totalRecords: userTestimonies.length + userMemberships.length + userNewsletter.length
      }
    }

    const duration = Date.now() - startTime
    apiLogger.info(
      {
        email,
        recordsFound: userData.summary.totalRecords,
        duration
      },
      'RGPD data access completed'
    )

    return {
      success: true,
      message: `Nous avons trouvé ${userData.summary.totalRecords} enregistrement(s) associé(s) à votre adresse email.`,
      data: userData
    }
  } catch (error: any) {
    const duration = Date.now() - startTime
    logError(error, { route: '/api/rgpd/data-access', duration })

    if (error?.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email invalide'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la récupération de vos données'
    })
  }
})

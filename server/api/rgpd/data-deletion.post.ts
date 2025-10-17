import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/server/database/connection'
import { testimonies, members, newsletterSubscribers } from '~/server/database/schema'
import { apiLogger, logError } from '~/server/utils/logger'

const dataDeletionSchema = z.object({
  email: z.string().email('Email invalide'),
  confirmDeletion: z.boolean().refine(val => val === true, {
    message: 'Vous devez confirmer la suppression de vos données'
  }),
  reason: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Validate request
    const body = await readBody(event)
    const { email, reason } = dataDeletionSchema.parse(body)

    apiLogger.info({ email, reason }, 'RGPD data deletion request')

    // Delete data from all tables
    const [deletedTestimonies, deletedMembers, deletedNewsletter] = await Promise.all([
      // Delete testimonies
      db
        .delete(testimonies)
        .where(eq(testimonies.email, email))
        .returning({ id: testimonies.id }),

      // Delete memberships
      db
        .delete(members)
        .where(eq(members.email, email))
        .returning({ id: members.id }),

      // Delete newsletter subscriptions
      db
        .delete(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, email))
        .returning({ id: newsletterSubscribers.id })
    ])

    const totalDeleted =
      deletedTestimonies.length + deletedMembers.length + deletedNewsletter.length

    const duration = Date.now() - startTime
    apiLogger.warn(
      {
        email,
        testimoniesDeleted: deletedTestimonies.length,
        membersDeleted: deletedMembers.length,
        newsletterDeleted: deletedNewsletter.length,
        totalDeleted,
        reason,
        duration
      },
      'RGPD data deletion completed'
    )

    return {
      success: true,
      message: `Vos données ont été supprimées avec succès. ${totalDeleted} enregistrement(s) supprimé(s).`,
      data: {
        email,
        deletionDate: new Date().toISOString(),
        deleted: {
          testimonies: deletedTestimonies.length,
          memberships: deletedMembers.length,
          newsletter: deletedNewsletter.length,
          total: totalDeleted
        }
      }
    }
  } catch (error: unknown) {
    const duration = Date.now() - startTime
    logError(error, { route: '/api/rgpd/data-deletion', duration })

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la suppression de vos données'
    })
  }
})

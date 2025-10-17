import { db } from '~/server/database/connection'
import { testimonies } from '~/server/database/schema'
import { testimonySchema } from '~/server/validation/schemas'
import { sanitizePlainText } from '~/server/utils/sanitize'
import { apiLogger, logError } from '~/server/utils/logger'

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = testimonySchema.parse(body)

    apiLogger.debug({ city: validatedData.city, userType: validatedData.user_type }, 'New testimony submission')

    // Sanitize text inputs to prevent XSS attacks
    const sanitizedData = {
      ...validatedData,
      first_name: sanitizePlainText(validatedData.first_name),
      last_name: sanitizePlainText(validatedData.last_name),
      testimony_text: sanitizePlainText(validatedData.testimony_text),
      concrete_example: sanitizePlainText(validatedData.concrete_example),
      school_name: sanitizePlainText(validatedData.school_name),
      school_section: sanitizePlainText(validatedData.school_section),
      workplace: sanitizePlainText(validatedData.workplace),
      work_hours: sanitizePlainText(validatedData.work_hours),
      usage_before_destination: sanitizePlainText(validatedData.usage_before_destination)
    }

    // Insert testimony
    const [newTestimony] = await db.insert(testimonies).values({
      // Personal info (sanitized)
      firstName: sanitizedData.first_name,
      lastName: sanitizedData.last_name,
      ageRange: sanitizedData.age_range,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      city: sanitizedData.city,
      userType: sanitizedData.user_type,
      schoolName: sanitizedData.school_name,
      schoolSection: sanitizedData.school_section,
      workplace: sanitizedData.workplace,
      workHours: sanitizedData.work_hours,

      // Usage before
      usageBeforeFrequency: sanitizedData.usage_before_frequency,
      usageBeforeTime: sanitizedData.usage_before_time,
      usageBeforeCost: sanitizedData.usage_before_cost?.toString(),
      usageBeforeDestination: sanitizedData.usage_before_destination,

      // Usage after
      usageAfterSolution: sanitizedData.usage_after_solution,
      usageAfterTime: sanitizedData.usage_after_time,
      usageAfterCorrespondences: sanitizedData.usage_after_correspondences,
      usageAfterWaitTime: sanitizedData.usage_after_wait_time,
      usageAfterCost: sanitizedData.usage_after_cost?.toString(),
      usageAfterDistance: sanitizedData.usage_after_distance?.toString(),
      problems: sanitizedData.problems,
      missedCorrespondencesPerMonth: sanitizedData.missed_correspondences_per_month,

      // Testimony (sanitized)
      testimonyText: sanitizedData.testimony_text,
      concreteExample: sanitizedData.concrete_example,
      publicationPreference: validatedData.publication_preference,
      acceptsSitePublication: validatedData.accepts_site_publication,
      acceptsLegalUse: validatedData.accepts_legal_use,
      acceptsMediaContact: validatedData.accepts_media_contact,
      acceptsOralTestimony: validatedData.accepts_oral_testimony,
      acceptsAssociationContact: validatedData.accepts_association_contact,

      // Defaults
      moderationStatus: 'pending',
      isPublished: false
    }).returning()

    const duration = Date.now() - startTime
    apiLogger.info(
      {
        testimonyId: newTestimony.id,
        city: newTestimony.city,
        userType: newTestimony.userType,
        duration
      },
      'Testimony created successfully'
    )

    return {
      success: true,
      message: 'Votre témoignage a été enregistré avec succès',
      data: newTestimony
    }
  } catch (error: unknown) {
    const duration = Date.now() - startTime
    logError(error, { route: '/api/testimonies', duration })

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'enregistrement du témoignage'
    })
  }
})

import { db } from '~/server/database/connection'
import { testimonies } from '~/server/database/schema'
import { testimonySchema } from '~/server/validation/schemas'

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = testimonySchema.parse(body)

    // Insert testimony
    const [newTestimony] = await db.insert(testimonies).values({
      // Personal info
      firstName: validatedData.first_name,
      lastName: validatedData.last_name,
      ageRange: validatedData.age_range,
      email: validatedData.email,
      phone: validatedData.phone,
      city: validatedData.city,
      userType: validatedData.user_type,
      schoolName: validatedData.school_name,
      schoolSection: validatedData.school_section,
      workplace: validatedData.workplace,
      workHours: validatedData.work_hours,

      // Usage before
      usageBeforeFrequency: validatedData.usage_before_frequency,
      usageBeforeTime: validatedData.usage_before_time,
      usageBeforeCost: validatedData.usage_before_cost?.toString(),
      usageBeforeDestination: validatedData.usage_before_destination,

      // Usage after
      usageAfterSolution: validatedData.usage_after_solution,
      usageAfterTime: validatedData.usage_after_time,
      usageAfterCorrespondences: validatedData.usage_after_correspondences,
      usageAfterWaitTime: validatedData.usage_after_wait_time,
      usageAfterCost: validatedData.usage_after_cost?.toString(),
      usageAfterDistance: validatedData.usage_after_distance?.toString(),
      problems: validatedData.problems,
      missedCorrespondencesPerMonth: validatedData.missed_correspondences_per_month,

      // Testimony
      testimonyText: validatedData.testimony_text,
      concreteExample: validatedData.concrete_example,
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

    return {
      success: true,
      message: 'Votre témoignage a été enregistré avec succès',
      data: newTestimony
    }
  } catch (error: any) {
    console.error('Error creating testimony:', error)

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

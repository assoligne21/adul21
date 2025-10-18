import { getDb } from '~/server/database/connection'
import { members } from '~/server/database/schema'
import { memberSchema } from '~/server/validation/schemas'

export default defineEventHandler(async (event) => {
  try {
    // Get database connection with runtime config
    const db = getDb(event)

    const body = await readBody(event)
    const validatedData = memberSchema.parse(body)

    // Calculate membership end date (1 year from now)
    const startDate = new Date()
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1)

    // Insert member
    const [newMember] = await db.insert(members).values({
      // Personal info
      civility: validatedData.civility,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      birthDate: validatedData.birthDate,
      email: validatedData.email,
      phone: validatedData.phone,
      address: validatedData.address,
      postalCode: validatedData.postalCode,
      city: validatedData.city,

      // Profile
      userType: validatedData.userType,
      schoolName: validatedData.schoolName,
      schoolSection: validatedData.schoolSection,
      usageBefore: validatedData.usageBefore,
      usageAfter: validatedData.usageAfter,

      // Membership
      membershipFee: validatedData.membershipFee.toString(),
      membershipType: validatedData.membershipType,
      membershipStatus: 'pending', // Will be 'active' after payment
      membershipStartDate: startDate,
      membershipEndDate: endDate,

      // Engagement
      wantsToParticipate: validatedData.wantsToParticipate,
      participationAreas: validatedData.participationAreas,
      acceptsNewsletter: validatedData.acceptsNewsletter,
      acceptsTestimonyPublication: validatedData.acceptsTestimonyPublication,
      acceptsMediaContact: validatedData.acceptsMediaContact,
      acceptsActionSolicitation: validatedData.acceptsActionSolicitation
    }).returning()

    return {
      success: true,
      message: 'Adh�sion enregistr�e avec succ�s',
      data: newMember
    }
  } catch (error: any) {
    console.error('Error creating member:', error)

    if (error?.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Donn�es invalides',
        data: error.errors
      })
    }

    if (error?.cause?.code === '23505' || error?.code === '23505') { // Unique constraint violation
      throw createError({
        statusCode: 409,
        statusMessage: 'Un compte avec cet email existe d�j�'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'enregistrement de l\'adh�sion'
    })
  }
})

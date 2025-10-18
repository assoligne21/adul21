import { getDb } from '~/server/database/connection'
import { donations } from '~/server/database/schema'
import { donationSchema } from '~/server/validation/schemas'

export default defineEventHandler(async (event) => {
  const db = getDb(event)

  try {
    const body = await readBody(event)
    const validatedData = donationSchema.parse(body)

    const [newDonation] = await db.insert(donations).values({
      email: validatedData.email,
      firstName: validatedData.first_name,
      lastName: validatedData.last_name,
      amount: validatedData.amount.toString(),
      currency: 'EUR',
      status: 'pending',
      acceptsNewsletter: validatedData.accepts_newsletter,
      message: validatedData.message
    }).returning()

    return {
      success: true,
      message: 'Don enregistr� avec succ�s',
      data: newDonation
    }
  } catch (error: unknown) {
    console.error('Error creating donation:', error)

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Donn�es invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'enregistrement du don'
    })
  }
})

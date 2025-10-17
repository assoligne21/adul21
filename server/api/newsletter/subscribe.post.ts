import { db } from '~/server/database/connection'
import { newsletterSubscribers } from '~/server/database/schema'
import { newsletterSchema } from '~/server/validation/schemas'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = newsletterSchema.parse(body)

    const [newSubscriber] = await db.insert(newsletterSubscribers).values({
      email: validatedData.email,
      firstName: validatedData.first_name,
      lastName: validatedData.last_name,
      source: validatedData.source,
      isActive: true
    }).returning()

    return {
      success: true,
      message: 'Inscription � la newsletter r�ussie',
      data: newSubscriber
    }
  } catch (error: unknown) {
    console.error('Error subscribing to newsletter:', error)

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Donn�es invalides',
        data: error.errors
      })
    }

    if (error.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cet email est d�j� inscrit � la newsletter'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'inscription � la newsletter'
    })
  }
})

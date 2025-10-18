import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '~/server/database/connection'
import { contactMessages } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'

// Validation schema for contact message update
const updateContactSchema = z.object({
  status: z.enum(['new', 'read', 'archived']).optional()
})

export default defineEventHandler(async (event) => {
  // Require admin authentication
  await requireAuth(event)
  const db = getDb(event)

  // Get message ID from URL
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID du message requis'
    })
  }

  try {
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = updateContactSchema.parse(body)

    // Check if message exists
    const [existingMessage] = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id))
      .limit(1)

    if (!existingMessage) {
      throw createError({
        statusCode: 404,
        message: 'Message non trouvé'
      })
    }

    // Update the message
    const [updatedMessage] = await db
      .update(contactMessages)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(contactMessages.id, id))
      .returning()

    return {
      success: true,
      message: 'Message mis à jour avec succès',
      data: updatedMessage
    }
  } catch (error) {
    console.error('Error updating contact message:', error)

    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Données invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la mise à jour du message'
    })
  }
})

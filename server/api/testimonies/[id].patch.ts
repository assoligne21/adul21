import { eq } from 'drizzle-orm'
import { db } from '~/server/database/connection'
import { testimonies } from '~/server/database/schema'
import { z } from 'zod'

// Partial schema for updates
const updateTestimonySchema = z.object({
  moderation_status: z.enum(['pending', 'approved', 'rejected', 'needs_modification']).optional(),
  moderation_notes: z.string().optional(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  views_count: z.number().int().optional(),
  reactions_count: z.number().int().optional(),
  shares_count: z.number().int().optional()
})

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID du témoignage manquant'
      })
    }

    const body = await readBody(event)
    const validatedData = updateTestimonySchema.parse(body)

    // Build update object
    const updateData: any = {}

    if (validatedData.moderation_status !== undefined) {
      updateData.moderationStatus = validatedData.moderation_status
      updateData.moderatedAt = new Date()
    }

    if (validatedData.moderation_notes !== undefined) {
      updateData.moderationNotes = validatedData.moderation_notes
    }

    if (validatedData.is_published !== undefined) {
      updateData.isPublished = validatedData.is_published
    }

    if (validatedData.is_featured !== undefined) {
      updateData.isFeatured = validatedData.is_featured
    }

    if (validatedData.views_count !== undefined) {
      updateData.viewsCount = validatedData.views_count
    }

    if (validatedData.reactions_count !== undefined) {
      updateData.reactionsCount = validatedData.reactions_count
    }

    if (validatedData.shares_count !== undefined) {
      updateData.sharesCount = validatedData.shares_count
    }

    updateData.updatedAt = new Date()

    // Update testimony
    const [updatedTestimony] = await db
      .update(testimonies)
      .set(updateData)
      .where(eq(testimonies.id, id))
      .returning()

    if (!updatedTestimony) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Témoignage introuvable'
      })
    }

    return {
      success: true,
      message: 'Témoignage mis à jour avec succès',
      data: updatedTestimony
    }
  } catch (error: any) {
    console.error('Error updating testimony:', error)

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la mise à jour'
    })
  }
})

import { eq } from 'drizzle-orm'
import { db } from '~/server/database/connection'
import { members } from '~/server/database/schema'
import { z } from 'zod'

// Partial schema for updates
const updateMemberSchema = z.object({
  membership_status: z.enum(['pending', 'active', 'expired', 'cancelled']).optional(),
  membership_end_date: z.string().optional(),
  stripe_customer_id: z.string().optional(),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
  is_admin: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de l\'adhérent manquant'
      })
    }

    const body = await readBody(event)
    const validatedData = updateMemberSchema.parse(body)

    // Build update object
    const updateData: any = {}

    if (validatedData.membership_status !== undefined) {
      updateData.membershipStatus = validatedData.membership_status
    }

    if (validatedData.membership_end_date !== undefined) {
      updateData.membershipEndDate = new Date(validatedData.membership_end_date)
    }

    if (validatedData.stripe_customer_id !== undefined) {
      updateData.stripeCustomerId = validatedData.stripe_customer_id
    }

    if (validatedData.payment_method !== undefined) {
      updateData.paymentMethod = validatedData.payment_method
    }

    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes
    }

    if (validatedData.is_admin !== undefined) {
      updateData.isAdmin = validatedData.is_admin
    }

    updateData.updatedAt = new Date()

    // Update member
    const [updatedMember] = await db
      .update(members)
      .set(updateData)
      .where(eq(members.id, id))
      .returning()

    if (!updatedMember) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Adhérent introuvable'
      })
    }

    return {
      success: true,
      message: 'Adhérent mis à jour avec succès',
      data: updatedMember
    }
  } catch (error: any) {
    console.error('Error updating member:', error)

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

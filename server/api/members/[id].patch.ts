import { eq } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { members } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'
import { sanitizeSimpleHTML } from '~/server/utils/sanitize'
import { z } from 'zod'
import type { ErrorWithMessage } from '~/types/common'

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
  // Require admin authentication
  await requireAuth(event)

  // Get database connection with runtime config
  const db = getDb(event)

  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de l\'adh�rent manquant'
      })
    }

    const body = await readBody(event)
    const validatedData = updateMemberSchema.parse(body)

    // Build update object
    const updateData: Partial<typeof members.$inferInsert> = {}

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
      // Sanitize notes (allow basic HTML for admin formatting)
      updateData.notes = sanitizeSimpleHTML(validatedData.notes)
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
        statusMessage: 'Adh�rent introuvable'
      })
    }

    return {
      success: true,
      message: 'Adh�rent mis � jour avec succ�s',
      data: updatedMember
    }
  } catch (error: unknown) {
    console.error('Error updating member:', error)

    const err = error as ErrorWithMessage

    if (err.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: err.errors
      })
    }

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Erreur lors de la mise à jour'
    })
  }
})

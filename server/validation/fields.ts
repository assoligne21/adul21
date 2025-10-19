import { z } from 'zod'

/**
 * Optional phone field validation
 * - Accepts empty string, undefined, or null
 * - Transforms empty strings to undefined
 * - Validates length (10-20 characters) only if value is provided
 *
 * Usage: For forms where phone is optional (pre-members, contact, testimonies)
 */
export const optionalPhoneField = z.string()
  .default('')
  .transform(val => val === '' ? undefined : val)
  .refine(val => {
    if (!val) return true
    return val.length >= 10 && val.length <= 20
  }, { message: 'Le téléphone doit contenir entre 10 et 20 caractères' })

/**
 * Required phone field validation
 * - Phone number is mandatory
 * - Must be between 10 and 20 characters
 *
 * Usage: For forms where phone is required (membership)
 */
export const requiredPhoneField = z.string()
  .min(10, 'Le téléphone doit contenir au moins 10 caractères')
  .max(20, 'Le téléphone ne peut pas dépasser 20 caractères')

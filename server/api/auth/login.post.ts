import { eq } from 'drizzle-orm'
import { db } from '~/server/database/connection'
import { adminUsers } from '~/server/database/schema'
import { verifyPassword } from '~/server/utils/hash'
import { createToken, setTokenCookie } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email et mot de passe requis'
    })
  }

  // Find admin user
  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1)

  if (!admin) {
    throw createError({
      statusCode: 401,
      message: 'Email ou mot de passe incorrect'
    })
  }

  if (!admin.isActive) {
    throw createError({
      statusCode: 403,
      message: 'Compte désactivé'
    })
  }

  // Verify password
  const valid = await verifyPassword(password, admin.passwordHash)

  if (!valid) {
    throw createError({
      statusCode: 401,
      message: 'Email ou mot de passe incorrect'
    })
  }

  // Update last login
  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsers.id, admin.id))

  // Create JWT token
  const token = createToken({
    userId: admin.id,
    email: admin.email,
    name: admin.name
  })

  // Set cookie
  setTokenCookie(event, token)

  return {
    success: true,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name
    }
  }
})

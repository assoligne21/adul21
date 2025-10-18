import { eq } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { adminUsers } from '~/server/database/schema'
import { verifyPassword } from '~/server/utils/hash'
import { createToken, setTokenCookie } from '~/server/utils/jwt'
import { logAuth, logError } from '~/server/utils/logger'

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      logAuth('auth_failure', undefined, email, { reason: 'missing_credentials' })
      throw createError({
        statusCode: 400,
        message: 'Email et mot de passe requis'
      })
    }

    // Get database connection
    const db = getDb(event)

    // Find admin user
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1)

    if (!admin) {
      logAuth('auth_failure', undefined, email, { reason: 'user_not_found' })
      throw createError({
        statusCode: 401,
        message: 'Email ou mot de passe incorrect'
      })
    }

    if (!admin.isActive) {
      logAuth('auth_failure', admin.id, email, { reason: 'account_disabled' })
      throw createError({
        statusCode: 403,
        message: 'Compte désactivé'
      })
    }

    // Verify password
    const valid = await verifyPassword(password, admin.passwordHash)

    if (!valid) {
      logAuth('auth_failure', admin.id, email, { reason: 'invalid_password' })
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

    const duration = Date.now() - startTime
    logAuth('login', admin.id, email, { duration })

    return {
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    }
  } catch (error: unknown) {
    logError(error, { route: '/api/auth/login', duration: Date.now() - startTime })
    throw error
  }
})

/**
 * JWT authentication utilities
 *
 * Handles JSON Web Token creation, verification, and cookie management
 * for admin authentication. Uses httpOnly cookies for security.
 *
 * @module server/utils/jwt
 */

import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

/**
 * JWT payload structure for admin users
 */
export interface JWTPayload {
  /** Unique user identifier */
  userId: string
  /** User email address */
  email: string
  /** User display name */
  name: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-me'
const JWT_EXPIRES_IN = '7d' // 7 days

/**
 * Create a signed JWT token
 *
 * @param payload - User data to encode in token
 * @returns Signed JWT string valid for 7 days
 *
 * @example
 * ```ts
 * const token = createToken({
 *   userId: '123',
 *   email: 'admin@adul21.fr',
 *   name: 'Admin'
 * })
 * ```
 */
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Verify and decode a JWT token
 *
 * @param token - JWT string to verify
 * @returns Decoded payload if valid, null if invalid or expired
 *
 * @example
 * ```ts
 * const payload = verifyToken(token)
 * if (payload) {
 *   console.log(`User ${payload.name} authenticated`)
 * }
 * ```
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Extract JWT token from HTTP cookie
 *
 * @param event - Nuxt H3 event object
 * @returns Token string if found, null otherwise
 *
 * @example
 * ```ts
 * const token = getTokenFromCookie(event)
 * ```
 */
export function getTokenFromCookie(event: H3Event): string | null {
  const cookies = parseCookies(event)
  return cookies.admin_token || null
}

/**
 * Set JWT token as httpOnly cookie
 *
 * Cookie is:
 * - httpOnly (prevents XSS)
 * - secure in production (HTTPS only)
 * - sameSite lax (CSRF protection)
 * - 7 days expiration
 *
 * @param event - Nuxt H3 event object
 * @param token - JWT token to store
 *
 * @example
 * ```ts
 * const token = createToken(payload)
 * setTokenCookie(event, token)
 * ```
 */
export function setTokenCookie(event: H3Event, token: string) {
  setCookie(event, 'admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
}

/**
 * Clear authentication cookie (logout)
 *
 * @param event - Nuxt H3 event object
 *
 * @example
 * ```ts
 * clearTokenCookie(event)
 * ```
 */
export function clearTokenCookie(event: H3Event) {
  deleteCookie(event, 'admin_token', {
    path: '/'
  })
}

/**
 * Middleware to require authentication
 *
 * Extracts and verifies JWT from cookie. Throws 401 error if:
 * - No token found
 * - Token is invalid
 * - Token is expired
 *
 * @param event - Nuxt H3 event object
 * @returns Decoded JWT payload if authenticated
 * @throws {H3Error} 401 Unauthorized if not authenticated
 *
 * @example
 * ```ts
 * export default defineEventHandler(async (event) => {
 *   const user = await requireAuth(event)
 *   // User is authenticated, proceed
 * })
 * ```
 */
export async function requireAuth(event: H3Event): Promise<JWTPayload> {
  const token = getTokenFromCookie(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Non authentifié'
    })
  }

  const payload = verifyToken(token)

  if (!payload) {
    throw createError({
      statusCode: 401,
      message: 'Token invalide ou expiré'
    })
  }

  return payload
}

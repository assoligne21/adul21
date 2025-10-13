import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

export interface JWTPayload {
  userId: string
  email: string
  name: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-me'
const JWT_EXPIRES_IN = '7d' // 7 days

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export function getTokenFromCookie(event: H3Event): string | null {
  const cookies = parseCookies(event)
  return cookies.admin_token || null
}

export function setTokenCookie(event: H3Event, token: string) {
  setCookie(event, 'admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
}

export function clearTokenCookie(event: H3Event) {
  deleteCookie(event, 'admin_token', {
    path: '/'
  })
}

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

import { clearTokenCookie } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  clearTokenCookie(event)

  return {
    success: true,
    message: 'Déconnexion réussie'
  }
})

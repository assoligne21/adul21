import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  return {
    user
  }
})

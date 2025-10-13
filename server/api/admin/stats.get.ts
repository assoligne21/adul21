import { eq, count } from 'drizzle-orm'
import { db } from '~/server/database/connection'
import { testimonies, members, contactMessages, news } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Require authentication
  await requireAuth(event)

  // Count testimonies by status
  const [totalTestimonies] = await db.select({ count: count() }).from(testimonies)
  const [pendingTestimonies] = await db
    .select({ count: count() })
    .from(testimonies)
    .where(eq(testimonies.moderationStatus, 'pending'))
  const [publishedTestimonies] = await db
    .select({ count: count() })
    .from(testimonies)
    .where(eq(testimonies.isPublished, true))

  // Count members
  const [totalMembers] = await db.select({ count: count() }).from(members)

  // Count unread messages
  const [unreadMessages] = await db
    .select({ count: count() })
    .from(contactMessages)
    .where(eq(contactMessages.status, 'new'))

  // Count news
  const [totalNews] = await db.select({ count: count() }).from(news)
  const [publishedNews] = await db
    .select({ count: count() })
    .from(news)
    .where(eq(news.isPublished, true))

  return {
    testimonies: {
      total: totalTestimonies.count,
      pending: pendingTestimonies.count,
      published: publishedTestimonies.count
    },
    members: {
      total: totalMembers.count
    },
    messages: {
      unread: unreadMessages.count
    },
    news: {
      total: totalNews.count,
      published: publishedNews.count
    }
  }
})

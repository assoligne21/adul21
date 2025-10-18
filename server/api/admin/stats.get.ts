import { eq, count } from 'drizzle-orm'
import { getDb } from '~/server/database/connection'
import { testimonies, members, contactMessages, news, preMembers, newsletterSubscribers } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Require authentication
  await requireAuth(event)

  // Get database connection
  const db = getDb(event)

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

  // Count pre-members (supporters)
  const [totalPreMembers] = await db.select({ count: count() }).from(preMembers)
  const [wantToBeMembers] = await db
    .select({ count: count() })
    .from(preMembers)
    .where(eq(preMembers.wantsToBecomeMember, true))
  const [wantToVolunteer] = await db
    .select({ count: count() })
    .from(preMembers)
    .where(eq(preMembers.wantsToVolunteer, true))

  // Count newsletter subscribers
  const [totalNewsletterSubscribers] = await db.select({ count: count() }).from(newsletterSubscribers)
  const [activeSubscribers] = await db
    .select({ count: count() })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.isActive, true))

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
    preMembers: {
      total: totalPreMembers.count,
      wantToBeMembers: wantToBeMembers.count,
      wantToVolunteer: wantToVolunteer.count
    },
    newsletter: {
      total: totalNewsletterSubscribers.count,
      active: activeSubscribers.count,
      unsubscribed: totalNewsletterSubscribers.count - activeSubscribers.count
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

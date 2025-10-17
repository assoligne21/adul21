import { eq } from 'drizzle-orm'
import { db } from '~/server/database/connection'
import { news, testimonies } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  const baseUrl = 'https://www.adul21.fr'

  // Static pages
  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'daily' }, // Homepage
    { url: '/arguments-juridiques', priority: 0.9, changefreq: 'weekly' },
    { url: '/actualites', priority: 0.9, changefreq: 'daily' },
    { url: '/temoignages', priority: 0.9, changefreq: 'daily' },
    { url: '/impacts', priority: 0.8, changefreq: 'weekly' },
    { url: '/a-propos', priority: 0.7, changefreq: 'monthly' },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' },
    { url: '/adhesion', priority: 0.8, changefreq: 'monthly' },
    { url: '/don', priority: 0.8, changefreq: 'monthly' },
    { url: '/telechargements', priority: 0.7, changefreq: 'weekly' },
    { url: '/mentions-legales', priority: 0.3, changefreq: 'yearly' },
    { url: '/politique-confidentialite', priority: 0.3, changefreq: 'yearly' }
  ]

  // Fetch published news
  const publishedNews = await db
    .select({
      slug: news.slug,
      updatedAt: news.updatedAt
    })
    .from(news)
    .where(eq(news.isPublished, true))
    .orderBy(news.publishedAt)

  // Fetch published testimonies
  const publishedTestimonies = await db
    .select({
      id: testimonies.id,
      updatedAt: testimonies.updatedAt
    })
    .from(testimonies)
    .where(eq(testimonies.isPublished, true))
    .orderBy(testimonies.createdAt)

  // Build sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
${publishedNews
  .map(
    article => `  <url>
    <loc>${baseUrl}/actualites/${article.slug}</loc>
    <lastmod>${new Date(article.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
${publishedTestimonies
  .map(
    testimony => `  <url>
    <loc>${baseUrl}/temoignages/${testimony.id}</loc>
    <lastmod>${new Date(testimony.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  // Set appropriate headers
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache for 1 hour

  return sitemap
})

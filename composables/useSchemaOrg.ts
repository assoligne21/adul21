export function useSchemaOrg() {
  const config = useRuntimeConfig()
  const baseUrl = 'https://www.adul21.fr'

  // Organization schema for ADUL21
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ADUL21 - Association de Défense des Usagers de la Ligne 21',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'Association de défense des usagers de la ligne 21 reliant Ledenon, Cabrières et Saint-Gervasy à Nîmes',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
      addressRegion: 'Occitanie',
      addressLocality: 'Gard'
    },
    sameAs: [
      // Add social media links when available
    ]
  }

  // WebSite schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ADUL21',
    url: baseUrl,
    description:
      'Site officiel de l\'ADUL21 : mobilisation contre la suppression de la ligne de bus directe 21',
    publisher: {
      '@type': 'Organization',
      name: 'ADUL21'
    }
  }

  // Article schema for news
  function articleSchema(article: {
    title: string
    slug: string
    excerpt: string
    content: string
    publishedAt: string
    updatedAt: string
    author?: string
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      articleBody: article.content,
      url: `${baseUrl}/actualites/${article.slug}`,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Organization',
        name: article.author || 'ADUL21'
      },
      publisher: {
        '@type': 'Organization',
        name: 'ADUL21',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`
        }
      }
    }
  }

  // Breadcrumb schema
  function breadcrumbSchema(items: Array<{ name: string; url?: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url ? `${baseUrl}${item.url}` : undefined
      }))
    }
  }

  // FAQ schema
  function faqSchema(questions: Array<{ question: string; answer: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer
        }
      }))
    }
  }

  // Review schema for testimonies
  function reviewSchema(testimony: {
    id: string
    author: string
    text: string
    rating?: number
    date: string
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Service',
        name: 'Ligne de bus 21 Nîmes - Ledenon/Cabrières/Saint-Gervasy'
      },
      author: {
        '@type': 'Person',
        name: testimony.author
      },
      reviewBody: testimony.text,
      reviewRating: testimony.rating
        ? {
            '@type': 'Rating',
            ratingValue: testimony.rating,
            bestRating: 5
          }
        : undefined,
      datePublished: testimony.date
    }
  }

  // Contact schema
  function contactPageSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      url: `${baseUrl}/contact`,
      name: 'Contactez l\'ADUL21',
      description: 'Contactez l\'association ADUL21 pour toute question ou suggestion'
    }
  }

  // Add schema to head
  function addSchema(schema: object) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema)
        }
      ]
    })
  }

  return {
    organizationSchema,
    websiteSchema,
    articleSchema,
    breadcrumbSchema,
    faqSchema,
    reviewSchema,
    contactPageSchema,
    addSchema
  }
}

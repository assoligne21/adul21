import { db } from '~/server/database/connection'
import { news } from '~/server/database/schema'
import { newsSchema } from '~/server/validation/schemas'
import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Require admin authentication
  await requireAuth(event)

  try {
    const body = await readBody(event)
    const validatedData = newsSchema.parse(body)

    const [newNews] = await db.insert(news).values({
      title: validatedData.title,
      slug: validatedData.slug,
      excerpt: validatedData.excerpt,
      content: validatedData.content,
      coverImageUrl: validatedData.cover_image_url,
      authorId: validatedData.author_id,
      isPublished: validatedData.is_published || false,
      publishedAt: validatedData.published_at ? new Date(validatedData.published_at) : null,
      metaTitle: validatedData.meta_title,
      metaDescription: validatedData.meta_description
    }).returning()

    return {
      success: true,
      message: 'Actualit� cr��e avec succ�s',
      data: newNews
    }
  } catch (error: any) {
    console.error('Error creating news:', error)

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Donn�es invalides',
        data: error.errors
      })
    }

    if (error.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Une actualit� avec ce slug existe d�j�'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la cr�ation de l\'actualit�'
    })
  }
})

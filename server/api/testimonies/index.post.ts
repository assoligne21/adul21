import { z } from 'zod'
import { serverSupabaseServiceRole } from '#supabase/server'

// Helper function to get user type label
const getUserTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    student: 'Lycéen',
    parent: 'Parent',
    worker: 'Actif',
    retired: 'Retraité',
    senior: 'Senior',
    pmr: 'Personne à mobilité réduite',
    other: 'Autre'
  }
  return labels[type] || type
}

// Validation schema
const testimonySchema = z.object({
  // Personal info
  first_name: z.string().min(2).max(100),
  last_name: z.string().max(100).optional(),
  age_range: z.enum(['13-17', '18-25', '26-35', '36-50', '51-65', '66+']),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  city: z.enum(['Ledenon', 'Cabrières', 'Saint-Gervasy', 'Autre']),
  user_type: z.enum(['student', 'parent', 'worker', 'retired', 'other']),

  // Student specific
  school_name: z.string().max(200).optional(),
  school_section: z.string().max(100).optional(),

  // Worker specific
  workplace: z.string().max(200).optional(),
  work_hours: z.string().max(100).optional(),

  // Usage before
  usage_before_frequency: z.enum(['daily', '2-3_per_week', 'weekly', 'occasional']),
  usage_before_time: z.number().int().min(0).max(300),
  usage_before_cost: z.number().min(0).max(1000),
  usage_before_destination: z.string().max(200),

  // Usage after
  usage_after_solution: z.enum(['car', 'correspondences', 'depends_on_someone', 'stopped']),
  usage_after_distance: z.number().min(0).max(200).optional(),
  usage_after_cost: z.number().min(0).max(10000).optional(),
  usage_after_num_correspondences: z.number().int().min(0).max(10).optional(),
  usage_after_wait_time: z.number().int().min(0).max(300).optional(),
  usage_after_missed_per_month: z.number().int().min(0).max(100).optional(),

  // Problems
  has_missed_correspondences: z.boolean().optional(),
  has_delays: z.boolean().optional(),
  has_physical_difficulty: z.boolean().optional(),
  has_fear: z.boolean().optional(),
  has_extra_cost: z.boolean().optional(),

  // Testimony text
  testimony_text: z.string().min(200).max(2000),
  concrete_example: z.string().max(500).optional(),

  // Publication preferences
  publication_preference: z.enum(['first_name', 'initials', 'anonymous']),
  accepts_site_publication: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter la publication sur le site'
  }),
  accepts_legal_use: z.boolean().optional(),
  accepts_media_contact: z.boolean().optional(),
  accepts_oral_testimony: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = testimonySchema.parse(body)

    // Get Supabase client with service role
    const supabase = serverSupabaseServiceRole(event)

    // Insert testimony with default moderation status
    const { data: testimony, error } = await supabase
      .from('testimonies')
      .insert({
        ...validatedData,
        moderation_status: 'pending',
        is_published: false,
        views_count: 0,
        ip_address: getRequestIP(event) || null
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de l\'enregistrement du témoignage'
      })
    }

    // Send confirmation email via Gmail SMTP
    try {
      await sendEmail({
        to: validatedData.email,
        subject: 'Votre témoignage a bien été reçu - ADUL21',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .info-box { background: white; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
              .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Merci pour votre témoignage</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${validatedData.first_name}</strong>,</p>

                <p>Nous avons bien reçu votre témoignage concernant la suppression de la ligne 21 directe.</p>

                <p>Votre témoignage est <strong>actuellement en cours de modération</strong> et sera publié prochainement sur notre site web.</p>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #2563eb;">Vos informations :</h3>
                  <ul style="margin: 10px 0;">
                    <li><strong>Commune :</strong> ${validatedData.city}</li>
                    <li><strong>Type d'usager :</strong> ${getUserTypeLabel(validatedData.user_type)}</li>
                    <li><strong>Date de soumission :</strong> ${new Date().toLocaleDateString('fr-FR')}</li>
                  </ul>
                </div>

                <p>Votre témoignage est précieux pour notre mobilisation. Il constitue une preuve concrète de l'impact de cette décision sur le quotidien des habitants.</p>

                <p style="margin-top: 30px;">Nous vous remercions sincèrement pour votre engagement.</p>

                <p><strong>L'équipe ADUL21</strong><br>
                Association de Défense des Usagers de la Ligne 21</p>
              </div>
              <div class="footer">
                <p>Pour toute question : <a href="mailto:assoligne21@gmail.com">assoligne21@gmail.com</a></p>
                <p>Suivez notre mobilisation sur <a href="https://adul21.fr">adul21.fr</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Merci pour votre témoignage

Bonjour ${validatedData.first_name},

Nous avons bien reçu votre témoignage concernant la suppression de la ligne 21 directe.

Votre témoignage est actuellement en cours de modération et sera publié prochainement sur notre site web.

Vos informations :
- Commune : ${validatedData.city}
- Type d'usager : ${getUserTypeLabel(validatedData.user_type)}
- Date de soumission : ${new Date().toLocaleDateString('fr-FR')}

Votre témoignage est précieux pour notre mobilisation. Il constitue une preuve concrète de l'impact de cette décision sur le quotidien des habitants.

Nous vous remercions sincèrement pour votre engagement.

L'équipe ADUL21
Association de Défense des Usagers de la Ligne 21

Pour toute question : assoligne21@gmail.com
Suivez notre mobilisation sur https://adul21.fr
        `
      })
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Failed to send confirmation email:', emailError)
    }

    return {
      success: true,
      message: 'Votre témoignage a été enregistré avec succès',
      testimony: {
        id: testimony.id,
        created_at: testimony.created_at
      }
    }
  } catch (error: any) {
    console.error('Error submitting testimony:', error)

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Une erreur est survenue lors de l\'enregistrement'
    })
  }
})

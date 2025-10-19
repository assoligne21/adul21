import { getDb } from '~/server/database/connection'
import { testimonies } from '~/server/database/schema'
import { testimonySchema } from '~/server/validation/schemas'
import { sanitizePlainText } from '~/server/utils/sanitize'
import { apiLogger, logError } from '~/server/utils/logger'
import { sendEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Get database connection with runtime config
    const db = getDb(event)

    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = testimonySchema.parse(body)

    apiLogger.debug({ city: validatedData.city, userType: validatedData.user_type }, 'New testimony submission')

    // Sanitize text inputs to prevent XSS attacks
    const sanitizedData = {
      ...validatedData,
      first_name: sanitizePlainText(validatedData.first_name),
      last_name: sanitizePlainText(validatedData.last_name),
      testimony_text: sanitizePlainText(validatedData.testimony_text),
      concrete_example: sanitizePlainText(validatedData.concrete_example),
      school_name: sanitizePlainText(validatedData.school_name),
      school_section: sanitizePlainText(validatedData.school_section),
      workplace: sanitizePlainText(validatedData.workplace),
      work_hours: sanitizePlainText(validatedData.work_hours),
      usage_before_destination: sanitizePlainText(validatedData.usage_before_destination)
    }

    // Insert testimony
    const [newTestimony] = await db.insert(testimonies).values({
      // Personal info (sanitized)
      firstName: sanitizedData.first_name,
      lastName: sanitizedData.last_name,
      ageRange: sanitizedData.age_range,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      city: sanitizedData.city,
      userType: sanitizedData.user_type,
      schoolName: sanitizedData.school_name,
      schoolSection: sanitizedData.school_section,
      workplace: sanitizedData.workplace,
      workHours: sanitizedData.work_hours,

      // Usage before
      usageBeforeFrequency: sanitizedData.usage_before_frequency,
      usageBeforeTime: sanitizedData.usage_before_time,
      usageBeforeCost: sanitizedData.usage_before_cost?.toString(),
      usageBeforeDestination: sanitizedData.usage_before_destination,

      // Usage after
      usageAfterSolution: sanitizedData.usage_after_solution,
      usageAfterTime: sanitizedData.usage_after_time,
      usageAfterCorrespondences: sanitizedData.usage_after_correspondences,
      usageAfterWaitTime: sanitizedData.usage_after_wait_time,
      usageAfterCost: sanitizedData.usage_after_cost?.toString(),
      usageAfterDistance: sanitizedData.usage_after_distance?.toString(),
      problems: sanitizedData.problems,
      missedCorrespondencesPerMonth: sanitizedData.missed_correspondences_per_month,

      // Testimony (sanitized)
      testimonyText: sanitizedData.testimony_text,
      concreteExample: sanitizedData.concrete_example,
      publicationPreference: validatedData.publication_preference,
      acceptsSitePublication: validatedData.accepts_site_publication,
      acceptsLegalUse: validatedData.accepts_legal_use,
      acceptsMediaContact: validatedData.accepts_media_contact,
      acceptsOralTestimony: validatedData.accepts_oral_testimony,
      acceptsAssociationContact: validatedData.accepts_association_contact,

      // Defaults
      moderationStatus: 'pending',
      isPublished: false
    }).returning()

    const duration = Date.now() - startTime
    apiLogger.info(
      {
        testimonyId: newTestimony.id,
        city: newTestimony.city,
        userType: newTestimony.userType,
        duration
      },
      'Testimony created successfully'
    )

    // Send notification to admin asynchronously (don't block response)
    sendEmail({
      to: 'assoligne21@gmail.com',
      subject: `[ADUL21] Nouveau témoignage : ${validatedData.first_name} ${validatedData.last_name}`,
      html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .info-box { background: white; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; border-radius: 4px; }
              .label { font-weight: bold; color: #059669; }
              .testimony-box { background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 15px 0; border-radius: 4px; font-style: italic; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">📝 Nouveau témoignage reçu</h2>
              </div>
              <div class="content">
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #059669;">Informations</h3>
                  <p style="margin: 5px 0;"><span class="label">Nom :</span> ${validatedData.first_name} ${validatedData.last_name}</p>
                  <p style="margin: 5px 0;"><span class="label">Email :</span> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
                  <p style="margin: 5px 0;"><span class="label">Téléphone :</span> ${validatedData.phone || 'Non fourni'}</p>
                  <p style="margin: 5px 0;"><span class="label">Commune :</span> ${validatedData.city}</p>
                  <p style="margin: 5px 0;"><span class="label">Profil :</span> ${validatedData.user_type}</p>
                  <p style="margin: 5px 0;"><span class="label">Tranche d'âge :</span> ${validatedData.age_range}</p>
                  <p style="margin: 5px 0;"><span class="label">Préférence publication :</span> ${validatedData.publication_preference}</p>
                </div>

                <div class="testimony-box">
                  <h3 style="margin-top: 0; color: #0369a1;">Témoignage</h3>
                  <p>"${sanitizedData.testimony_text}"</p>
                  ${sanitizedData.concrete_example ? `<p style="margin-top: 10px;"><strong>Exemple concret :</strong> ${sanitizedData.concrete_example}</p>` : ''}
                </div>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #059669;">⚠️ Action requise</h3>
                  <p>Ce témoignage est en attente de modération.</p>
                  <p style="margin-top: 10px;">
                    <a href="https://adul21.fr/admin/temoignages" style="display: inline-block; background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                      Accéder à l'interface de modération
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
    }).catch((emailError) => {
      console.error('Failed to send admin notification:', emailError)
    })

    // Send confirmation to witness asynchronously
    sendEmail({
      to: validatedData.email,
      subject: 'Merci pour votre témoignage - ADUL21',
      html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .info-box { background: white; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
              a { color: #059669; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">📝 Merci ${validatedData.first_name} !</h1>
                <p style="margin: 10px 0 0 0;">Votre témoignage a bien été reçu</p>
              </div>
              <div class="content">
                <h2>Votre témoignage compte</h2>
                <p>Bonjour ${validatedData.first_name},</p>
                <p>Merci d'avoir pris le temps de partager votre expérience concernant la suppression de la ligne 21 directe.</p>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #059669;">📋 Prochaines étapes</h3>
                  <ul style="margin: 10px 0;">
                    <li><strong>Modération :</strong> Votre témoignage sera vérifié par notre équipe dans les prochains jours</li>
                    <li><strong>Publication :</strong> Une fois validé, il sera publié sur notre site selon vos préférences (${validatedData.publication_preference})</li>
                    <li><strong>Notification :</strong> Vous recevrez un email dès que votre témoignage sera publié</li>
                  </ul>
                </div>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #059669;">🎯 Pourquoi votre témoignage est important</h3>
                  <ul style="margin: 10px 0;">
                    <li>Il renforce notre mobilisation collective</li>
                    <li>Il constitue une preuve juridique de l'impact de cette décision</li>
                    <li>Il aide à sensibiliser les élus et les décideurs</li>
                    <li>Il donne une voix aux usagers impactés</li>
                  </ul>
                </div>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #059669;">💪 Continuez à nous soutenir</h3>
                  <ul style="margin: 10px 0;">
                    <li>Partagez notre mobilisation autour de vous</li>
                    <li>Visitez notre site <a href="https://adul21.fr">adul21.fr</a></li>
                    <li>Invitez vos proches à témoigner également</li>
                    <li>Suivez nos actualités et nos actions</li>
                  </ul>
                </div>

                <p><strong>Merci encore pour votre soutien !</strong></p>
                <p>L'équipe ADUL21</p>
              </div>
              <div class="footer">
                <p>ADUL21 - Association de Défense des Usagers de la Ligne 21</p>
                <p>Email : <a href="mailto:assoligne21@gmail.com">assoligne21@gmail.com</a></p>
                <p>Site web : <a href="https://adul21.fr">adul21.fr</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
      text: `
Merci ${validatedData.first_name} !

Votre témoignage a bien été reçu

Bonjour ${validatedData.first_name},

Merci d'avoir pris le temps de partager votre expérience concernant la suppression de la ligne 21 directe.

PROCHAINES ÉTAPES :
- Modération : Votre témoignage sera vérifié par notre équipe dans les prochains jours
- Publication : Une fois validé, il sera publié sur notre site selon vos préférences (${validatedData.publication_preference})
- Notification : Vous recevrez un email dès que votre témoignage sera publié

POURQUOI VOTRE TÉMOIGNAGE EST IMPORTANT :
- Il renforce notre mobilisation collective
- Il constitue une preuve juridique de l'impact de cette décision
- Il aide à sensibiliser les élus et les décideurs
- Il donne une voix aux usagers impactés

CONTINUEZ À NOUS SOUTENIR :
- Partagez notre mobilisation autour de vous
- Visitez notre site adul21.fr
- Invitez vos proches à témoigner également
- Suivez nos actualités et nos actions

Merci encore pour votre soutien !

L'équipe ADUL21
Email : assoligne21@gmail.com
Site web : https://adul21.fr
        `
    }).catch((emailError) => {
      console.error('Failed to send confirmation:', emailError)
    })

    return {
      success: true,
      message: 'Votre témoignage a été enregistré avec succès',
      data: newTestimony
    }
  } catch (error: unknown) {
    const duration = Date.now() - startTime
    logError(error, { route: '/api/testimonies', duration })

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'enregistrement du témoignage'
    })
  }
})

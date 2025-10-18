import { z } from 'zod'
import { sanitizePlainText } from '~/server/utils/sanitize'

// Validation schema
const contactSchema = z.object({
  civility: z.enum(['M.', 'Mme', 'Autre']),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.union([z.string(), z.null(), z.undefined()])
    .transform(val => !val || val === '' ? undefined : val)
    .optional(),
  subject: z.enum(['testimony', 'membership', 'volunteering', 'press', 'legal', 'other']),
  message: z.string().min(10).max(5000),
  acceptsProcessing: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter le traitement de vos données'
  })
})

function getSubjectLabel(subject: string): string {
  const labels: Record<string, string> = {
    testimony: 'Témoignage',
    membership: 'Adhésion',
    volunteering: 'Bénévolat',
    press: 'Demande presse/média',
    legal: 'Question juridique',
    other: 'Autre'
  }
  return labels[subject] || subject
}

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = contactSchema.parse(body)

    // Sanitize inputs to prevent XSS in emails
    const sanitizedFirstName = sanitizePlainText(validatedData.firstName)
    const sanitizedLastName = sanitizePlainText(validatedData.lastName)
    const sanitizedMessage = sanitizePlainText(validatedData.message)
    const sanitizedPhone = validatedData.phone ? sanitizePlainText(validatedData.phone) : ''

    // Get config for admin email
    const config = useRuntimeConfig()

    // Send notification to admin (don't fail if email fails in tests)
    try {
      await sendEmail({
        to: 'assoligne21@gmail.com',
        subject: `[ADUL21] Nouveau message : ${getSubjectLabel(validatedData.subject)}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .info-box { background: white; border-left: 4px solid #2563eb; padding: 15px; margin: 15px 0; border-radius: 4px; }
              .message-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
              .label { font-weight: bold; color: #2563eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">Nouveau message de contact</h2>
              </div>
              <div class="content">
                <div class="info-box">
                  <p style="margin: 5px 0;"><span class="label">De :</span> ${validatedData.civility} ${sanitizedFirstName} ${sanitizedLastName}</p>
                  <p style="margin: 5px 0;"><span class="label">Email :</span> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
                  ${sanitizedPhone ? `<p style="margin: 5px 0;"><span class="label">Téléphone :</span> ${sanitizedPhone}</p>` : ''}
                  <p style="margin: 5px 0;"><span class="label">Sujet :</span> ${getSubjectLabel(validatedData.subject)}</p>
                  <p style="margin: 5px 0;"><span class="label">Date :</span> ${new Date().toLocaleString('fr-FR')}</p>
                </div>

                <div class="message-box">
                  <h3 style="margin-top: 0; color: #1f2937;">Message :</h3>
                  <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
                </div>

                <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                  💡 <strong>Action requise :</strong> Répondez à cette personne dans les 48h ouvrées.
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      })
    } catch (emailError) {
      // Log but don't fail - continue processing
      console.error('Failed to send admin notification:', emailError)
    }

    // Send confirmation to user
    try {
      await sendEmail({
        to: validatedData.email,
        subject: 'Nous avons bien reçu votre message - ADUL21',
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
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
              a { color: #2563eb; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">ADUL21</h1>
                <p style="margin: 10px 0 0 0;">Association de Défense des Usagers de la Ligne 21</p>
              </div>
              <div class="content">
                <h2>Message bien reçu</h2>
                <p>Bonjour ${sanitizedFirstName},</p>
                <p>Nous avons bien reçu votre message concernant : <strong>${getSubjectLabel(validatedData.subject)}</strong></p>

                <div class="info-box">
                  <p style="margin: 0;"><strong>⏱️ Délai de réponse :</strong> Notre équipe vous répondra dans les plus brefs délais, généralement sous 48h ouvrées.</p>
                </div>

                <p>En attendant notre réponse, n'hésitez pas à :</p>
                <ul>
                  <li>Consulter notre site pour en savoir plus sur notre mobilisation</li>
                  <li>Lire les témoignages d'autres habitants impactés</li>
                  <li>Découvrir nos revendications concrètes</li>
                </ul>

                <p>Merci pour votre soutien et votre intérêt pour notre cause !</p>
                <p><strong>L'équipe ADUL21</strong></p>
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
Message bien reçu

Bonjour ${sanitizedFirstName},

Nous avons bien reçu votre message concernant : ${getSubjectLabel(validatedData.subject)}

Notre équipe vous répondra dans les plus brefs délais, généralement sous 48h ouvrées.

Merci pour votre soutien et votre intérêt pour notre cause !

L'équipe ADUL21
Association de Défense des Usagers de la Ligne 21

Email : assoligne21@gmail.com
Site web : https://adul21.fr
        `
      })
    } catch (emailError) {
      // Log but don't fail - admin was notified
      console.error('Failed to send user confirmation:', emailError)
    }

    return {
      success: true,
      message: 'Votre message a été envoyé avec succès'
    }
  } catch (error: any) {
    console.error('Error processing contact form:', error)

    if (error?.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Une erreur est survenue lors de l\'envoi'
    })
  }
})

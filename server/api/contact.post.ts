import { z } from 'zod'

// Helper function to get subject label
const getSubjectLabel = (subject: string): string => {
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

// Validation schema
const contactSchema = z.object({
  civility: z.enum(['M.', 'Mme', 'Autre']),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  subject: z.enum(['testimony', 'membership', 'volunteering', 'press', 'legal', 'other']),
  message: z.string().min(10).max(5000),
  acceptsProcessing: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter le traitement de vos données'
  })
})

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = contactSchema.parse(body)

    const config = useRuntimeConfig()

    // Send email to association
    await sendEmail({
      to: 'assoligne21@gmail.com',
      subject: `[ADUL21] Nouveau message - ${getSubjectLabel(validatedData.subject)}`,
      replyTo: validatedData.email,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
            .label { font-weight: bold; color: #2563eb; }
            .message-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Nouveau message du formulaire de contact</h2>
            </div>
            <div class="content">
              <div class="info-row">
                <span class="label">Sujet :</span> ${getSubjectLabel(validatedData.subject)}
              </div>
              <div class="info-row">
                <span class="label">De :</span> ${validatedData.civility} ${validatedData.firstName} ${validatedData.lastName}
              </div>
              <div class="info-row">
                <span class="label">Email :</span> <a href="mailto:${validatedData.email}">${validatedData.email}</a>
              </div>
              ${validatedData.phone ? `
              <div class="info-row">
                <span class="label">Téléphone :</span> ${validatedData.phone}
              </div>
              ` : ''}
              <div class="info-row">
                <span class="label">Date :</span> ${new Date().toLocaleString('fr-FR')}
              </div>

              <div class="message-box">
                <h3 style="margin-top: 0; color: #2563eb;">Message :</h3>
                <p style="white-space: pre-wrap;">${validatedData.message}</p>
              </div>

              <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                Pour répondre, utilisez le bouton "Répondre" de votre client email ou envoyez un message à ${validatedData.email}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Nouveau message du formulaire de contact ADUL21

Sujet : ${getSubjectLabel(validatedData.subject)}
De : ${validatedData.civility} ${validatedData.firstName} ${validatedData.lastName}
Email : ${validatedData.email}
${validatedData.phone ? `Téléphone : ${validatedData.phone}` : ''}
Date : ${new Date().toLocaleString('fr-FR')}

Message :
${validatedData.message}

---
Pour répondre, envoyez un email à ${validatedData.email}
      `
    })

    // Send confirmation email to user
    await sendEmail({
      to: validatedData.email,
      subject: 'Votre message a bien été reçu - ADUL21',
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Message bien reçu</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${validatedData.firstName}</strong>,</p>

              <p>Nous avons bien reçu votre message concernant : <strong>${getSubjectLabel(validatedData.subject)}</strong></p>

              <div class="info-box">
                <p style="margin: 0;"><strong>Nous vous répondrons sous 48h ouvrées.</strong></p>
              </div>

              <p>Pour rappel, voici le contenu de votre message :</p>

              <div style="background: white; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="white-space: pre-wrap; margin: 0;">${validatedData.message}</p>
              </div>

              <p>Nous vous remercions de votre intérêt pour notre mobilisation.</p>

              <p><strong>L'équipe ADUL21</strong><br>
              Association de Défense des Usagers de la Ligne 21</p>
            </div>
            <div class="footer">
              <p>Email : <a href="mailto:assoligne21@gmail.com">assoligne21@gmail.com</a></p>
              <p>Site web : <a href="https://adul21.fr">adul21.fr</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Message bien reçu

Bonjour ${validatedData.firstName},

Nous avons bien reçu votre message concernant : ${getSubjectLabel(validatedData.subject)}

Nous vous répondrons sous 48h ouvrées.

Pour rappel, voici le contenu de votre message :
${validatedData.message}

Nous vous remercions de votre intérêt pour notre mobilisation.

L'équipe ADUL21
Association de Défense des Usagers de la Ligne 21

Email : assoligne21@gmail.com
Site web : https://adul21.fr
      `
    })

    return {
      success: true,
      message: 'Votre message a été envoyé avec succès'
    }
  } catch (error: any) {
    console.error('Error processing contact form:', error)

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Une erreur est survenue lors de l\'envoi du message'
    })
  }
})

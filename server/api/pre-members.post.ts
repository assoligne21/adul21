import { z } from 'zod'
import { getDb } from '~/server/database/connection'
import { preMembers } from '~/server/database/schema'
import { eq, count as drizzleCount } from 'drizzle-orm'

// Validation schema
const preMemberSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.union([
    z.string().min(10).max(20),
    z.literal('')
  ]).transform(val => val === '' ? undefined : val).optional(),
  city: z.enum(['Ledenon', 'Cabrières', 'Saint-Gervasy', 'Autre']),
  userType: z.enum(['student', 'parent', 'worker', 'senior', 'pmr', 'other']),
  wantsToBecomeMember: z.boolean(),
  wantsToVolunteer: z.boolean(),
  canHostMeeting: z.boolean(),
  canDistributeFlyers: z.boolean(),
  participationAreas: z.array(z.string()),
  acceptsNewsletter: z.boolean(),
  acceptsContactWhenCreated: z.boolean(),
  acceptsAgInvitation: z.boolean()
})

export default defineEventHandler(async (event) => {
  const db = getDb(event)

  try {
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = preMemberSchema.parse(body)

    // Check if email already exists
    const existingPreMember = await db
      .select()
      .from(preMembers)
      .where(eq(preMembers.email, validatedData.email))
      .limit(1)

    if (existingPreMember.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Vous êtes déjà inscrit avec cet email'
      })
    }

    // Insert pre-member
    const [preMember] = await db.insert(preMembers).values({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      city: validatedData.city,
      userType: validatedData.userType,
      wantsToBecomeMember: validatedData.wantsToBecomeMember,
      wantsToVolunteer: validatedData.wantsToVolunteer,
      canHostMeeting: validatedData.canHostMeeting,
      canDistributeFlyers: validatedData.canDistributeFlyers,
      participationAreas: validatedData.participationAreas,
      acceptsNewsletter: validatedData.acceptsNewsletter,
      acceptsContactWhenCreated: validatedData.acceptsContactWhenCreated,
      acceptsAgInvitation: validatedData.acceptsAgInvitation
    }).returning()

    // Get total count
    const [{ value: totalCount }] = await db
      .select({ value: drizzleCount() })
      .from(preMembers)

    // Send notification to admin
    try {
      await sendEmail({
        to: 'assoligne21@gmail.com',
        subject: `[ADUL21] Nouveau soutien : ${validatedData.firstName} ${validatedData.lastName}`,
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
              .count-box { background: #d1fae5; border: 2px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
              .label { font-weight: bold; color: #059669; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">🤝 Nouveau soutien enregistré</h2>
              </div>
              <div class="content">
                <div class="count-box">
                  <div style="font-size: 48px; font-weight: bold; color: #065f46;">${totalCount || 0}</div>
                  <div style="color: #065f46; margin-top: 5px; font-size: 18px;">soutiens au total</div>
                </div>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #059669;">Informations</h3>
                  <p style="margin: 5px 0;"><span class="label">Nom :</span> ${validatedData.firstName} ${validatedData.lastName}</p>
                  <p style="margin: 5px 0;"><span class="label">Email :</span> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
                  <p style="margin: 5px 0;"><span class="label">Téléphone :</span> ${validatedData.phone || 'Non fourni'}</p>
                  <p style="margin: 5px 0;"><span class="label">Commune :</span> ${validatedData.city}</p>
                  <p style="margin: 5px 0;"><span class="label">Profil :</span> ${validatedData.userType}</p>
                </div>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #059669;">Intentions</h3>
                  <ul style="margin: 10px 0; list-style: none; padding: 0;">
                    <li>👥 Veut devenir membre : ${validatedData.wantsToBecomeMember ? '✅ Oui' : '❌ Non'}</li>
                    <li>🙋 Veut être bénévole : ${validatedData.wantsToVolunteer ? '✅ Oui' : '❌ Non'}</li>
                    <li>🏠 Peut héberger réunion : ${validatedData.canHostMeeting ? '✅ Oui' : '❌ Non'}</li>
                    <li>📄 Peut distribuer tracts : ${validatedData.canDistributeFlyers ? '✅ Oui' : '❌ Non'}</li>
                  </ul>
                </div>

                ${validatedData.participationAreas.length > 0 ? `
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #059669;">Domaines d'action</h3>
                  <ul style="margin: 10px 0;">
                    ${validatedData.participationAreas.map(area => `<li>${area}</li>`).join('')}
                  </ul>
                </div>
                ` : ''}

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #059669;">Consentements</h3>
                  <ul style="margin: 10px 0; list-style: none; padding: 0;">
                    <li>📧 Newsletter : ${validatedData.acceptsNewsletter ? '✅ Oui' : '❌ Non'}</li>
                    <li>📢 Contact à la création : ${validatedData.acceptsContactWhenCreated ? '✅ Oui' : '❌ Non'}</li>
                    <li>📅 Invitation AG : ${validatedData.acceptsAgInvitation ? '✅ Oui' : '❌ Non'}</li>
                  </ul>
                </div>

                <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                  💡 <strong>Continuez à construire la base :</strong> Plus nous serons nombreux, plus notre impact sera fort auprès des élus !
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      })
    } catch (emailError) {
      // Log but don't fail
      console.error('Failed to send admin notification:', emailError)
    }

    // Send confirmation to pre-member
    try {
      await sendEmail({
        to: validatedData.email,
        subject: 'Merci pour votre soutien - ADUL21',
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
              .count-box { background: #d1fae5; border: 2px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
              a { color: #059669; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🤝 Merci ${validatedData.firstName} !</h1>
                <p style="margin: 10px 0 0 0;">Votre soutien compte</p>
              </div>
              <div class="content">
                <h2>Bienvenue dans le mouvement ADUL21</h2>
                <p>Bonjour ${validatedData.firstName},</p>
                <p>Merci d'avoir rejoint notre combat pour le rétablissement de la ligne 21 directe.</p>

                <div class="count-box">
                  <div style="font-size: 48px; font-weight: bold; color: #065f46;">${totalCount || 0}</div>
                  <div style="color: #065f46; margin-top: 5px;">personnes mobilisées au total</div>
                  <div style="color: #047857; margin-top: 10px; font-size: 14px;">Ensemble, nous sommes plus forts !</div>
                </div>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #059669;">📅 Prochaines étapes</h3>
                  <ul style="margin: 10px 0;">
                    <li><strong>Dépôt à la préfecture :</strong> Dans les prochaines semaines</li>
                    <li><strong>Obtention du récépissé :</strong> 5-10 jours après le dépôt</li>
                    <li><strong>Assemblée Générale constitutive :</strong> Vous serez invité(e)</li>
                    <li><strong>Ouverture des adhésions :</strong> Dès la création officielle</li>
                  </ul>
                </div>

                ${validatedData.acceptsContactWhenCreated ? `
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #059669;">✉️ Vous serez informé(e) par email</h3>
                  <p style="margin: 5px 0;">Dès que l'association sera officiellement créée, vous recevrez :</p>
                  <ul style="margin: 10px 0;">
                    <li>La confirmation de la création avec le numéro de récépissé</li>
                    ${validatedData.wantsToBecomeMember ? '<li>Le lien pour adhérer avec les différentes formules</li>' : ''}
                    ${validatedData.acceptsAgInvitation ? '<li>L\'invitation à l\'Assemblée Générale constitutive</li>' : ''}
                    ${validatedData.acceptsNewsletter ? '<li>Les actualités de notre mobilisation</li>' : ''}
                  </ul>
                </div>
                ` : ''}

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #059669;">🎯 En attendant, vous pouvez</h3>
                  <ul style="margin: 10px 0;">
                    <li>Parler de notre mobilisation autour de vous</li>
                    <li>Partager le site <a href="https://adul21.fr">adul21.fr</a></li>
                    <li>Inviter vos proches à nous rejoindre</li>
                    <li>Témoigner de votre situation si vous êtes impacté(e)</li>
                  </ul>
                </div>

                <p><strong>Merci encore pour votre soutien !</strong></p>
                <p>L'équipe ADUL21</p>
              </div>
              <div class="footer">
                <p>ADUL21 - Association de Défense des Usagers de la Ligne 21 (en cours de création)</p>
                <p>Email : <a href="mailto:assoligne21@gmail.com">assoligne21@gmail.com</a></p>
                <p>Site web : <a href="https://adul21.fr">adul21.fr</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Merci ${validatedData.firstName} !

Bienvenue dans le mouvement ADUL21

Bonjour ${validatedData.firstName},

Merci d'avoir rejoint notre combat pour le rétablissement de la ligne 21 directe.

${totalCount || 0} personnes mobilisées au total - Ensemble, nous sommes plus forts !

PROCHAINES ÉTAPES :
- Dépôt à la préfecture : Dans les prochaines semaines
- Obtention du récépissé : 5-10 jours après le dépôt
- Assemblée Générale constitutive : Vous serez invité(e)
- Ouverture des adhésions : Dès la création officielle

Vous serez informé(e) par email de chaque étape.

EN ATTENDANT :
- Parlez de notre mobilisation autour de vous
- Partagez le site adul21.fr
- Invitez vos proches à nous rejoindre
- Témoignez de votre situation si vous êtes impacté(e)

Merci encore pour votre soutien !

L'équipe ADUL21
Email : assoligne21@gmail.com
Site web : https://adul21.fr
        `
      })
    } catch (emailError) {
      // Log but don't fail - admin was notified
      console.error('Failed to send confirmation:', emailError)
    }

    return {
      success: true,
      message: 'Inscription enregistrée avec succès',
      totalSupports: totalCount || 0,
      preMember: {
        id: preMember.id,
        createdAt: preMember.createdAt
      }
    }
  } catch (error: unknown) {
    console.error('Error processing pre-membership:', error)

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Une erreur est survenue lors de l\'enregistrement'
    })
  }
})

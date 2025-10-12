import { z } from 'zod'
import { serverSupabaseServiceRole } from '../utils/supabase-compat.ts'

// Validation schema
const memberSchema = z.object({
  // Personal info
  civility: z.enum(['M.', 'Mme', 'Autre']),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  birthDate: z.string().optional(),
  email: z.string().email().max(255),
  phone: z.string().min(10).max(20),
  address: z.string().min(5),
  postalCode: z.string().min(4).max(10),
  city: z.enum(['Ledenon', 'Cabrières', 'Saint-Gervasy', 'Autre']),

  // User profile
  userType: z.enum(['student', 'parent', 'worker', 'senior', 'pmr', 'other']),
  schoolName: z.string().max(200).optional(),
  schoolSection: z.string().max(200).optional(),
  usageBefore: z.enum(['daily', '2-3_per_week', 'weekly', 'occasional', '']).optional(),
  usageAfter: z.enum(['car', 'correspondences', 'depends_on_someone', 'stopped', '']).optional(),

  // Membership
  membershipType: z.enum(['reduced', 'normal', 'support', 'custom']),
  membershipFee: z.number().min(5),

  // Engagement
  wantsToParticipate: z.boolean(),
  participationAreas: z.array(z.string()),
  acceptsNewsletter: z.boolean(),
  acceptsTestimonyPublication: z.boolean(),
  acceptsMediaContact: z.boolean(),
  acceptsActionSolicitation: z.boolean()
})

function getMembershipTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    reduced: 'Tarif réduit',
    normal: 'Tarif normal',
    support: 'Tarif de soutien',
    custom: 'Montant libre'
  }
  return labels[type] || type
}

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = memberSchema.parse(body)

    // Get Supabase client with service role
    const supabase = serverSupabaseServiceRole(event)

    // Check if email already exists
    const { data: existingMember } = await supabase
      .from('members')
      .select('id, email')
      .eq('email', validatedData.email)
      .single()

    if (existingMember) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Un adhérent avec cet email existe déjà'
      })
    }

    // Calculate membership end date (1 year from now)
    const membershipStartDate = new Date()
    const membershipEndDate = new Date()
    membershipEndDate.setFullYear(membershipEndDate.getFullYear() + 1)

    // Insert member
    const { data: member, error } = await supabase
      .from('members')
      .insert({
        civility: validatedData.civility,
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        birth_date: validatedData.birthDate || null,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        postal_code: validatedData.postalCode,
        city: validatedData.city,
        user_type: validatedData.userType,
        school_name: validatedData.schoolName || null,
        school_section: validatedData.schoolSection || null,
        usage_before: validatedData.usageBefore || null,
        usage_after: validatedData.usageAfter || null,
        membership_fee: validatedData.membershipFee,
        membership_type: validatedData.membershipType,
        membership_status: 'pending',
        membership_start_date: membershipStartDate.toISOString().split('T')[0],
        membership_end_date: membershipEndDate.toISOString().split('T')[0],
        payment_status: 'pending',
        wants_to_participate: validatedData.wantsToParticipate,
        participation_areas: validatedData.participationAreas,
        accepts_newsletter: validatedData.acceptsNewsletter,
        accepts_testimony_publication: validatedData.acceptsTestimonyPublication,
        accepts_media_contact: validatedData.acceptsMediaContact,
        accepts_action_solicitation: validatedData.acceptsActionSolicitation
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Erreur lors de l\'enregistrement de l\'adhésion'
      })
    }

    // Send notification to admin
    try {
      await sendEmail({
        to: 'assoligne21@gmail.com',
        subject: `[ADUL21] Nouvelle adhésion : ${validatedData.firstName} ${validatedData.lastName}`,
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
              .amount-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
              .label { font-weight: bold; color: #2563eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">Nouvelle demande d'adhésion</h2>
              </div>
              <div class="content">
                <div class="amount-box">
                  <div style="font-size: 36px; font-weight: bold; color: #92400e;">${validatedData.membershipFee}€</div>
                  <div style="color: #92400e; margin-top: 5px;">${getMembershipTypeLabel(validatedData.membershipType)}</div>
                </div>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #2563eb;">Informations personnelles</h3>
                  <p style="margin: 5px 0;"><span class="label">Nom :</span> ${validatedData.civility} ${validatedData.firstName} ${validatedData.lastName}</p>
                  <p style="margin: 5px 0;"><span class="label">Email :</span> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
                  <p style="margin: 5px 0;"><span class="label">Téléphone :</span> ${validatedData.phone}</p>
                  <p style="margin: 5px 0;"><span class="label">Adresse :</span> ${validatedData.address}, ${validatedData.postalCode} ${validatedData.city}</p>
                  ${validatedData.birthDate ? `<p style="margin: 5px 0;"><span class="label">Date de naissance :</span> ${new Date(validatedData.birthDate).toLocaleDateString('fr-FR')}</p>` : ''}
                </div>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #2563eb;">Profil d'usager</h3>
                  <p style="margin: 5px 0;"><span class="label">Type :</span> ${validatedData.userType}</p>
                  ${validatedData.schoolName ? `<p style="margin: 5px 0;"><span class="label">Établissement :</span> ${validatedData.schoolName}</p>` : ''}
                  ${validatedData.schoolSection ? `<p style="margin: 5px 0;"><span class="label">Filière :</span> ${validatedData.schoolSection}</p>` : ''}
                  ${validatedData.usageBefore ? `<p style="margin: 5px 0;"><span class="label">Usage avant :</span> ${validatedData.usageBefore}</p>` : ''}
                  ${validatedData.usageAfter ? `<p style="margin: 5px 0;"><span class="label">Solution après :</span> ${validatedData.usageAfter}</p>` : ''}
                </div>

                ${validatedData.wantsToParticipate ? `
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #2563eb;">Participation active</h3>
                  <p style="margin: 5px 0;">Domaines d'intérêt :</p>
                  <ul style="margin: 10px 0;">
                    ${validatedData.participationAreas.map(area => `<li>${area}</li>`).join('')}
                  </ul>
                </div>
                ` : ''}

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #2563eb;">Consentements</h3>
                  <ul style="margin: 10px 0; list-style: none; padding: 0;">
                    <li>✉️ Newsletter : ${validatedData.acceptsNewsletter ? '✅ Oui' : '❌ Non'}</li>
                    <li>📝 Publication témoignage : ${validatedData.acceptsTestimonyPublication ? '✅ Oui' : '❌ Non'}</li>
                    <li>📰 Contact média : ${validatedData.acceptsMediaContact ? '✅ Oui' : '❌ Non'}</li>
                    <li>🎯 Sollicitations actions : ${validatedData.acceptsActionSolicitation ? '✅ Oui' : '❌ Non'}</li>
                  </ul>
                </div>

                <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                  💡 <strong>Action requise :</strong> En attente du règlement de ${validatedData.membershipFee}€ pour valider l'adhésion.
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

    // Send confirmation to member
    try {
      await sendEmail({
        to: validatedData.email,
        subject: 'Demande d\'adhésion reçue - ADUL21',
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
              .payment-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280; }
              a { color: #2563eb; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Bienvenue à l'ADUL21 !</h1>
                <p style="margin: 10px 0 0 0;">Association de Défense des Usagers de la Ligne 21</p>
              </div>
              <div class="content">
                <h2>Demande d'adhésion bien reçue</h2>
                <p>Bonjour ${validatedData.firstName} ${validatedData.lastName},</p>
                <p>Nous avons bien reçu votre demande d'adhésion en tant que <strong>${getMembershipTypeLabel(validatedData.membershipType)}</strong>.</p>

                <div class="payment-box">
                  <h3 style="margin-top: 0; color: #92400e;">💳 Règlement de la cotisation</h3>
                  <p style="margin: 0 0 15px 0; font-size: 24px; font-weight: bold; color: #92400e;">Montant : ${validatedData.membershipFee}€</p>

                  <div style="text-align: left;">
                    <p><strong>Modalités de paiement :</strong></p>
                    <ul style="margin: 10px 0;">
                      <li><strong>Virement bancaire :</strong> IBAN et BIC seront communiqués par email séparé</li>
                      <li><strong>Chèque :</strong> À l'ordre de "ADUL21" envoyé à l'adresse qui vous sera communiquée</li>
                      <li><strong>Espèces :</strong> Lors d'une réunion de l'association</li>
                    </ul>
                  </div>

                  <p style="margin-top: 15px; font-size: 14px; color: #92400e;">
                    ⚠️ <strong>Important :</strong> Votre adhésion sera effective dès réception du paiement.
                  </p>
                </div>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #2563eb;">Vos avantages adhérent</h3>
                  <ul style="margin: 10px 0;">
                    <li>✅ Participation aux assemblées générales avec droit de vote</li>
                    <li>✅ Accès aux informations en avant-première</li>
                    <li>✅ Contribution directe à notre mobilisation juridique</li>
                    <li>✅ Participation aux actions de mobilisation</li>
                    ${validatedData.wantsToParticipate ? '<li>✅ Engagement actif dans les groupes de travail</li>' : ''}
                  </ul>
                </div>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #2563eb;">Récapitulatif de votre adhésion</h3>
                  <p style="margin: 5px 0;"><strong>Type :</strong> ${getMembershipTypeLabel(validatedData.membershipType)}</p>
                  <p style="margin: 5px 0;"><strong>Montant :</strong> ${validatedData.membershipFee}€</p>
                  <p style="margin: 5px 0;"><strong>Durée :</strong> 1 an (${membershipStartDate.toLocaleDateString('fr-FR')} - ${membershipEndDate.toLocaleDateString('fr-FR')})</p>
                  <p style="margin: 5px 0;"><strong>Statut :</strong> En attente de paiement</p>
                </div>

                <p>Dès réception de votre paiement, nous vous enverrons une confirmation et votre carte d'adhérent.</p>
                <p><strong>Merci de rejoindre notre combat pour rétablir la ligne 21 directe !</strong></p>
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
Bienvenue à l'ADUL21 !

Bonjour ${validatedData.firstName} ${validatedData.lastName},

Nous avons bien reçu votre demande d'adhésion en tant que ${getMembershipTypeLabel(validatedData.membershipType)}.

RÈGLEMENT DE LA COTISATION
Montant : ${validatedData.membershipFee}€

Modalités de paiement :
- Virement bancaire : IBAN et BIC seront communiqués par email séparé
- Chèque : À l'ordre de "ADUL21"
- Espèces : Lors d'une réunion de l'association

⚠️ Votre adhésion sera effective dès réception du paiement.

VOS AVANTAGES ADHÉRENT
✅ Participation aux assemblées générales avec droit de vote
✅ Accès aux informations en avant-première
✅ Contribution directe à notre mobilisation juridique
✅ Participation aux actions de mobilisation

RÉCAPITULATIF
Type : ${getMembershipTypeLabel(validatedData.membershipType)}
Montant : ${validatedData.membershipFee}€
Durée : 1 an
Statut : En attente de paiement

Merci de rejoindre notre combat pour rétablir la ligne 21 directe !

L'équipe ADUL21
Email : assoligne21@gmail.com
Site web : https://adul21.fr
        `
      })
    } catch (emailError) {
      // Log but don't fail - admin was notified
      console.error('Failed to send member confirmation:', emailError)
    }

    return {
      success: true,
      message: 'Votre demande d\'adhésion a été enregistrée avec succès',
      member: {
        id: member.id,
        created_at: member.created_at
      }
    }
  } catch (error: any) {
    console.error('Error processing membership:', error)

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

import { z } from 'zod'
import { serverSupabaseServiceRole } from '../utils/supabase-compat.ts'

// Validation schema
const membershipSchema = z.object({
  // Personal info
  civility: z.enum(['M.', 'Mme', 'Autre']),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  birthDate: z.string().optional(),
  email: z.string().email().max(255),
  phone: z.string().min(10).max(20),
  address: z.string().min(10),
  postalCode: z.string().regex(/^[0-9]{5}$/),
  city: z.enum(['Ledenon', 'Cabrières', 'Saint-Gervasy', 'Autre']),

  // Profile
  userType: z.enum(['student', 'parent', 'worker', 'senior', 'pmr', 'other']),
  schoolName: z.string().max(200).optional(),
  schoolSection: z.string().max(200).optional(),
  usageBefore: z.enum(['daily', '2-3_per_week', 'weekly', 'occasional']).optional(),
  usageAfter: z.enum(['car', 'correspondences', 'depends_on_someone', 'stopped']).optional(),
  wantsToParticipate: z.boolean(),
  participationAreas: z.array(z.string()).optional(),

  // Membership
  membershipType: z.enum(['reduced', 'normal', 'support', 'custom']),
  membershipFee: z.number().min(5),
  acceptsNewsletter: z.boolean(),
  acceptsActionSolicitation: z.boolean(),
  acceptsMediaContact: z.boolean(),

  // Confirmation
  acceptsProcessing: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter le traitement de vos données'
  })
})

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = membershipSchema.parse(body)

    // Get Supabase client with service role
    const supabase = serverSupabaseServiceRole(event)

    // Calculate membership dates (1 year)
    const startDate = new Date()
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1)

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
        membership_status: 'pending', // Will be activated after payment
        membership_start_date: startDate.toISOString().split('T')[0],
        membership_end_date: endDate.toISOString().split('T')[0],
        payment_method: null, // To be filled when payment is received
        payment_status: 'pending',
        wants_to_participate: validatedData.wantsToParticipate,
        participation_areas: validatedData.participationAreas || [],
        accepts_newsletter: validatedData.acceptsNewsletter,
        accepts_action_solicitation: validatedData.acceptsActionSolicitation,
        accepts_media_contact: validatedData.acceptsMediaContact
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

    // Send confirmation email to member
    try {
      await sendEmail({
        to: validatedData.email,
        subject: 'Votre demande d\'adhésion à l\'ADUL21 - Instructions de paiement',
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
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
              .amount { font-size: 32px; font-weight: bold; color: #2563eb; text-align: center; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Bienvenue à l'ADUL21 !</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${validatedData.firstName}</strong>,</p>

                <p>Nous avons bien reçu votre demande d'adhésion à l'ADUL21. Merci pour votre soutien dans notre mobilisation !</p>

                <div class="amount">
                  Cotisation : ${validatedData.membershipFee}€
                </div>

                <div class="payment-box">
                  <h3 style="margin-top: 0; color: #92400e;">📋 Instructions de paiement</h3>

                  <p style="color: #92400e;"><strong>Pour finaliser votre adhésion, veuillez effectuer votre règlement par l'un des moyens suivants :</strong></p>

                  <h4 style="color: #92400e;">1️⃣ Virement bancaire (recommandé)</h4>
                  <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
                    <p style="margin: 5px 0;"><strong>IBAN :</strong> [À COMPLÉTER]</p>
                    <p style="margin: 5px 0;"><strong>BIC :</strong> [À COMPLÉTER]</p>
                    <p style="margin: 5px 0;"><strong>Titulaire :</strong> ADUL21</p>
                    <p style="margin: 5px 0; color: #2563eb;"><strong>Libellé :</strong> Adhésion ${validatedData.firstName} ${validatedData.lastName}</p>
                  </div>

                  <h4 style="color: #92400e;">2️⃣ Chèque</h4>
                  <p style="color: #92400e;">À l'ordre de : <strong>ADUL21</strong></p>
                  <p style="color: #92400e;">À envoyer à :<br>
                  <strong>ADUL21<br>
                  [ADRESSE À COMPLÉTER]<br>
                  [CODE POSTAL] [VILLE]</strong></p>

                  <h4 style="color: #92400e;">3️⃣ Espèces</h4>
                  <p style="color: #92400e;">Lors d'une permanence (nous vous contacterons pour organiser).</p>
                </div>

                <div class="info-box">
                  <h3 style="margin-top: 0; color: #2563eb;">📝 Récapitulatif de votre adhésion</h3>
                  <p><strong>Email :</strong> ${validatedData.email}</p>
                  <p><strong>Téléphone :</strong> ${validatedData.phone}</p>
                  <p><strong>Commune :</strong> ${validatedData.city}</p>
                  <p><strong>Période d'adhésion :</strong> ${startDate.toLocaleDateString('fr-FR')} - ${endDate.toLocaleDateString('fr-FR')}</p>
                  ${validatedData.wantsToParticipate ? '<p><strong>✅ Souhaite participer aux actions</strong></p>' : ''}
                </div>

                <p>Une fois votre paiement reçu, nous activerons votre adhésion et vous recevrez un email de confirmation.</p>

                <p><strong>Important :</strong> Conservez cet email comme preuve de votre demande d'adhésion.</p>

                <p style="margin-top: 30px;">Nous vous remercions pour votre engagement dans notre mobilisation.</p>

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
Bienvenue à l'ADUL21 !

Bonjour ${validatedData.firstName},

Nous avons bien reçu votre demande d'adhésion à l'ADUL21. Merci pour votre soutien dans notre mobilisation !

COTISATION : ${validatedData.membershipFee}€

INSTRUCTIONS DE PAIEMENT
========================

Pour finaliser votre adhésion, veuillez effectuer votre règlement par l'un des moyens suivants :

1️⃣ VIREMENT BANCAIRE (recommandé)
IBAN : [À COMPLÉTER]
BIC : [À COMPLÉTER]
Titulaire : ADUL21
Libellé : Adhésion ${validatedData.firstName} ${validatedData.lastName}

2️⃣ CHÈQUE
À l'ordre de : ADUL21
À envoyer à :
ADUL21
[ADRESSE À COMPLÉTER]
[CODE POSTAL] [VILLE]

3️⃣ ESPÈCES
Lors d'une permanence (nous vous contacterons pour organiser).

RÉCAPITULATIF DE VOTRE ADHÉSION
================================
Email : ${validatedData.email}
Téléphone : ${validatedData.phone}
Commune : ${validatedData.city}
Période d'adhésion : ${startDate.toLocaleDateString('fr-FR')} - ${endDate.toLocaleDateString('fr-FR')}
${validatedData.wantsToParticipate ? 'Souhaite participer aux actions' : ''}

Une fois votre paiement reçu, nous activerons votre adhésion et vous recevrez un email de confirmation.

Important : Conservez cet email comme preuve de votre demande d'adhésion.

Nous vous remercions pour votre engagement dans notre mobilisation.

L'équipe ADUL21
Association de Défense des Usagers de la Ligne 21

Pour toute question : assoligne21@gmail.com
Suivez notre mobilisation sur https://adul21.fr
        `
      })

      // Send notification email to association
      await sendEmail({
        to: 'assoligne21@gmail.com',
        subject: `[ADUL21] Nouvelle adhésion - ${validatedData.firstName} ${validatedData.lastName}`,
        html: `
          <h2>Nouvelle demande d'adhésion</h2>
          <p><strong>Nom :</strong> ${validatedData.civility} ${validatedData.firstName} ${validatedData.lastName}</p>
          <p><strong>Email :</strong> ${validatedData.email}</p>
          <p><strong>Téléphone :</strong> ${validatedData.phone}</p>
          <p><strong>Commune :</strong> ${validatedData.city}</p>
          <p><strong>Cotisation :</strong> ${validatedData.membershipFee}€ (${validatedData.membershipType})</p>
          <p><strong>Souhaite participer :</strong> ${validatedData.wantsToParticipate ? 'Oui' : 'Non'}</p>
          ${validatedData.wantsToParticipate && validatedData.participationAreas && validatedData.participationAreas.length > 0
            ? `<p><strong>Domaines :</strong> ${validatedData.participationAreas.join(', ')}</p>`
            : ''}
          <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>Statut :</strong> En attente de paiement</p>
          <hr>
          <p style="color: #f59e0b;"><strong>Action requise :</strong> Vérifier le paiement et activer l'adhésion dans le tableau de bord admin.</p>
        `,
        text: `
Nouvelle demande d'adhésion

Nom : ${validatedData.civility} ${validatedData.firstName} ${validatedData.lastName}
Email : ${validatedData.email}
Téléphone : ${validatedData.phone}
Commune : ${validatedData.city}
Cotisation : ${validatedData.membershipFee}€ (${validatedData.membershipType})
Souhaite participer : ${validatedData.wantsToParticipate ? 'Oui' : 'Non'}
${validatedData.wantsToParticipate && validatedData.participationAreas && validatedData.participationAreas.length > 0
  ? `Domaines : ${validatedData.participationAreas.join(', ')}`
  : ''}
Date : ${new Date().toLocaleString('fr-FR')}
Statut : En attente de paiement

Action requise : Vérifier le paiement et activer l'adhésion dans le tableau de bord admin.
        `
      })
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Failed to send confirmation emails:', emailError)
    }

    return {
      success: true,
      message: 'Votre demande d\'adhésion a été enregistrée avec succès',
      member: {
        id: member.id,
        email: member.email
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

    // Check for duplicate email
    if (error.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cet email est déjà enregistré',
        data: { message: 'Un compte avec cet email existe déjà. Veuillez nous contacter si vous rencontrez un problème.' }
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Une erreur est survenue lors de l\'enregistrement'
    })
  }
})

import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let transporter: Transporter | null = null

export const getEmailTransporter = () => {
  if (transporter) {
    return transporter
  }

  const config = useRuntimeConfig()

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: config.gmailUser,
      pass: config.gmailAppPassword
    }
  })

  return transporter
}

export const sendEmail = async (options: {
  to: string
  subject: string
  html: string
  text?: string
}) => {
  const config = useRuntimeConfig()
  const transporter = getEmailTransporter()

  try {
    const info = await transporter.sendMail({
      from: config.emailFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    })

    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

// Email templates
export const emailTemplates = {
  testimonyConfirmation: (data: {
    firstName: string
    city: string
    userType: string
  }) => ({
    subject: 'Votre témoignage a bien été reçu',
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
            <h2>Merci pour votre témoignage</h2>
            <p>Bonjour ${data.firstName},</p>
            <p>Nous avons bien reçu votre témoignage concernant la suppression de la ligne 21 directe.</p>
            <p>Votre témoignage est actuellement en cours de modération par notre équipe. Une fois validé, il sera publié sur notre site et contribuera à renforcer notre mobilisation.</p>

            <div class="info-box">
              <strong>Vos informations :</strong>
              <ul style="margin: 10px 0 0 0;">
                <li>Commune : ${data.city}</li>
                <li>Type d'usager : ${getUserTypeLabel(data.userType)}</li>
              </ul>
            </div>

            <p><strong>Pourquoi une modération ?</strong></p>
            <p>Nous vérifions simplement que chaque témoignage respecte notre charte de publication et ne contient pas d'informations personnelles sensibles.</p>

            <p><strong>Que faire ensuite ?</strong></p>
            <ul>
              <li>Partagez notre combat autour de vous</li>
              <li>Rejoignez-nous en tant qu'adhérent sur <a href="https://adul21.fr/rejoindre/adherer">adul21.fr</a></li>
              <li>Suivez nos actualités sur le site</li>
            </ul>

            <p>Ensemble, nous défendons le droit à la mobilité pour tous !</p>
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
    `
  }),

  contactConfirmation: (data: {
    firstName: string
    subject: string
  }) => ({
    subject: 'Nous avons bien reçu votre message',
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
            <p>Bonjour ${data.firstName},</p>
            <p>Nous avons bien reçu votre message concernant : <strong>${getSubjectLabel(data.subject)}</strong></p>
            <p>Notre équipe vous répondra dans les plus brefs délais, généralement sous 48h ouvrées.</p>
            <p>En attendant, n'hésitez pas à consulter notre site pour en savoir plus sur notre mobilisation.</p>
            <p>Merci pour votre soutien !</p>
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
    `
  }),

  membershipConfirmation: (data: {
    firstName: string
    lastName: string
    membershipType: string
    amount: number
  }) => ({
    subject: 'Demande d\'adhésion reçue',
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
            <p>Bonjour ${data.firstName} ${data.lastName},</p>
            <p>Nous avons bien reçu votre demande d'adhésion en tant que <strong>${getMembershipTypeLabel(data.membershipType)}</strong>.</p>

            <div class="payment-box">
              <h3 style="margin-top: 0; color: #92400e;">💳 Règlement de la cotisation</h3>
              <p style="margin: 0 0 10px 0;">Montant : <strong>${data.amount}€</strong></p>
              <p><strong>Virement bancaire :</strong></p>
              <p style="margin: 5px 0; font-family: monospace;">
                IBAN : [À REMPLIR]<br>
                BIC : [À REMPLIR]<br>
                Libellé : Adhésion ${data.firstName} ${data.lastName}
              </p>
              <p style="margin-top: 15px; font-size: 14px; color: #92400e;">
                ⚠️ Votre adhésion sera effective dès réception du paiement.
              </p>
            </div>

            <div class="info-box">
              <strong>Vos avantages adhérent :</strong>
              <ul style="margin: 10px 0 0 0;">
                <li>Participation aux assemblées générales</li>
                <li>Accès aux informations en avant-première</li>
                <li>Contribution directe à notre mobilisation juridique</li>
              </ul>
            </div>

            <p>Dès réception de votre paiement, nous vous enverrons une confirmation et votre carte d'adhérent.</p>
            <p>Merci de rejoindre notre combat !</p>
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
    `
  })
}

// Helper functions
function getUserTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    student: 'Lycéen',
    parent: 'Parent',
    worker: 'Actif',
    retired: 'Retraité',
    other: 'Autre'
  }
  return labels[type] || type
}

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

function getMembershipTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    individual: 'Adhérent individuel',
    family: 'Adhérent famille',
    student: 'Adhérent étudiant',
    support: 'Adhérent de soutien'
  }
  return labels[type] || type
}

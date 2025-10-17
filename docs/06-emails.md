# Documentation du Système d'Emails Transactionnels

## Vue d'ensemble

Le projet ADUL21 utilise **Gmail SMTP** via **Nodemailer** pour envoyer des emails transactionnels aux utilisateurs et notifications aux administrateurs. Le système supporte les emails au format HTML et texte brut pour une compatibilité maximale.

### Architecture

```
┌─────────────────┐
│   User Action   │
│  (Form Submit)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Handler   │
│ (contact.post,  │
│  membership,    │
│  pre-members)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  sendEmail()    │─────▶│ Gmail SMTP   │
│  (mailer.ts)    │      │ smtp.gmail.  │
│                 │      │ com:587      │
└────────┬────────┘      └──────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Email Delivery                 │
│  • User confirmation (HTML+TXT) │
│  • Admin notification (HTML)    │
└─────────────────────────────────┘
```

---

## 1. Configuration Gmail SMTP

### 1.1 Variables d'environnement

Le système nécessite 3 variables d'environnement configurées dans `.env` :

```bash
# Gmail SMTP Configuration
GMAIL_USER=assoligne21@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  # Mot de passe d'application 2FA
EMAIL_FROM=ADUL21 <assoligne21@gmail.com>
```

**Fichier** : `/home/adul21/adul21-website/.env.example`

### 1.2 Configuration Nuxt Runtime

Ces variables sont injectées dans le runtime Nuxt pour être accessibles côté serveur uniquement :

**Fichier** : `/home/adul21/adul21-website/nuxt.config.ts`

```typescript
runtimeConfig: {
  // Private keys (server-only)
  gmailUser: process.env.GMAIL_USER || '',
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || 'ADUL21 <assoligne21@gmail.com>',
}
```

### 1.3 Authentification 2FA et App Password

Gmail SMTP nécessite :

1. **Validation en deux étapes (2FA)** activée sur le compte Gmail
2. **Mot de passe d'application** généré spécifiquement pour le site

**Procédure complète** : Voir `/home/adul21/adul21-website/GMAIL_SMTP_GUIDE.md`

**Étapes résumées** :
1. Activer 2FA sur https://myaccount.google.com/security
2. Générer un mot de passe d'application sur https://myaccount.google.com/apppasswords
3. Copier le mot de passe 16 caractères (format : `xxxx xxxx xxxx xxxx`)
4. Le stocker dans `GMAIL_APP_PASSWORD` sans espaces

### 1.4 Configuration Nodemailer

**Fichier principal** : `/home/adul21/adul21-website/server/utils/mailer.ts`

```typescript
import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

let transporter: Transporter | null = null

export const getMailTransporter = () => {
  if (transporter) {
    return transporter
  }

  const config = useRuntimeConfig()

  if (!config.gmailUser || !config.gmailAppPassword) {
    console.error('Gmail SMTP credentials not configured')
    throw new Error('Email configuration is missing. Please check your environment variables.')
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,              // Port STARTTLS
    secure: false,          // false pour port 587
    auth: {
      user: config.gmailUser,
      pass: config.gmailAppPassword
    },
    tls: {
      rejectUnauthorized: true
    }
  })

  return transporter
}
```

**Configuration alternative (port 465 SSL)** :

Fichier `/home/adul21/adul21-website/server/utils/email.ts` utilise le port 465 :

```typescript
transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,              // Port SSL
  secure: true,           // SSL activé
  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPassword
  }
})
```

**Note** : Le projet a deux fichiers similaires (`mailer.ts` et `email.ts`). Il est recommandé de consolider vers `mailer.ts` qui utilise le port 587 (plus compatible).

---

## 2. Fonction d'envoi générique

### 2.1 API principale : `sendEmail()`

**Fichier** : `/home/adul21/adul21-website/server/utils/mailer.ts`

```typescript
export const sendEmail = async (options: {
  to: string | string[]        // Destinataire(s)
  subject: string               // Sujet
  html?: string                 // Version HTML
  text?: string                 // Version texte brut
  cc?: string | string[]        // Copie
  bcc?: string | string[]       // Copie cachée
  replyTo?: string              // Adresse de réponse
}) => {
  try {
    const config = useRuntimeConfig()
    const transporter = getMailTransporter()

    const info = await transporter.sendMail({
      from: config.emailFrom,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
      replyTo: options.replyTo
    })

    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
```

### 2.2 Gestion des erreurs

**Stratégie actuelle** :
- Les erreurs d'envoi sont loggées dans la console
- L'exception est propagée au handler parent
- Pour les emails de confirmation utilisateur : l'erreur est silencieuse (logged mais ne fait pas échouer la requête)
- Pour les emails admin : l'erreur peut faire échouer la requête

**Exemple de gestion d'erreur** (depuis `/home/adul21/adul21-website/server/api/contact.post.ts`) :

```typescript
// Notification admin - erreur critique
try {
  await sendEmail({ /* ... */ })
} catch (emailError) {
  console.error('Failed to send admin notification:', emailError)
  throw createError({
    statusCode: 500,
    statusMessage: 'Erreur lors de l\'envoi de la notification'
  })
}

// Confirmation utilisateur - erreur non-bloquante
try {
  await sendEmail({ /* ... */ })
} catch (emailError) {
  // Log but don't fail - admin was notified
  console.error('Failed to send user confirmation:', emailError)
}
```

### 2.3 Vérification de connexion SMTP

**Fonction** : `verifyMailConnection()`

```typescript
export const verifyMailConnection = async () => {
  try {
    const transporter = getMailTransporter()
    await transporter.verify()
    console.log('Gmail SMTP connection verified successfully')
    return true
  } catch (error) {
    console.error('Gmail SMTP connection verification failed:', error)
    return false
  }
}
```

**Utilisation** : Peut être appelée au démarrage du serveur pour vérifier la configuration.

---

## 3. Templates d'emails

Le projet utilise des templates HTML inline avec styles CSS embarqués pour une compatibilité maximale avec tous les clients email.

### 3.1 Structure commune des templates

```html
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
      <!-- Contenu principal -->
    </div>
    <div class="footer">
      <p>ADUL21 - Association de Défense des Usagers de la Ligne 21</p>
      <p>Email : <a href="mailto:assoligne21@gmail.com">assoligne21@gmail.com</a></p>
      <p>Site web : <a href="https://adul21.fr">adul21.fr</a></p>
    </div>
  </div>
</body>
</html>
```

### 3.2 Palette de couleurs

| Élément | Couleur | Usage |
|---------|---------|-------|
| Primaire bleu | `#2563eb` | Headers, liens, accents |
| Bleu foncé | `#1d4ed8` | Dégradés headers |
| Vert succès | `#10b981` | Confirmations pré-adhésion |
| Vert foncé | `#059669` | Accents verts |
| Jaune alerte | `#fef3c7` | Box paiement |
| Orange | `#f59e0b` | Bordures alertes |
| Gris texte | `#333` | Texte principal |
| Gris clair | `#6b7280` | Footer, texte secondaire |
| Background | `#f9fafb` | Fond content |

---

## 4. Types d'emails envoyés

### 4.1 Email de confirmation de contact

**Trigger** : Soumission du formulaire de contact
**Endpoint** : `/home/adul21/adul21-website/server/api/contact.post.ts`
**Destinataires** : Utilisateur + Admin

#### Email utilisateur

```typescript
await sendEmail({
  to: validatedData.email,
  subject: 'Nous avons bien reçu votre message - ADUL21',
  html: `<!-- Template HTML -->`,
  text: `<!-- Version texte brut -->`
})
```

**Contenu** :
- Confirmation de réception
- Rappel du sujet du message
- Délai de réponse : 48h ouvrées
- Suggestions d'actions en attendant

**Données incluses** :
- `firstName` : Prénom de l'utilisateur
- `subject` : Sujet du message (transformé via `getSubjectLabel()`)

#### Email admin

```typescript
await sendEmail({
  to: 'assoligne21@gmail.com',
  subject: `[ADUL21] Nouveau message : ${getSubjectLabel(validatedData.subject)}`,
  html: `<!-- Notification détaillée -->`
})
```

**Contenu** :
- Informations complètes du contact
- Message intégral
- Date et heure de réception
- Action requise : Répondre sous 48h

**Données incluses** :
- `civility`, `firstName`, `lastName`
- `email`, `phone`
- `subject` (libellé)
- `message`
- Date/heure actuelle

---

### 4.2 Email de confirmation de pré-adhésion

**Trigger** : Soumission du formulaire "Je soutiens" (avant création officielle de l'association)
**Endpoint** : `/home/adul21/adul21-website/server/api/pre-members.post.ts`
**Destinataires** : Utilisateur + Admin

#### Email utilisateur

```typescript
await sendEmail({
  to: validatedData.email,
  subject: 'Merci pour votre soutien - ADUL21',
  html: `<!-- Template HTML -->`,
  text: `<!-- Version texte brut -->`
})
```

**Contenu** :
- Remerciement pour le soutien
- **Compteur de soutiens** : Affiche le nombre total de personnes mobilisées
- Prochaines étapes (dépôt préfecture, AG, ouverture adhésions)
- Informations conditionnelles selon les consentements
- Suggestions d'actions immédiates

**Données incluses** :
- `firstName` : Prénom
- `totalCount` : Nombre total de pré-adhérents
- `acceptsContactWhenCreated` : Si oui, affiche section "Vous serez informé(e)"
- `wantsToBecomeMember` : Mention adhésion future
- `acceptsAgInvitation` : Mention invitation AG
- `acceptsNewsletter` : Mention newsletter

**Particularité** : Header vert (success) au lieu de bleu

#### Email admin

```typescript
await sendEmail({
  to: 'assoligne21@gmail.com',
  subject: `[ADUL21] Nouveau soutien : ${validatedData.firstName} ${validatedData.lastName}`,
  html: `<!-- Notification détaillée -->`
})
```

**Contenu** :
- **Compteur visuel** : Grande box avec le nombre total de soutiens
- Informations personnelles du pré-adhérent
- Intentions (devenir membre, bénévolat, héberger réunion, distribuer tracts)
- Domaines d'action souhaités
- Consentements (newsletter, contact, AG)

**Données incluses** :
- Toutes les données du formulaire
- `totalCount` : Nombre total affiché en grand
- `participationAreas[]` : Liste des domaines d'action
- Tous les booléens de consentement

---

### 4.3 Email de confirmation d'adhésion

**Trigger** : Soumission du formulaire d'adhésion complet (après création de l'association)
**Endpoint** : `/home/adul21/adul21-website/server/api/membership.post.ts`
**Destinataires** : Utilisateur + Admin

#### Email utilisateur

```typescript
await sendEmail({
  to: validatedData.email,
  subject: 'Votre demande d\'adhésion à l\'ADUL21 - Instructions de paiement',
  html: `<!-- Template HTML -->`,
  text: `<!-- Version texte brut -->`
})
```

**Contenu** :
- Message de bienvenue
- **Montant de la cotisation** (gros chiffre)
- **Instructions de paiement détaillées** :
  - Virement bancaire (IBAN, BIC, libellé)
  - Chèque (ordre, adresse)
  - Espèces (permanence)
- Récapitulatif de l'adhésion
- Informations importantes (conservation email)

**Données incluses** :
- `firstName`, `lastName`
- `membershipFee` : Montant cotisation
- `email`, `phone`, `city`
- `startDate`, `endDate` : Période d'adhésion (1 an)
- `wantsToParticipate` : Affichage conditionnel

**Note** : Les coordonnées bancaires doivent être complétées (`[À COMPLÉTER]` dans le template)

#### Email admin

```typescript
await sendEmail({
  to: 'assoligne21@gmail.com',
  subject: `[ADUL21] Nouvelle adhésion - ${validatedData.firstName} ${validatedData.lastName}`,
  html: `<!-- Notification simple -->`,
  text: `<!-- Version texte -->`
})
```

**Contenu** :
- Informations complètes du membre
- Type d'adhésion et montant
- Statut : En attente de paiement
- Action requise : Vérifier paiement et activer dans le tableau de bord

**Données incluses** :
- `civility`, `firstName`, `lastName`
- `email`, `phone`, `city`
- `membershipFee`, `membershipType`
- `wantsToParticipate`, `participationAreas[]`

---

### 4.4 Email de confirmation de témoignage

**Note** : Template défini dans `/home/adul21/adul21-website/server/utils/email.ts` mais **NON UTILISÉ** dans l'API actuelle.

**Template disponible** : `emailTemplates.testimonyConfirmation()`

**Endpoint concerné** : `/home/adul21/adul21-website/server/api/testimonies/index.post.ts`

**État actuel** : L'API témoignage **n'envoie PAS d'email**. Il enregistre simplement le témoignage avec statut `moderationStatus: 'pending'`.

**Template prévu** :

```typescript
emailTemplates.testimonyConfirmation({
  firstName: string,
  city: string,
  userType: string
})
```

**Contenu prévu** :
- Confirmation de réception
- Information sur la modération
- Détails de l'utilisateur (commune, type)
- Explication du processus de modération
- Suggestions d'actions (partager, adhérer)

**Recommandation** : Ajouter l'envoi d'email dans `testimonies/index.post.ts` :

```typescript
// À ajouter après l'insertion du témoignage
try {
  await sendEmail({
    to: validatedData.email,
    subject: 'Votre témoignage a bien été reçu',
    ...emailTemplates.testimonyConfirmation({
      firstName: validatedData.first_name,
      city: validatedData.city,
      userType: validatedData.user_type
    })
  })
} catch (emailError) {
  console.error('Failed to send testimony confirmation:', emailError)
}
```

---

## 5. Helpers et fonctions utilitaires

### 5.1 Fonctions de transformation de labels

**Fichier** : `/home/adul21/adul21-website/server/utils/email.ts`

#### `getUserTypeLabel(type: string)`

Transforme le code type d'utilisateur en libellé français.

```typescript
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
```

**Usage** : Templates de témoignage

#### `getSubjectLabel(subject: string)`

Transforme le code sujet de contact en libellé français.

```typescript
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
```

**Usage** : Email de confirmation de contact

#### `getMembershipTypeLabel(type: string)`

Transforme le code type d'adhésion en libellé français.

```typescript
function getMembershipTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    individual: 'Adhérent individuel',
    family: 'Adhérent famille',
    student: 'Adhérent étudiant',
    support: 'Adhérent de soutien'
  }
  return labels[type] || type
}
```

**Usage** : Templates d'adhésion (non utilisé actuellement)

### 5.2 Génération de texte brut à partir du HTML

**Fonction** (dans `email.ts`) :

```typescript
text: options.text || options.html.replace(/<[^>]*>/g, '')
```

Cette méthode simple supprime toutes les balises HTML pour créer une version texte.

**Limitation** : Ne gère pas correctement les listes, tableaux, etc.

**Recommandation** : Utiliser une bibliothèque comme `html-to-text` pour une meilleure conversion :

```typescript
import { convert } from 'html-to-text'

text: options.text || convert(options.html, {
  wordwrap: 130,
  selectors: [
    { selector: 'a', options: { ignoreHref: false } },
    { selector: 'img', format: 'skip' }
  ]
})
```

---

## 6. Récapitulatif des triggers d'envoi

| Type d'email | Endpoint | Trigger | Destinataires | Statut |
|--------------|----------|---------|---------------|--------|
| Contact - Confirmation utilisateur | `/api/contact.post.ts` | Soumission formulaire contact | Utilisateur | ✅ Implémenté |
| Contact - Notification admin | `/api/contact.post.ts` | Soumission formulaire contact | Admin | ✅ Implémenté |
| Pré-adhésion - Confirmation utilisateur | `/api/pre-members.post.ts` | Soumission "Je soutiens" | Utilisateur | ✅ Implémenté |
| Pré-adhésion - Notification admin | `/api/pre-members.post.ts` | Soumission "Je soutiens" | Admin | ✅ Implémenté |
| Adhésion - Confirmation + instructions | `/api/membership.post.ts` | Soumission adhésion complète | Utilisateur | ✅ Implémenté |
| Adhésion - Notification admin | `/api/membership.post.ts` | Soumission adhésion complète | Admin | ✅ Implémenté |
| Témoignage - Confirmation | `/api/testimonies/index.post.ts` | Soumission témoignage | Utilisateur | ❌ NON implémenté |

---

## 7. Bonnes pratiques implémentées

### 7.1 Format multipart (HTML + Texte)

✅ **Implémenté** : Tous les emails de confirmation utilisateur incluent versions HTML et texte brut.

**Exemple** :

```typescript
await sendEmail({
  to: email,
  subject: 'Sujet',
  html: `<html>...</html>`,
  text: `Version texte brut...`
})
```

**Avantages** :
- Compatibilité avec clients email texte uniquement
- Meilleure délivrabilité (moins de spam)
- Accessibilité

### 7.2 Headers corrects

✅ **Implémenté** : Nodemailer gère automatiquement les headers standards.

**Headers générés** :
- `From: ADUL21 <assoligne21@gmail.com>`
- `To: destinataire@example.com`
- `Subject: [Sujet]`
- `Message-ID: <unique-id@gmail.com>`
- `Date: [Date actuelle]`
- `MIME-Version: 1.0`
- `Content-Type: multipart/alternative`

### 7.3 Styles inline CSS

✅ **Implémenté** : Tous les styles sont inline ou dans `<style>` pour compatibilité maximale.

**Raison** : Beaucoup de clients email (Gmail, Outlook) ne supportent pas les CSS externes.

### 7.4 Gestion des erreurs non-bloquantes

✅ **Implémenté partiellement** :
- Emails de confirmation utilisateur : erreurs loggées mais non-bloquantes
- Emails notification admin : erreurs peuvent bloquer (contact.post.ts)

**Recommandation** : Uniformiser la stratégie :

```typescript
// Toujours notifier l'admin
try {
  await sendEmail({ to: 'admin@...', ... })
} catch (error) {
  console.error('Admin notification failed:', error)
  // NE PAS throw - continuer l'exécution
}

// Confirmation utilisateur optionnelle
try {
  await sendEmail({ to: userEmail, ... })
} catch (error) {
  console.error('User confirmation failed:', error)
  // Ne pas faire échouer la requête principale
}
```

### 7.5 Logging

✅ **Implémenté** : Tous les succès et erreurs sont loggés.

```typescript
console.log('Email sent successfully:', info.messageId)
console.error('Failed to send email:', error)
```

**Amélioration possible** : Utiliser un logger structuré (Winston, Pino) :

```typescript
import { logger } from '~/server/utils/logger'

logger.info('Email sent', {
  messageId: info.messageId,
  to: options.to,
  subject: options.subject
})
```

---

## 8. Sécurité et conformité

### 8.1 SPF/DKIM/DMARC

**État actuel** : Dépend de la configuration DNS du domaine `adul21.fr`.

**Recommandations** :

#### SPF (Sender Policy Framework)

Ajoutez un enregistrement TXT DNS :

```
Nom : @
Type : TXT
Valeur : v=spf1 include:_spf.google.com ~all
```

**Effet** : Autorise Gmail à envoyer des emails au nom de `adul21.fr`.

#### DKIM (DomainKeys Identified Mail)

Pour Gmail gratuit : DKIM est automatique (signatures Gmail).

Pour domaine personnalisé : Nécessite Google Workspace (payant).

#### DMARC (Domain-based Message Authentication)

Ajoutez un enregistrement TXT DNS :

```
Nom : _dmarc
Type : TXT
Valeur : v=DMARC1; p=none; rua=mailto:assoligne21@gmail.com
```

**Effet** : Demande aux serveurs de rapporter les échecs d'authentification.

**Impact** : Améliore la délivrabilité et réduit le risque de spam.

### 8.2 Gestion des bounces

**État actuel** : ❌ NON implémenté.

**Recommandation** : Configurer un webhook ou polling pour traiter les bounces :

1. **Gmail API** : Vérifier les emails retournés dans la boîte de réception
2. **Webhook Nodemailer** : Pas supporté nativement
3. **Service tiers** : Utiliser Resend/SendGrid pour gestion automatique des bounces

**Exemple d'implémentation** :

```typescript
// Endpoint pour traiter les bounces
export default defineEventHandler(async (event) => {
  const { email, reason } = await readBody(event)

  // Marquer l'email comme invalide en base
  await db.update(members)
    .set({ emailInvalid: true, bounceReason: reason })
    .where(eq(members.email, email))

  return { success: true }
})
```

### 8.3 Protection des données personnelles (RGPD)

✅ **Implémenté** :
- Consentements explicites dans les formulaires (`acceptsProcessing`)
- Emails envoyés uniquement après consentement
- Pas de stockage du mot de passe SMTP en clair (variable d'environnement)

**Points d'amélioration** :
- Ajouter un lien de désinscription dans les emails newsletter
- Logger les consentements avec horodatage
- Permettre la suppression des données (droit à l'oubli)

---

## 9. Limites et quotas Gmail SMTP

### 9.1 Limites quotidiennes

Gmail impose les limites suivantes pour un compte gratuit :

| Limite | Valeur | Impact sur ADUL21 |
|--------|--------|-------------------|
| Emails par jour | 500 | ✅ Largement suffisant (quelques dizaines par jour max) |
| Destinataires par jour | 500 | ✅ OK (emails individuels) |
| Destinataires par email | 99 | ✅ OK (pas d'envoi groupé) |
| Délai entre emails | Aucun | ✅ Envois espacés naturellement |

**En cas de dépassement** : Gmail bloque l'envoi pendant 24h.

**Erreur retournée** : `Daily user sending quota exceeded`

### 9.2 Surveillance des quotas

**Méthode actuelle** : Vérifier manuellement dans Gmail > Envoyés.

**Amélioration possible** : Tracker les envois en base de données :

```typescript
// Table email_logs
export const emailLogs = pgTable('email_logs', {
  id: serial('id').primaryKey(),
  to: varchar('to', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(), // 'sent', 'failed'
  messageId: varchar('message_id', { length: 255 }),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow()
})

// Logger chaque envoi
await db.insert(emailLogs).values({
  to: options.to,
  subject: options.subject,
  status: 'sent',
  messageId: info.messageId
})
```

### 9.3 Alternative si limites atteintes

**Solutions** :

1. **Google Workspace** (payant : 6€/mois)
   - Quota augmenté à 2000 emails/jour
   - Domaine personnalisé (`noreply@adul21.fr`)
   - Meilleure délivrabilité

2. **Services d'emailing dédiés** :
   - **Resend** : 3000 emails gratuits/mois, puis 20$/mois
   - **SendGrid** : 100 emails gratuits/jour, puis 15$/mois
   - **Amazon SES** : 62k emails gratuits/mois si hébergé AWS
   - **Mailgun** : 5000 emails gratuits premier mois, puis 0.80$/1000

---

## 10. Améliorations recommandées

### 10.1 Consolidation des fichiers utilitaires

**Problème** : Deux fichiers similaires existent :
- `/server/utils/mailer.ts` (port 587, plus complet)
- `/server/utils/email.ts` (port 465, avec templates)

**Recommandation** : Fusionner vers `mailer.ts` :

```typescript
// server/utils/mailer.ts

// 1. Garder la config actuelle (port 587)
// 2. Migrer les templates depuis email.ts
// 3. Migrer les helpers (getUserTypeLabel, etc.)
// 4. Supprimer email.ts
// 5. Mettre à jour les imports dans les APIs
```

### 10.2 Implémenter l'envoi pour les témoignages

**Fichier** : `/server/api/testimonies/index.post.ts`

**Ajouter après l'insertion** :

```typescript
// Send confirmation email
try {
  await sendEmail({
    to: validatedData.email,
    subject: 'Votre témoignage a bien été reçu - ADUL21',
    html: emailTemplates.testimonyConfirmation({
      firstName: validatedData.first_name,
      city: validatedData.city,
      userType: validatedData.user_type
    }).html
  })

  // Send notification to admin
  await sendEmail({
    to: 'assoligne21@gmail.com',
    subject: `[ADUL21] Nouveau témoignage - ${validatedData.first_name} ${validatedData.last_name}`,
    html: `
      <h2>Nouveau témoignage reçu</h2>
      <p><strong>De :</strong> ${validatedData.first_name} ${validatedData.last_name}</p>
      <p><strong>Email :</strong> ${validatedData.email}</p>
      <p><strong>Ville :</strong> ${validatedData.city}</p>
      <p><strong>Statut :</strong> En attente de modération</p>
      <hr>
      <p><strong>Témoignage :</strong></p>
      <p>${validatedData.testimony_text}</p>
      <hr>
      <p>Accédez au tableau de bord admin pour modérer ce témoignage.</p>
    `
  })
} catch (emailError) {
  console.error('Failed to send testimony emails:', emailError)
}
```

### 10.3 Ajouter retry logic

**Objectif** : Réessayer l'envoi en cas d'échec temporaire.

**Implémentation** :

```typescript
async function sendEmailWithRetry(
  options: EmailOptions,
  maxRetries = 3,
  delayMs = 1000
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendEmail(options)
    } catch (error) {
      if (attempt === maxRetries) throw error

      console.warn(`Email send failed (attempt ${attempt}/${maxRetries}), retrying...`)
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
    }
  }
}
```

### 10.4 Templates externalisés

**Problème** : Templates HTML inline dans les APIs rendent le code difficile à maintenir.

**Recommandation** : Externaliser dans des fichiers `.html` ou utiliser un moteur de templates.

**Option 1 : Fichiers HTML** :

```typescript
// server/templates/emails/contact-confirmation.html
// server/templates/emails/membership-confirmation.html

import { readFileSync } from 'fs'
import { join } from 'path'

function loadTemplate(name: string, data: Record<string, any>) {
  const templatePath = join(process.cwd(), 'server/templates/emails', `${name}.html`)
  let html = readFileSync(templatePath, 'utf-8')

  // Simple replacement
  for (const [key, value] of Object.entries(data)) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
  }

  return html
}

// Usage
await sendEmail({
  to: email,
  subject: 'Confirmation',
  html: loadTemplate('contact-confirmation', { firstName, subject })
})
```

**Option 2 : Moteur de templates (Handlebars)** :

```bash
npm install handlebars
```

```typescript
import Handlebars from 'handlebars'

const template = Handlebars.compile(`
  <h1>Bonjour {{firstName}}</h1>
  <p>Votre message concernant {{subject}} a été reçu.</p>
`)

const html = template({ firstName, subject })
```

### 10.5 Queue d'envoi

**Objectif** : Pour gérer les envois en masse et éviter les blocages.

**Implémentation avec BullMQ** :

```bash
npm install bullmq ioredis
```

```typescript
// server/utils/email-queue.ts
import { Queue, Worker } from 'bullmq'
import { sendEmail } from './mailer'

const emailQueue = new Queue('emails', {
  connection: { host: 'localhost', port: 6379 }
})

// Worker pour traiter la queue
new Worker('emails', async (job) => {
  await sendEmail(job.data)
}, {
  connection: { host: 'localhost', port: 6379 }
})

export async function queueEmail(options: EmailOptions) {
  await emailQueue.add('send-email', options)
}

// Usage dans les APIs
await queueEmail({
  to: email,
  subject: 'Sujet',
  html: '...'
})
```

**Avantages** :
- Envois asynchrones
- Retry automatique
- Rate limiting
- Monitoring

### 10.6 Compléter les coordonnées bancaires

**Fichier** : `/server/api/membership.post.ts`

**Remplacer** :

```html
<p style="margin: 5px 0;"><strong>IBAN :</strong> [À COMPLÉTER]</p>
<p style="margin: 5px 0;"><strong>BIC :</strong> [À COMPLÉTER]</p>
```

**Par** :

```html
<p style="margin: 5px 0;"><strong>IBAN :</strong> FR76 XXXX XXXX XXXX XXXX XXXX XXX</p>
<p style="margin: 5px 0;"><strong>BIC :</strong> XXXXXXXX</p>
```

**Recommandation** : Stocker ces informations en variables d'environnement :

```bash
# .env
ASSOCIATION_IBAN=FR76XXXXXXXXXXXXXXXXXXXX
ASSOCIATION_BIC=XXXXXXXX
ASSOCIATION_ADDRESS=123 Rue Example, 30000 Nîmes
```

```typescript
// nuxt.config.ts
runtimeConfig: {
  associationIban: process.env.ASSOCIATION_IBAN || '',
  associationBic: process.env.ASSOCIATION_BIC || '',
  associationAddress: process.env.ASSOCIATION_ADDRESS || ''
}

// Usage dans l'email
const config = useRuntimeConfig()
`<p><strong>IBAN :</strong> ${config.associationIban}</p>`
```

### 10.7 Tracking des ouvertures et clics

**Objectif** : Mesurer l'engagement des emails.

**Méthode pixel tracking** :

```html
<!-- Ajouter dans chaque email -->
<img src="https://adul21.fr/api/email-track/open/${emailId}" width="1" height="1" style="display:none;" />
```

```typescript
// server/api/email-track/open/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  // Logger l'ouverture
  await db.insert(emailOpens).values({
    emailLogId: id,
    openedAt: new Date()
  })

  // Retourner un pixel transparent
  setResponseHeaders(event, {
    'Content-Type': 'image/gif',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  })

  return Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  )
})
```

**Note** : Cette méthode a des limitations (bloquée par certains clients email).

### 10.8 Tests automatisés

**Ajouter des tests pour les emails** :

```typescript
// tests/emails/contact.test.ts
import { describe, it, expect, vi } from 'vitest'
import { sendEmail } from '~/server/utils/mailer'

vi.mock('~/server/utils/mailer')

describe('Contact email', () => {
  it('sends confirmation email to user', async () => {
    const mockSendEmail = vi.mocked(sendEmail)

    // Simuler l'appel API
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        firstName: 'Jean',
        email: 'jean@example.com',
        subject: 'testimony',
        message: 'Test'
      }
    })

    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'jean@example.com',
        subject: expect.stringContaining('bien reçu')
      })
    )
  })
})
```

---

## 11. Dépannage

### 11.1 Erreurs courantes

#### "Invalid login: 535-5.7.8 Username and Password not accepted"

**Cause** : Authentification échouée.

**Solutions** :
1. Vérifier que la 2FA est activée sur le compte Gmail
2. Régénérer un nouveau mot de passe d'application
3. Vérifier que `GMAIL_APP_PASSWORD` ne contient pas d'espaces
4. Vérifier que `GMAIL_USER` est correct

#### "Error: connect ETIMEDOUT"

**Cause** : Impossible de se connecter au serveur SMTP.

**Solutions** :
1. Vérifier que les ports 587 ou 465 sont ouverts :
   ```bash
   telnet smtp.gmail.com 587
   ```
2. Vérifier le firewall du serveur
3. Essayer l'autre port (587 vs 465)

#### "Daily user sending quota exceeded"

**Cause** : Limite de 500 emails/jour dépassée.

**Solutions** :
1. Attendre 24h pour reset
2. Passer à Google Workspace (2000 emails/jour)
3. Utiliser un service d'emailing dédié

#### Emails arrivent dans les spams

**Solutions** :
1. Configurer SPF (voir section 8.1)
2. Vérifier le contenu (éviter mots spam : "gratuit", "cliquez ici", etc.)
3. Demander aux utilisateurs d'ajouter `assoligne21@gmail.com` aux contacts
4. Utiliser un domaine personnalisé avec DKIM

### 11.2 Vérification de la configuration

**Script de diagnostic** :

```typescript
// server/api/admin/email-check.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const checks = {
    gmailUserConfigured: !!config.gmailUser,
    gmailPasswordConfigured: !!config.gmailAppPassword,
    emailFromConfigured: !!config.emailFrom,
    smtpConnection: false
  }

  // Test connexion SMTP
  try {
    checks.smtpConnection = await verifyMailConnection()
  } catch (error) {
    checks.smtpConnection = false
  }

  return checks
})
```

**Tester** :

```bash
curl https://adul21.fr/api/admin/email-check
```

**Résultat attendu** :

```json
{
  "gmailUserConfigured": true,
  "gmailPasswordConfigured": true,
  "emailFromConfigured": true,
  "smtpConnection": true
}
```

---

## 12. Documentation de référence

### 12.1 Fichiers du projet

| Fichier | Description |
|---------|-------------|
| `/server/utils/mailer.ts` | Configuration Nodemailer principale (port 587) |
| `/server/utils/email.ts` | Alternative avec templates (port 465) - à consolider |
| `/server/api/contact.post.ts` | Envoi emails contact |
| `/server/api/membership.post.ts` | Envoi emails adhésion |
| `/server/api/pre-members.post.ts` | Envoi emails pré-adhésion |
| `/server/api/testimonies/index.post.ts` | Endpoint témoignages (emails non implémentés) |
| `/GMAIL_SMTP_GUIDE.md` | Guide complet de configuration Gmail SMTP |
| `/.env.example` | Template des variables d'environnement |
| `/nuxt.config.ts` | Configuration runtime |

### 12.2 Variables d'environnement

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `GMAIL_USER` | Adresse Gmail complète | `assoligne21@gmail.com` | ✅ Oui |
| `GMAIL_APP_PASSWORD` | Mot de passe d'application 2FA | `xxxx xxxx xxxx xxxx` | ✅ Oui |
| `EMAIL_FROM` | Expéditeur affiché dans les emails | `ADUL21 <assoligne21@gmail.com>` | ✅ Oui |

### 12.3 Liens utiles

- **Nodemailer** : https://nodemailer.com
- **Gmail SMTP** : https://support.google.com/mail/answer/7126229
- **Configuration 2FA Google** : https://myaccount.google.com/security
- **Mots de passe d'application** : https://myaccount.google.com/apppasswords
- **Resend** : https://resend.com
- **SendGrid** : https://sendgrid.com
- **Amazon SES** : https://aws.amazon.com/ses

---

## 13. Checklist de maintenance

### 13.1 Vérifications mensuelles

- [ ] Vérifier les logs d'erreurs d'envoi
- [ ] Vérifier le quota d'emails restant
- [ ] Tester l'envoi d'un email de chaque type
- [ ] Vérifier la délivrabilité (inbox vs spam)
- [ ] Surveiller les bounces dans Gmail

### 13.2 Actions à effectuer

**Immédiatement** :
- [ ] Compléter les coordonnées bancaires dans `membership.post.ts`
- [ ] Consolider `mailer.ts` et `email.ts` en un seul fichier
- [ ] Implémenter l'envoi d'emails pour les témoignages

**Court terme** :
- [ ] Ajouter retry logic
- [ ] Configurer SPF/DKIM/DMARC
- [ ] Externaliser les templates HTML
- [ ] Ajouter logging structuré

**Moyen terme** :
- [ ] Implémenter une queue d'envoi (BullMQ)
- [ ] Ajouter tracking des ouvertures
- [ ] Créer des tests automatisés
- [ ] Surveiller les bounces automatiquement

**Si croissance** :
- [ ] Migrer vers Google Workspace ou service dédié
- [ ] Implémenter la segmentation des emails
- [ ] Ajouter des templates personnalisés par type d'utilisateur

---

## Conclusion

Le système d'emails transactionnels d'ADUL21 est fonctionnel et répond aux besoins actuels du projet. Il utilise Gmail SMTP via Nodemailer avec des templates HTML bien conçus et une stratégie d'envoi claire.

**Points forts** :
- Configuration simple et gratuite
- Templates HTML professionnels et cohérents
- Format multipart (HTML + texte)
- Gestion des erreurs de base

**Points à améliorer** :
- Consolidation des fichiers utilitaires
- Implémentation des emails de témoignages
- Amélioration de la résilience (retry, queue)
- Configuration DNS (SPF/DKIM)

Pour toute question ou assistance, consulter le guide complet : `/home/adul21/adul21-website/GMAIL_SMTP_GUIDE.md`

# Documentation de Sécurité - ADUL21

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Authentification](#authentification)
3. [Autorisation](#autorisation)
4. [Validation des données](#validation-des-données)
5. [Hachage des mots de passe](#hachage-des-mots-de-passe)
6. [Variables d'environnement](#variables-denvironnement)
7. [Sécurité base de données](#sécurité-base-de-données)
8. [Sécurité des cookies](#sécurité-des-cookies)
9. [Protection des emails](#protection-des-emails)
10. [Vulnérabilités identifiées](#vulnérabilités-identifiées)
11. [Recommandations](#recommandations)
12. [Checklist de sécurité](#checklist-de-sécurité)

---

## Vue d'ensemble

Le projet ADUL21 implémente plusieurs couches de sécurité pour protéger les données sensibles des utilisateurs et l'accès administrateur. Cette documentation détaille les mécanismes de sécurité en place et les points d'amélioration.

### Architecture de sécurité

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│  - Cookies HttpOnly (JWT)                                │
│  - Middleware de route (admin-auth.ts)                   │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   API Layer (Nuxt)                       │
│  - Validation Zod                                        │
│  - Authentication JWT                                    │
│  - Authorization requireAuth()                           │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Database Layer (PostgreSQL)                 │
│  - Drizzle ORM (Prepared Statements)                    │
│  - Bcrypt password hashing                               │
└─────────────────────────────────────────────────────────┘
```

---

## Authentification

### Système JWT

**Fichier**: `/home/adul21/adul21-website/server/utils/jwt.ts`

Le projet utilise JSON Web Tokens (JWT) pour l'authentification des administrateurs.

#### Configuration JWT

```typescript
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-me'
const JWT_EXPIRES_IN = '7d' // 7 jours
```

#### Payload JWT

```typescript
interface JWTPayload {
  userId: string      // UUID de l'admin
  email: string       // Email de l'admin
  name: string        // Nom de l'admin
}
```

#### Génération de token

```typescript
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}
```

**Points positifs**:
- Expiration configurée (7 jours)
- Payload minimal (pas de données sensibles)

**Points d'amélioration**:
- ⚠️ Secret par défaut faible (`'your-secret-key-change-me'`)
- Pas de rotation de tokens
- Pas de blacklist de tokens révoqués

#### Validation de token

```typescript
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}
```

**Points positifs**:
- Gestion des erreurs silencieuse (pas de leak d'info)
- Retourne null en cas d'échec

**Points d'amélioration**:
- Pas de log des tentatives d'authentification échouées
- Pas de distinction entre token expiré et token invalide

### Login Admin

**Fichier**: `/home/adul21/adul21-website/server/api/auth/login.post.ts`

#### Flux d'authentification

```
1. Réception email + password
2. Validation présence des champs
3. Recherche admin en DB
4. Vérification compte actif
5. Vérification mot de passe (bcrypt)
6. Mise à jour lastLoginAt
7. Génération JWT
8. Définition cookie HttpOnly
9. Retour user info (sans password)
```

#### Code de login

```typescript
// Vérification admin existe
const [admin] = await db
  .select()
  .from(adminUsers)
  .where(eq(adminUsers.email, email))
  .limit(1)

if (!admin) {
  throw createError({
    statusCode: 401,
    message: 'Email ou mot de passe incorrect'
  })
}

// Vérification compte actif
if (!admin.isActive) {
  throw createError({
    statusCode: 403,
    message: 'Compte désactivé'
  })
}

// Vérification password
const valid = await verifyPassword(password, admin.passwordHash)

if (!valid) {
  throw createError({
    statusCode: 401,
    message: 'Email ou mot de passe incorrect'
  })
}
```

**Points positifs**:
- Message d'erreur générique (pas de distinction utilisateur existe/pas)
- Vérification du statut du compte (isActive)
- Mise à jour de lastLoginAt pour audit

**Points d'amélioration**:
- ⚠️ Pas de limitation de tentatives (rate limiting)
- Pas de CAPTCHA après X échecs
- Pas de notification email sur connexion suspecte
- Pas de 2FA (authentification à deux facteurs)

### Endpoints d'authentification

#### `/api/auth/me.get.ts` - Vérification session

```typescript
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  return { user }
})
```

**Protection**: Requiert un JWT valide

#### `/api/auth/logout.post.ts` - Déconnexion

```typescript
export default defineEventHandler(async (event) => {
  clearTokenCookie(event)
  return { success: true, message: 'Déconnexion réussie' }
})
```

**Points positifs**:
- Suppression du cookie côté serveur

**Points d'amélioration**:
- Pas d'invalidation du token (le JWT reste valide jusqu'à expiration)

---

## Autorisation

### Middleware côté client

**Fichier**: `/home/adul21/adul21-website/middleware/admin-auth.ts`

```typescript
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip auth check for login page
  if (to.path === '/admin/login') {
    return
  }

  // Check authentication for admin routes
  if (to.path.startsWith('/admin')) {
    const { checkAuth } = useAuth()
    const isAuth = await checkAuth()

    if (!isAuth) {
      return navigateTo('/admin/login')
    }
  }
})
```

**Fonction**: Protection des routes `/admin/*` côté client

**Points positifs**:
- Redirection automatique vers login
- Exclusion de la page de login
- Vérification asynchrone du statut auth

**⚠️ LIMITATION CRITIQUE**: Ce middleware est côté client uniquement. Un utilisateur peut contourner cette protection en manipulant le JavaScript.

### Protection côté serveur

**Fonction**: `requireAuth()` dans `/home/adul21/adul21-website/server/utils/jwt.ts`

```typescript
export async function requireAuth(event: H3Event): Promise<JWTPayload> {
  const token = getTokenFromCookie(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Non authentifié'
    })
  }

  const payload = verifyToken(token)

  if (!payload) {
    throw createError({
      statusCode: 401,
      message: 'Token invalide ou expiré'
    })
  }

  return payload
}
```

**Utilisation**: Appelée dans tous les endpoints admin

### Routes protégées

#### Endpoints nécessitant authentification

```typescript
// Stats admin
/api/admin/stats.get.ts          ✓ requireAuth()
/api/admin/newsletter.get.ts     ✓ requireAuth()
/api/admin/pre-members.get.ts    ✓ requireAuth()
/api/auth/me.get.ts              ✓ requireAuth()
```

#### Endpoints publics (sans auth)

```typescript
// Soumissions publiques
/api/testimonies/index.post.ts   ✗ Public
/api/members/index.post.ts       ✗ Public
/api/pre-members.post.ts         ✗ Public
/api/contact.post.ts             ✗ Public
/api/newsletter/subscribe.post.ts ✗ Public
/api/incidents/index.post.ts     ✗ Public
/api/donations/index.post.ts     ✗ Public

// Lecture publique
/api/news/index.get.ts           ✗ Public (filtré published)
/api/testimonies/index.get.ts    ✗ Public (filtré published)
```

**⚠️ VULNÉRABILITÉ CRITIQUE**: Routes de modification sans authentification

```typescript
// CES ROUTES SONT PUBLIQUES - DANGEREUX!
/api/members/[id].delete.ts      ✗ PAS D'AUTH!
/api/members/[id].patch.ts       ✗ PAS D'AUTH!
/api/testimonies/[id].delete.ts  ✗ PAS D'AUTH!
/api/testimonies/[id].patch.ts   ✗ PAS D'AUTH!
```

**Impact**: N'importe qui peut supprimer ou modifier des témoignages/membres si l'ID est connu.

---

## Validation des données

### Zod Schemas

**Fichier**: `/home/adul21/adul21-website/server/validation/schemas.ts`

Le projet utilise Zod pour la validation stricte des données côté serveur.

#### Exemple: Validation de témoignage

```typescript
export const testimonySchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  age_range: z.enum(['under_18', '18-30', '30-50', '50-70', 'over_70']),
  city: z.enum(['Ledenon', 'Cabrières', 'Saint-Gervasy', 'Autre']),
  testimony_text: z.string().min(50, 'Le témoignage doit contenir au moins 50 caractères'),
  // ... autres champs
})
```

**Points positifs**:
- Validation de type
- Validation de format (email, regex)
- Validation de longueur min/max
- Énumérations pour champs limités
- Messages d'erreur personnalisés en français

#### Validation stricte des formats

```typescript
// Code postal français
postalCode: z.string().regex(/^\d{5}$/, 'Code postal invalide')

// Date ISO
incident_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide (format: YYYY-MM-DD)')

// Heure
incident_time: z.string().regex(/^\d{2}:\d{2}$/, 'Heure invalide (format: HH:MM)').optional()

// Slug
slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets')

// URL
cover_image_url: z.string().url('URL invalide').optional()

// UUID
author_id: z.string().uuid('ID auteur invalide').optional()
```

#### Validation de téléphone

```typescript
phone: z.string().min(10, 'Numéro de téléphone invalide')
```

**⚠️ Point d'amélioration**: Validation trop permissive (accepte n'importe quelle chaîne de 10+ caractères)

**Recommandation**:
```typescript
phone: z.string().regex(/^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/, 'Numéro de téléphone invalide')
```

### Utilisation dans les endpoints

```typescript
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = testimonySchema.parse(body) // ✓ Validation

    // Insertion sécurisée
    const [newTestimony] = await db.insert(testimonies).values(validatedData)

    return { success: true, data: newTestimony }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données invalides',
        data: error.errors
      })
    }
    // ...
  }
})
```

**Points positifs**:
- Validation systématique avant insertion DB
- Gestion d'erreurs ZodError séparée
- Retour des erreurs de validation à l'utilisateur

### Sanitization

**⚠️ MANQUE CRITIQUE**: Pas de sanitization HTML/XSS

Le projet ne sanitize pas les entrées utilisateur contre les attaques XSS.

**Exemples de champs à risque**:
- `testimony_text` (texte libre, peut contenir `<script>`)
- `concrete_example` (texte libre)
- `message` (formulaire contact)
- `description` (incidents)

**Recommandation**: Ajouter une bibliothèque de sanitization

```bash
npm install dompurify isomorphic-dompurify
```

```typescript
import DOMPurify from 'isomorphic-dompurify'

const sanitizedText = DOMPurify.sanitize(validatedData.testimony_text)
```

---

## Hachage des mots de passe

**Fichier**: `/home/adul21/adul21-website/server/utils/hash.ts`

### Implémentation bcrypt

```typescript
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
```

**Points positifs**:
- Utilisation de bcrypt (algorithme recommandé)
- Salt automatique (bcrypt génère un salt aléatoire par défaut)
- Cost factor de 10 (bon équilibre sécurité/performance)

**Détails techniques**:
- Bcrypt inclut automatiquement le salt dans le hash
- Format: `$2b$10$saltsaltsaltsaltsaltsalthashhashhashhashhashhas`
- Résistant aux attaques par force brute (lent par conception)
- Résistant aux rainbow tables (grâce au salt unique)

### Stockage en base

```typescript
// Schema adminUsers
export const adminUsers = pgTable('admin_users', {
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  // ...
})
```

**Points positifs**:
- Colonne distincte `passwordHash` (clarté)
- Longueur 255 caractères (suffisant pour bcrypt)
- Jamais de retour du hash dans les réponses API

**⚠️ Points d'amélioration**:
- Pas de politique de mot de passe (longueur min, complexité)
- Pas de vérification des mots de passe courants (Have I Been Pwned)
- Pas d'expiration de mot de passe

---

## Variables d'environnement

**Fichier**: `/home/adul21/adul21-website/.env.example`

### Variables sensibles

```bash
# Critique - Secret JWT
JWT_SECRET=                    # ⚠️ À générer aléatoirement

# Critique - Database
DATABASE_URL=postgresql://adul21:password@localhost:5432/adul21
POSTGRES_PASSWORD=             # ⚠️ Mot de passe DB

# Critique - Email
GMAIL_APP_PASSWORD=            # ⚠️ Mot de passe application Gmail

# Optionnel - Paiements (non implémenté)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Configuration Nuxt

**Fichier**: `/home/adul21/adul21-website/nuxt.config.ts`

```typescript
runtimeConfig: {
  // Private keys (server-only)
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  gmailUser: process.env.GMAIL_USER || '',
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || '',

  // Public keys (exposed to client)
  public: {
    siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    plausibleDomain: process.env.PLAUSIBLE_DOMAIN || 'adul21.fr',
  }
}
```

**Points positifs**:
- Séparation claire variables privées/publiques
- Variables privées jamais exposées au client
- Valeurs par défaut pour développement

**⚠️ Points d'amélioration**:
- Valeurs par défaut faibles (chaînes vides)
- Pas de validation des variables requises au démarrage
- Pas de secrets dans fichier `.env.example`

### Recommandations

1. **Générer un secret JWT fort**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. **Valider les variables au démarrage**:
```typescript
// server/plugins/validate-env.ts
export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()

  if (!config.jwtSecret || config.jwtSecret === 'your-secret-key-change-me') {
    throw new Error('JWT_SECRET must be set in environment variables')
  }

  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL must be set')
  }
})
```

3. **Utiliser des outils de gestion de secrets**:
- En développement: `.env` (gitignored)
- En production: Variables d'environnement système, Vault, AWS Secrets Manager, etc.

---

## Sécurité base de données

### Drizzle ORM

**Fichier**: `/home/adul21/adul21-website/server/database/connection.ts`

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/adul21'
const queryClient = postgres(connectionString)
export const db = drizzle(queryClient, { schema })
```

**Points positifs**:
- Utilisation d'un ORM typé (Drizzle)
- Requêtes préparées automatiques (protection SQL injection)
- Type-safety avec TypeScript

### Protection contre SQL Injection

Drizzle utilise des requêtes paramétrées:

```typescript
// ✓ SÉCURISÉ - Requête paramétrée
const [admin] = await db
  .select()
  .from(adminUsers)
  .where(eq(adminUsers.email, email))  // email est un paramètre
  .limit(1)

// ✗ DANGEREUX - Requête brute (non présente dans le projet)
// await db.execute(`SELECT * FROM admin_users WHERE email = '${email}'`)
```

**Analyse**: Toutes les requêtes utilisent le query builder de Drizzle → Protection SQL injection ✓

### Gestion des erreurs DB

```typescript
try {
  const [newTestimony] = await db.insert(testimonies).values(validatedData)
  return { success: true, data: newTestimony }
} catch (error: any) {
  console.error('Error creating testimony:', error)

  throw createError({
    statusCode: 500,
    statusMessage: 'Erreur lors de l\'enregistrement du témoignage'
  })
}
```

**Points positifs**:
- Erreurs DB loguées côté serveur
- Messages d'erreur génériques au client (pas de leak d'infos)

**⚠️ Point d'amélioration**:
- Logs en console uniquement (pas de système de monitoring)
- Pas de différenciation des types d'erreurs (contrainte unique, etc.)

### Contraintes de sécurité DB

```typescript
// Unicité email
email: varchar('email', { length: 255 }).notNull().unique()

// UUID par défaut (pas d'énumération séquentielle)
id: uuid('id').primaryKey().defaultRandom()

// Valeurs par défaut sécurisées
isPublished: boolean('is_published').notNull().default(false)
moderationStatus: varchar('moderation_status').notNull().default('pending')
```

**Points positifs**:
- UUID aléatoires (impossible de deviner les IDs)
- Contraintes d'unicité (email, slug)
- Valeurs par défaut sécurisées (non publié par défaut)

---

## Sécurité des cookies

### Configuration des cookies JWT

**Fichier**: `/home/adul21/adul21-website/server/utils/jwt.ts`

```typescript
export function setTokenCookie(event: H3Event, token: string) {
  setCookie(event, 'admin_token', token, {
    httpOnly: true,                               // ✓ Protection XSS
    secure: process.env.NODE_ENV === 'production', // ✓ HTTPS en prod
    sameSite: 'lax',                              // ✓ Protection CSRF
    maxAge: 60 * 60 * 24 * 7,                     // 7 jours
    path: '/'
  })
}
```

### Analyse des attributs

| Attribut | Valeur | Sécurité | Commentaire |
|----------|--------|----------|-------------|
| `httpOnly` | `true` | ✓ Excellent | Cookie inaccessible au JavaScript (protection XSS) |
| `secure` | `true` (prod) | ✓ Bon | Cookie envoyé uniquement en HTTPS |
| `sameSite` | `lax` | ⚠️ Moyen | Protection CSRF limitée |
| `maxAge` | 7 jours | ✓ Bon | Durée raisonnable |
| `path` | `/` | ✓ OK | Disponible sur tout le site |
| `domain` | Non défini | ✓ OK | Limité au domaine actuel |

### Points d'amélioration

**1. SameSite strict**

```typescript
sameSite: 'strict'  // Plus sécurisé mais peut casser les liens externes
```

**2. Cookie de session supplémentaire**

```typescript
// Cookie de vérification CSRF
setCookie(event, 'csrf_token', csrfToken, {
  httpOnly: false,  // Accessible au JS pour l'envoyer dans les requêtes
  secure: true,
  sameSite: 'strict'
})
```

---

## Protection des emails

### Configuration SMTP

**Fichier**: `/home/adul21/adul21-website/server/utils/email.ts`

```typescript
transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPassword  // ✓ App Password, pas le vrai mot de passe
  }
})
```

**Points positifs**:
- Utilisation de Gmail App Password (plus sécurisé que mot de passe principal)
- SSL/TLS activé
- Credentials en variables d'environnement

### Protection contre le spam

**⚠️ MANQUE**: Pas de rate limiting sur l'envoi d'emails

Un attaquant peut spammer le formulaire de contact pour:
- Surcharger la boîte mail
- Utiliser le serveur comme relay de spam

**Recommandation**:
```typescript
// Limiter à 5 emails par IP par heure
import rateLimit from 'express-rate-limit'

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5,
  message: 'Trop de tentatives, réessayez dans 1 heure'
})
```

### Validation des emails

```typescript
email: z.string().email('Email invalide')
```

**Points positifs**:
- Validation format email avec Zod
- Protection contre emails malformés

**⚠️ Point d'amélioration**:
- Pas de vérification de domaine (accepte `test@localhost`)
- Pas de vérification MX record

### Contenu des emails

**⚠️ VULNÉRABILITÉ XSS**: Les données utilisateur sont injectées directement dans le HTML des emails

```typescript
html: `
  <p>De : ${validatedData.civility} ${validatedData.firstName} ${validatedData.lastName}</p>
  <p style="white-space: pre-wrap;">${validatedData.message}</p>
`
```

**Impact**: Si un utilisateur envoie `<script>alert('XSS')</script>` dans le message, il sera exécuté dans le client email.

**Recommandation**:
```typescript
import DOMPurify from 'isomorphic-dompurify'

const sanitizedMessage = DOMPurify.sanitize(validatedData.message)
const sanitizedFirstName = DOMPurify.sanitize(validatedData.firstName)

html: `
  <p>De : ${sanitizedFirstName}</p>
  <p style="white-space: pre-wrap;">${sanitizedMessage}</p>
`
```

---

## Vulnérabilités identifiées

### Critique (P0 - À corriger immédiatement)

#### 1. Routes de modification sans authentification

**Fichiers**:
- `/home/adul21/adul21-website/server/api/members/[id].delete.ts`
- `/home/adul21/adul21-website/server/api/members/[id].patch.ts`
- `/home/adul21/adul21-website/server/api/testimonies/[id].delete.ts`
- `/home/adul21/adul21-website/server/api/testimonies/[id].patch.ts`

**Problème**: N'importe qui peut supprimer ou modifier des données si l'UUID est connu.

**Preuve de concept**:
```bash
# Supprimer un témoignage
curl -X DELETE https://adul21.fr/api/testimonies/123e4567-e89b-12d3-a456-426614174000

# Modifier un membre
curl -X PATCH https://adul21.fr/api/members/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{"email": "hacker@evil.com"}'
```

**Solution**:
```typescript
// Ajouter requireAuth dans TOUS les endpoints de modification
import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  await requireAuth(event)  // ✓ AJOUTER CETTE LIGNE

  const id = getRouterParam(event, 'id')
  // ...
})
```

#### 2. Pas de sanitization XSS

**Problème**: Toutes les entrées utilisateur de type texte peuvent contenir du HTML/JavaScript malveillant.

**Champs à risque**:
- `testimony_text`
- `concrete_example`
- `message` (contact)
- `description` (incidents)
- `content` (news)

**Solution**: Installer et utiliser DOMPurify

```bash
npm install isomorphic-dompurify
```

```typescript
import DOMPurify from 'isomorphic-dompurify'

const sanitizedData = {
  ...validatedData,
  testimony_text: DOMPurify.sanitize(validatedData.testimony_text),
  concrete_example: validatedData.concrete_example
    ? DOMPurify.sanitize(validatedData.concrete_example)
    : undefined
}
```

### Élevée (P1 - À corriger rapidement)

#### 3. Pas de rate limiting

**Problème**: Vulnérable aux attaques par force brute et au spam.

**Impact**:
- Tentatives illimitées de login
- Spam de formulaires (contact, témoignages)
- Surcharge serveur (DoS)

**Solution**: Implémenter un rate limiter

```bash
npm install h3-rate-limit
```

```typescript
// server/middleware/rate-limit.ts
import { defineEventHandler } from 'h3'
import { createRateLimiter } from 'h3-rate-limit'

const limiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes
  keyGenerator: (event) => getRequestIP(event, { xForwardedFor: true })
})

export default defineEventHandler(async (event) => {
  await limiter(event)
})
```

**Rate limiting spécifique pour login**:

```typescript
// server/api/auth/login.post.ts
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5, // Max 5 tentatives par 15min
  message: 'Trop de tentatives de connexion'
})

export default defineEventHandler(async (event) => {
  await loginLimiter(event)
  // ... reste du code
})
```

#### 4. Pas de CORS configuré

**Problème**: Le site accepte les requêtes depuis n'importe quelle origine.

**Impact**: Vulnérable aux attaques CSRF et requêtes non autorisées.

**Solution**: Configurer CORS

```typescript
// server/middleware/cors.ts
export default defineEventHandler((event) => {
  const origin = getRequestHeader(event, 'origin')
  const allowedOrigins = [
    'https://adul21.fr',
    'https://www.adul21.fr'
  ]

  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000')
  }

  if (origin && allowedOrigins.includes(origin)) {
    setResponseHeader(event, 'Access-Control-Allow-Origin', origin)
  }

  setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  setResponseHeader(event, 'Access-Control-Allow-Credentials', 'true')

  if (getMethod(event) === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.end()
  }
})
```

#### 5. Pas de headers de sécurité

**Problème**: Headers de sécurité HTTP manquants.

**Solution**: Ajouter des headers de sécurité

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          // Protection contre le clickjacking
          'X-Frame-Options': 'SAMEORIGIN',

          // Protection XSS navigateur
          'X-XSS-Protection': '1; mode=block',

          // Désactiver le sniffing MIME
          'X-Content-Type-Options': 'nosniff',

          // Forcer HTTPS
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

          // Content Security Policy
          'Content-Security-Policy':
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' https://plausible.io; " +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "font-src 'self' https://fonts.gstatic.com; " +
            "img-src 'self' data: https:; " +
            "connect-src 'self' https://plausible.io;",

          // Permissions Policy
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
        }
      }
    }
  }
})
```

### Moyenne (P2 - À améliorer)

#### 6. Pas de logging de sécurité

**Problème**: Pas de logs pour les événements de sécurité.

**Solution**: Implémenter un système de logging

```typescript
// server/utils/security-logger.ts
export function logSecurityEvent(event: string, details: any) {
  const timestamp = new Date().toISOString()
  console.log(`[SECURITY] ${timestamp} - ${event}`, JSON.stringify(details))

  // En production, envoyer à un service de logging (Sentry, LogRocket, etc.)
}

// Utilisation
logSecurityEvent('LOGIN_FAILED', { email, ip: getRequestIP(event) })
logSecurityEvent('UNAUTHORIZED_ACCESS', { path: event.path, ip: getRequestIP(event) })
```

#### 7. Validation téléphone trop permissive

**Problème**: Accepte n'importe quelle chaîne de 10+ caractères

```typescript
// Actuel
phone: z.string().min(10, 'Numéro de téléphone invalide')

// Recommandé
phone: z.string().regex(
  /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/,
  'Numéro de téléphone français invalide'
).optional()
```

#### 8. Pas de CAPTCHA

**Problème**: Formulaires publics vulnérables aux bots.

**Solution**: Ajouter reCAPTCHA v3 ou hCaptcha

```bash
npm install @nuxtjs/turnstile  # Cloudflare Turnstile (RGPD-friendly)
```

```typescript
// nuxt.config.ts
modules: [
  '@nuxtjs/turnstile'
],

turnstile: {
  siteKey: process.env.TURNSTILE_SITE_KEY
}
```

#### 9. Pas de 2FA pour les admins

**Recommandation**: Ajouter l'authentification à deux facteurs pour les comptes admin.

```bash
npm install speakeasy qrcode
```

#### 10. Tokens JWT non révocables

**Problème**: Un token volé reste valide jusqu'à expiration (7 jours).

**Solution**: Implémenter une blacklist de tokens

```typescript
// server/utils/token-blacklist.ts
const blacklistedTokens = new Set<string>()

export function blacklistToken(token: string) {
  blacklistedTokens.add(token)
}

export function isTokenBlacklisted(token: string): boolean {
  return blacklistedTokens.has(token)
}

// Dans requireAuth()
export async function requireAuth(event: H3Event): Promise<JWTPayload> {
  const token = getTokenFromCookie(event)

  if (!token || isTokenBlacklisted(token)) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }
  // ...
}
```

---

## Recommandations

### Court terme (Sprint 1 - 2 semaines)

#### 1. Sécuriser les routes de modification (CRITIQUE)

```typescript
// Ajouter dans TOUS les endpoints de modification/suppression
import { requireAuth } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  // ...
})
```

**Fichiers à modifier**:
- `/home/adul21/adul21-website/server/api/members/[id].delete.ts`
- `/home/adul21/adul21-website/server/api/members/[id].patch.ts`
- `/home/adul21/adul21-website/server/api/testimonies/[id].delete.ts`
- `/home/adul21/adul21-website/server/api/testimonies/[id].patch.ts`

#### 2. Ajouter sanitization XSS (CRITIQUE)

```bash
npm install isomorphic-dompurify
```

```typescript
// Créer un helper
// server/utils/sanitize.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeInput(input: string | undefined): string | undefined {
  if (!input) return input
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Supprimer tous les tags HTML
    ALLOWED_ATTR: []
  })
}

export function sanitizeHTML(input: string | undefined): string | undefined {
  if (!input) return input
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'li', 'ol'],
    ALLOWED_ATTR: []
  })
}
```

#### 3. Implémenter rate limiting (ÉLEVÉ)

```bash
npm install h3-rate-limit
```

```typescript
// server/middleware/01.rate-limit.ts
import { createRateLimiter } from 'h3-rate-limit'

const globalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
})

export default defineEventHandler((event) => {
  return globalLimiter(event)
})
```

### Moyen terme (Sprint 2-3 - 1 mois)

#### 4. Configurer CORS

```typescript
// server/middleware/02.cors.ts
export default defineEventHandler((event) => {
  const allowedOrigins = ['https://adul21.fr', 'https://www.adul21.fr']
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000')
  }

  const origin = getRequestHeader(event, 'origin')
  if (origin && allowedOrigins.includes(origin)) {
    setResponseHeader(event, 'Access-Control-Allow-Origin', origin)
    setResponseHeader(event, 'Access-Control-Allow-Credentials', 'true')
  }
})
```

#### 5. Ajouter headers de sécurité

Voir section "Headers de sécurité" ci-dessus.

#### 6. Implémenter logging de sécurité

```typescript
// server/utils/security-logger.ts
import type { H3Event } from 'h3'

export interface SecurityLogEntry {
  timestamp: Date
  event: string
  ip: string
  userAgent?: string
  userId?: string
  details: Record<string, any>
}

export async function logSecurityEvent(
  event: H3Event,
  type: string,
  details: Record<string, any> = {}
) {
  const entry: SecurityLogEntry = {
    timestamp: new Date(),
    event: type,
    ip: getRequestIP(event, { xForwardedFor: true }) || 'unknown',
    userAgent: getRequestHeader(event, 'user-agent'),
    details
  }

  console.log('[SECURITY]', JSON.stringify(entry))

  // En production: envoyer à Sentry, LogRocket, etc.
  // await sendToMonitoring(entry)
}
```

**Utilisation**:

```typescript
// Dans login.post.ts
if (!valid) {
  await logSecurityEvent(event, 'LOGIN_FAILED', { email })
  throw createError({ statusCode: 401, message: 'Email ou mot de passe incorrect' })
}

await logSecurityEvent(event, 'LOGIN_SUCCESS', { email, userId: admin.id })
```

#### 7. Ajouter CAPTCHA

```bash
npm install @nuxtjs/turnstile
```

```typescript
// nuxt.config.ts
modules: ['@nuxtjs/turnstile'],

turnstile: {
  siteKey: process.env.TURNSTILE_SITE_KEY,
  secretKey: process.env.TURNSTILE_SECRET_KEY
}
```

### Long terme (Backlog)

#### 8. Authentification à deux facteurs (2FA)

- TOTP avec speakeasy
- QR code pour scan avec Google Authenticator
- Codes de secours

#### 9. Audit de sécurité professionnel

- Pentest par une société spécialisée
- Scan de vulnérabilités automatique (Snyk, Dependabot)
- Revue de code sécurité

#### 10. Monitoring et alertes

- Sentry pour les erreurs
- Plausible Analytics déjà en place
- Alertes email sur événements suspects

#### 11. Sauvegarde et récupération

- Backups PostgreSQL automatiques
- Plan de disaster recovery
- Tests de restauration

#### 12. Politique de sécurité

- Politique de mot de passe forte
- Rotation des secrets
- Politique de rétention des données (RGPD)

---

## Checklist de sécurité

### Authentification & Autorisation

- ✓ JWT implémenté
- ✓ Bcrypt pour les mots de passe
- ✓ Cookies HttpOnly
- ✓ requireAuth() côté serveur
- ⚠️ Middleware client uniquement (pas de protection SSR)
- ✗ Pas de 2FA
- ✗ Pas de rotation de tokens
- ✗ Pas de limitation tentatives login
- ✗ Routes de modification SANS AUTH (CRITIQUE)

### Validation & Sanitization

- ✓ Validation Zod systématique
- ✓ Types TypeScript stricts
- ✓ Validation email, regex, enum
- ⚠️ Validation téléphone trop permissive
- ✗ Pas de sanitization XSS (CRITIQUE)
- ✗ Pas de validation côté client (double validation)

### Base de données

- ✓ Drizzle ORM (requêtes préparées)
- ✓ Protection SQL injection
- ✓ UUID aléatoires
- ✓ Contraintes d'unicité
- ✓ Valeurs par défaut sécurisées
- ✗ Pas de chiffrement au repos
- ✗ Pas de masquage des données sensibles

### Réseau & Transport

- ✓ HTTPS en production (via `secure: true`)
- ✗ Pas de CORS configuré
- ✗ Pas de headers de sécurité (CSP, HSTS, etc.)
- ✗ Pas de rate limiting
- ✗ Pas de protection DDoS

### Emails

- ✓ Gmail App Password
- ✓ SSL/TLS
- ✓ Validation format email
- ⚠️ Pas de sanitization dans templates (XSS)
- ✗ Pas de rate limiting envoi
- ✗ Pas de vérification domaine

### Monitoring & Logging

- ⚠️ Logs console uniquement
- ✗ Pas de logs de sécurité
- ✗ Pas de monitoring temps réel
- ✗ Pas d'alertes
- ✗ Pas de métriques de sécurité

### RGPD & Confidentialité

- ✓ Consentements explicites (acceptsNewsletter, etc.)
- ✓ Analytics sans cookies (Plausible)
- ⚠️ Pas de politique de confidentialité visible
- ✗ Pas de droit à l'oubli implémenté
- ✗ Pas d'export de données
- ✗ Pas de durée de rétention définie

### Dépendances & Code

- ✓ Dépendances récentes
- ✓ TypeScript strict
- ⚠️ Pas de scan de vulnérabilités automatique
- ✗ Pas de Dependabot
- ✗ Pas de revue de code sécurité
- ✗ Pas de tests de sécurité

### Infrastructure

- ⚠️ Secrets en variables d'environnement
- ⚠️ Pas de validation secrets au démarrage
- ✗ Pas de rotation des secrets
- ✗ Pas de secrets manager (Vault, AWS Secrets)
- ✗ Pas de backups automatiques
- ✗ Pas de plan de disaster recovery

---

## Score de sécurité global

**Note**: 4.5/10

### Répartition

- Authentification: 6/10 (JWT bon, mais pas de 2FA ni rate limiting)
- Autorisation: 3/10 (CRITIQUE: routes publiques qui devraient être protégées)
- Validation: 7/10 (Zod excellent, mais manque sanitization)
- Base de données: 8/10 (Drizzle excellent)
- Transport: 4/10 (HTTPS ok, mais pas de CORS/CSP)
- Monitoring: 2/10 (logs basiques uniquement)

### Priorisation

**Urgent (cette semaine)**:
1. Protéger les routes de modification avec `requireAuth()`
2. Ajouter sanitization XSS

**Important (ce mois)**:
3. Rate limiting
4. CORS
5. Headers de sécurité

**Améliorations (backlog)**:
6. 2FA
7. Logging avancé
8. Audit professionnel

---

## Contacts sécurité

**Signalement de vulnérabilité**: assoligne21@gmail.com

**Politique de divulgation responsable**:
1. Signaler en privé par email
2. Ne pas exploiter la vulnérabilité
3. Laisser 90 jours pour correction
4. Divulgation publique coordonnée

---

**Dernière mise à jour**: 2025-10-17
**Version**: 1.0.0
**Prochaine revue**: 2025-11-17

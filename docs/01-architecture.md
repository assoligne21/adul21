# Architecture du projet ADUL21

## Vue d'ensemble

Le site web ADUL21 est une application web moderne construite pour l'Association de Défense des Usagers de la Ligne 21. Ce projet est développé avec Nuxt 4, Vue 3, TypeScript et PostgreSQL, suivant les meilleures pratiques de développement web full-stack.

### Caractéristiques principales

- **Application full-stack** avec rendu côté serveur (SSR)
- **Type-safe** avec TypeScript strict
- **Base de données PostgreSQL** avec Drizzle ORM
- **Interface moderne** avec Nuxt UI et Tailwind CSS
- **Architecture modulaire** avec auto-imports Nuxt
- **API RESTful** avec validation Zod
- **Authentication JWT** pour l'espace administration

---

## 1. Structure du projet

### Arborescence principale

```
adul21-website/
├── assets/                 # Ressources statiques (CSS, images non-publiques)
│   └── css/
│       └── main.css        # Styles globaux Tailwind
├── components/             # Composants Vue réutilisables
│   ├── admin/             # Composants spécifiques à l'admin
│   ├── forms/             # Composants de formulaires
│   ├── home/              # Composants de la page d'accueil
│   ├── layout/            # Composants de layout (Header, Footer)
│   ├── testimonies/       # Composants pour les témoignages
│   └── ui/                # Composants UI réutilisables
├── composables/           # Composables Vue (logique réutilisable)
│   ├── useAuth.ts        # Gestion de l'authentification
│   ├── useMembers.ts     # Gestion des membres
│   ├── useSupabase.ts    # Compatibilité Supabase (legacy)
│   └── useTestimonies.ts # Gestion des témoignages
├── layouts/               # Layouts Nuxt
│   └── admin.vue         # Layout pour l'espace admin
├── middleware/            # Middlewares Nuxt (route guards)
│   └── admin-auth.ts     # Protection des routes admin
├── pages/                 # Routes de l'application (file-based routing)
│   ├── actualites/       # Pages d'actualités
│   ├── admin/            # Espace d'administration
│   │   ├── contacts/
│   │   ├── membres/
│   │   ├── newsletter/
│   │   ├── soutiens/
│   │   └── temoignages/
│   ├── rejoindre/        # Pages d'adhésion
│   ├── temoignages/      # Pages de témoignages
│   └── *.vue             # Pages publiques
├── public/                # Fichiers statiques publics
├── scripts/               # Scripts utilitaires
├── server/                # Code serveur Nuxt (API, DB, utils)
│   ├── api/              # Routes API (31 endpoints)
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── donations/
│   │   ├── incidents/
│   │   ├── members/
│   │   ├── news/
│   │   ├── newsletter/
│   │   ├── pre-members/
│   │   └── testimonies/
│   ├── database/         # Configuration et schéma DB
│   │   ├── connection.ts # Connexion Drizzle
│   │   ├── schema.ts     # Schéma de base de données
│   │   └── migrations/   # Migrations SQL
│   ├── middleware/       # Middlewares serveur (vide actuellement)
│   ├── utils/            # Utilitaires serveur
│   │   ├── db.ts        # Helper de connexion PostgreSQL
│   │   ├── email.ts     # Fonctions d'envoi d'emails
│   │   ├── hash.ts      # Hashage de mots de passe (bcrypt)
│   │   ├── jwt.ts       # Gestion des tokens JWT
│   │   └── mailer.ts    # Configuration Nodemailer
│   └── validation/       # Schémas de validation
│       └── schemas.ts    # Schémas Zod
├── types/                 # Types TypeScript
│   ├── api.ts            # Types pour les API
│   ├── database.types.ts # Types de la base de données
│   └── forms.ts          # Types pour les formulaires
├── app.config.ts          # Configuration de l'application
├── app.vue                # Composant racine de l'application
├── drizzle.config.ts      # Configuration Drizzle ORM
├── nuxt.config.ts         # Configuration Nuxt
├── package.json           # Dépendances et scripts
└── tsconfig.json          # Configuration TypeScript
```

### Conventions de nommage

#### Fichiers
- **Composants Vue** : PascalCase (ex: `AppHeader.vue`, `TestimonyCard.vue`)
- **Composables** : camelCase avec préfixe `use` (ex: `useAuth.ts`, `useMembers.ts`)
- **Routes API** : kebab-case avec méthode HTTP (ex: `login.post.ts`, `[id].delete.ts`)
- **Utilitaires** : camelCase (ex: `db.ts`, `mailer.ts`)
- **Types** : camelCase avec suffixe `.types.ts` si nécessaire

#### Code
- **Variables et fonctions** : camelCase
- **Interfaces et types** : PascalCase
- **Constantes** : UPPER_SNAKE_CASE
- **Composants** : PascalCase

---

## 2. Stack technique

### Framework et runtime

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Nuxt** | 4.1.3 | Framework Vue.js full-stack avec SSR |
| **Vue** | 3.5.22 | Framework JavaScript réactif |
| **Node.js** | - | Runtime JavaScript serveur |
| **TypeScript** | 5.9.3 | Langage typé statiquement |

### Base de données

| Technologie | Version | Rôle |
|-------------|---------|------|
| **PostgreSQL** | - | Base de données relationnelle |
| **Drizzle ORM** | 0.44.6 | ORM TypeScript-first |
| **drizzle-kit** | 0.31.5 | CLI pour migrations |
| **pg** / **postgres** | 8.13.1 / 3.4.7 | Drivers PostgreSQL |

### UI et styling

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Nuxt UI** | 4.0.1 | Bibliothèque de composants UI |
| **Tailwind CSS** | 4.1.0 | Framework CSS utility-first |
| **Nuxt Icon** | 2.0.0 | Composant d'icônes |
| **Inter Font** | - | Police Google Fonts |

### State management et utilitaires

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Pinia** | 0.11.2 | Store de gestion d'état |
| **VueUse** | 13.9.0 | Collection de composables Vue |
| **Vue Router** | 4.5.1 | Routeur officiel Vue |

### Authentification et sécurité

| Technologie | Version | Rôle |
|-------------|---------|------|
| **jsonwebtoken** | 9.0.2 | Génération et validation JWT |
| **bcrypt** | 6.0.0 | Hashage de mots de passe |
| **Zod** | 3.25.76 | Validation de schémas |

### Email et communication

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Nodemailer** | 7.0.9 | Envoi d'emails SMTP |
| **Gmail SMTP** | - | Service d'envoi d'emails |

### Développement

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Nuxt DevTools** | 2.6.5 | Outils de développement |
| **vue-tsc** | 3.1.1 | Type-checking Vue |
| **dotenv** | 17.2.3 | Gestion des variables d'environnement |

### Utilitaires

| Technologie | Version | Rôle |
|-------------|---------|------|
| **date-fns** | 4.1.0 | Manipulation de dates |
| **sharp** | 0.34.4 | Traitement d'images |

---

## 3. Patterns et conventions

### 3.1 Composition API

Le projet utilise exclusivement la **Composition API** de Vue 3 avec `<script setup>`.

**Exemple** :
```vue
<script setup lang="ts">
const colorMode = useColorMode()
const route = useRoute()

const isActive = computed(() => route.path === '/admin')

const handleClick = () => {
  // Logic here
}
</script>
```

### 3.2 Auto-imports Nuxt

Nuxt 4 importe automatiquement :
- Les composants depuis `/components`
- Les composables depuis `/composables`
- Les utilitaires Vue (`ref`, `computed`, `watch`, etc.)
- Les utilitaires Nuxt (`useState`, `useFetch`, `navigateTo`, etc.)

**Pas besoin d'imports explicites** :
```typescript
// ❌ Pas nécessaire
import { ref, computed } from 'vue'
import { useState } from '#app'

// ✅ Auto-importé
const count = ref(0)
const doubled = computed(() => count.value * 2)
const user = useState('user')
```

### 3.3 File-based routing

Les routes sont générées automatiquement depuis le dossier `/pages`.

**Structure** :
```
pages/
├── index.vue                    → /
├── contact.vue                  → /contact
├── temoignages/
│   ├── index.vue               → /temoignages
│   └── [id].vue                → /temoignages/:id
└── admin/
    ├── index.vue               → /admin
    └── membres/
        ├── index.vue           → /admin/membres
        └── [id].vue            → /admin/membres/:id
```

**Paramètres dynamiques** : `[id].vue` crée une route avec paramètre `:id`

### 3.4 Server routes

Les routes API suivent le même pattern file-based dans `/server/api`.

**Structure** :
```
server/api/
├── contact.post.ts              → POST /api/contact
├── news/
│   ├── index.get.ts            → GET /api/news
│   ├── index.post.ts           → POST /api/news
│   ├── [id].get.ts             → GET /api/news/:id
│   ├── [id].patch.ts           → PATCH /api/news/:id
│   └── [id].delete.ts          → DELETE /api/news/:id
```

**Exemple de route API** :
```typescript
// server/api/news/index.get.ts
export default defineEventHandler(async (event) => {
  const db = await useDatabase()
  const news = await db.select().from(schema.news)
  return news
})
```

### 3.5 Composables pattern

Les composables encapsulent la logique réutilisable et l'état.

**Exemple** : `/composables/useAuth.ts`
```typescript
export const useAuth = () => {
  const user = useState<AdminUser | null>('admin-user', () => null)
  const loading = useState<boolean>('auth-loading', () => false)

  const login = async (email: string, password: string) => {
    // Login logic
  }

  const logout = async () => {
    // Logout logic
  }

  return {
    user,
    loading,
    login,
    logout
  }
}
```

**Utilisation** :
```vue
<script setup lang="ts">
const { user, login, logout } = useAuth()
</script>
```

### 3.6 Type safety

TypeScript strict est activé pour garantir la sécurité des types.

**Configuration** (`nuxt.config.ts`) :
```typescript
typescript: {
  strict: true,
  typeCheck: false // Désactivé en dev pour performance
}
```

**Validation avec Zod** :
```typescript
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
})

type ContactForm = z.infer<typeof contactSchema>
```

---

## 4. Architecture serveur

### 4.1 Structure des API routes

Le projet contient **31 routes API** organisées par domaine fonctionnel :

```
server/api/
├── auth/                     # Authentification (3 routes)
│   ├── login.post.ts        # Connexion admin
│   ├── logout.post.ts       # Déconnexion
│   └── me.get.ts            # Vérification session
├── members/                  # Gestion des membres (5 routes)
│   ├── index.get.ts         # Liste des membres
│   ├── index.post.ts        # Créer un membre
│   ├── [id].get.ts          # Détail d'un membre
│   ├── [id].patch.ts        # Modifier un membre
│   └── [id].delete.ts       # Supprimer un membre
├── testimonies/              # Gestion des témoignages (6 routes)
│   ├── index.get.ts
│   ├── index.post.ts
│   ├── [id].get.ts
│   ├── [id].patch.ts
│   ├── [id].delete.ts
│   └── [id]/increment-views.post.ts
├── news/                     # Gestion des actualités (6 routes)
│   ├── index.get.ts
│   ├── index.post.ts
│   ├── [slug].get.ts        # Get par slug (SEO)
│   ├── [id].get.ts
│   ├── [id].patch.ts
│   └── [id].delete.ts
├── pre-members/              # Pré-adhérents (2 routes)
│   ├── index.post.ts
│   └── count.get.ts
├── admin/                    # Admin dashboard (3 routes)
│   ├── stats.get.ts
│   ├── newsletter.get.ts
│   └── pre-members.get.ts
├── donations/                # Dons (1 route)
│   └── index.post.ts
├── incidents/                # Signalement d'incidents (1 route)
│   └── index.post.ts
├── newsletter/               # (routes à vérifier)
├── contact.post.ts           # Formulaire de contact
└── membership.post.ts        # Adhésion membre
```

### 4.2 Middleware serveur

Actuellement, le dossier `/server/middleware` est vide. Les middlewares sont gérés au niveau de l'application.

**Middleware de route** : `/middleware/admin-auth.ts`
```typescript
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/admin/login') {
    return
  }

  if (to.path.startsWith('/admin')) {
    const { checkAuth } = useAuth()
    const isAuth = await checkAuth()

    if (!isAuth) {
      return navigateTo('/admin/login')
    }
  }
})
```

### 4.3 Utils et helpers serveur

Le dossier `/server/utils` contient les utilitaires serveur :

#### **db.ts** - Connexion PostgreSQL (pool)
```typescript
import pg from 'pg'

let pool: pg.Pool | null = null

export const getDb = () => {
  if (!pool) {
    const config = useRuntimeConfig()
    pool = new Pool({
      connectionString: config.databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}
```

#### **jwt.ts** - Gestion des tokens JWT
- Génération de tokens
- Vérification de tokens
- Extraction depuis les cookies

#### **hash.ts** - Hashage de mots de passe
- `hashPassword()` : Hash avec bcrypt
- `verifyPassword()` : Vérification de hash

#### **mailer.ts** - Configuration Nodemailer
- Configuration Gmail SMTP
- Template d'emails

#### **email.ts** - Fonctions d'envoi d'emails
- Emails de bienvenue
- Notifications
- Confirmations

#### **supabase-compat.ts** - Compatibilité legacy
- Compatibilité avec l'ancien système Supabase

### 4.4 Database connection

La connexion à la base de données utilise **Drizzle ORM** avec deux clients :

**Fichier** : `/server/database/connection.ts`
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/adul21'

// Pour les requêtes
const queryClient = postgres(connectionString)
export const db = drizzle(queryClient, { schema })

// Pour les migrations
export const migrationClient = postgres(connectionString, { max: 1 })
```

**Configuration Drizzle** : `drizzle.config.ts`
```typescript
export default {
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/adul21'
  },
  verbose: true,
  strict: true
} satisfies Config
```

---

## 5. Schéma de base de données

Le schéma est défini dans `/server/database/schema.ts` avec **9 tables principales** :

### Tables principales

1. **testimonies** - Témoignages d'usagers
   - Informations personnelles (nom, email, ville, âge)
   - Profil utilisateur (type, école, travail)
   - Usage avant/après la modification
   - Contenu du témoignage
   - Préférences de publication
   - Statut de modération
   - Statistiques (vues, réactions, partages)

2. **members** - Membres de l'association
   - Informations personnelles et contact
   - Profil utilisateur
   - Adhésion (cotisation, type, statut)
   - Engagement (participation, consentements)
   - Administration (notes, rôle admin)

3. **preMembers** - Pré-adhérents (avant création officielle)
   - Informations de contact
   - Intentions (devenir membre, bénévolat, actions)
   - Consentements (newsletter, AG)
   - Conversion vers membre

4. **news** - Actualités
   - Titre, slug, contenu
   - Image de couverture
   - Statut de publication
   - SEO (metaTitle, metaDescription)
   - Statistiques (vues)

5. **donations** - Dons
   - Informations du donateur
   - Montant et devise
   - Intégration Stripe
   - Statut et confirmation
   - Reçu fiscal

6. **subscriptions** - Dons récurrents
   - Informations d'abonnement
   - Intégration Stripe Subscriptions
   - Gestion de la récurrence

7. **incidents** - Signalements d'incidents
   - Date et heure de l'incident
   - Type d'incident et ligne de bus
   - Description
   - Conséquences (retard, taxi, etc.)

8. **newsletterSubscribers** - Abonnés newsletter
   - Email et nom
   - Statut actif/inactif
   - Source de l'abonnement

9. **contactMessages** - Messages de contact
   - Informations de l'expéditeur
   - Sujet et message
   - Statut de traitement (nouveau, lu, répondu)
   - Notes de suivi

10. **adminUsers** - Administrateurs
    - Email et mot de passe hashé
    - Nom
    - Statut actif
    - Dernière connexion

### Types de données

- **UUID** : Identifiants uniques (`uuid().primaryKey().defaultRandom()`)
- **Timestamps** : Dates de création/modification
- **Varchar** : Chaînes de caractères avec limite
- **Text** : Texte long (témoignages, descriptions)
- **Decimal** : Montants financiers (précision 10,2)
- **Integer** : Nombres entiers (compteurs, durées)
- **Boolean** : Drapeaux (consentements, statuts)
- **JSON** : Tableaux dynamiques (`json().$type<string[]>()`)

---

## 6. Configuration de l'application

### 6.1 Nuxt config

**Fichier** : `nuxt.config.ts`

#### Modules
```typescript
modules: [
  '@nuxt/ui',           // Composants UI
  '@pinia/nuxt',        // State management
  '@vueuse/nuxt',       // Composables utilities
  '@nuxt/icon'          // Icônes
]
```

#### Runtime Config
```typescript
runtimeConfig: {
  // Privé (serveur uniquement)
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  gmailUser: process.env.GMAIL_USER,
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
  emailFrom: process.env.EMAIL_FROM,

  // Public (exposé au client)
  public: {
    siteUrl: process.env.SITE_URL,
    plausibleDomain: process.env.PLAUSIBLE_DOMAIN,
    associationCreated: process.env.ASSOCIATION_CREATED === 'true'
  }
}
```

#### Head configuration
- Charset UTF-8
- Viewport responsive
- Meta tags SEO
- Open Graph et Twitter Card
- Favicon et Apple Touch Icon
- Google Fonts (Inter)
- Plausible Analytics (RGPD-friendly)

#### Autres configurations
- **Preset Nitro** : `node-server`
- **TypeScript strict** : Activé
- **DevTools** : Activé en développement
- **Compatibility version** : 4 (Nuxt 4)

### 6.2 Variables d'environnement

**Fichier** : `.env.example`

```bash
# Général
NODE_ENV=development
SITE_URL=http://localhost:3000

# PostgreSQL
DATABASE_URL=postgresql://adul21:password@localhost:5432/adul21

# Email (Gmail SMTP)
GMAIL_USER=assoligne21@gmail.com
GMAIL_APP_PASSWORD=
EMAIL_FROM=ADUL21 <assoligne21@gmail.com>

# Stripe (paiements)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Auth
JWT_SECRET=

# Analytics
PLAUSIBLE_DOMAIN=adul21.fr

# Association status
ASSOCIATION_CREATED=false
```

---

## 7. Scripts NPM

```json
{
  "scripts": {
    "dev": "nuxt dev",              # Serveur de développement
    "build": "nuxt build",          # Build production
    "generate": "nuxt generate",    # Génération statique (SSG)
    "preview": "nuxt preview",      # Preview du build
    "postinstall": "nuxt prepare",  # Préparation après installation

    "db:generate": "drizzle-kit generate",  # Générer migration SQL
    "db:migrate": "drizzle-kit migrate",    # Appliquer migrations
    "db:push": "drizzle-kit push",          # Push schema vers DB
    "db:studio": "drizzle-kit studio"       # Interface de gestion DB
  }
}
```

---

## 8. Flow de données

### 8.1 Authentification

```
┌─────────────┐
│   Client    │
│ (Vue page)  │
└──────┬──────┘
       │ login(email, password)
       ▼
┌─────────────────┐
│   useAuth()     │ (composable)
│   composable    │
└──────┬──────────┘
       │ $fetch('/api/auth/login', { POST })
       ▼
┌──────────────────────┐
│  /api/auth/login.ts  │ (server route)
└──────┬───────────────┘
       │ 1. Valide les credentials
       │ 2. Hash password avec bcrypt
       │ 3. Génère JWT token
       │ 4. Set cookie HTTP-only
       ▼
┌──────────────┐
│   Database   │
│  adminUsers  │
└──────────────┘
```

### 8.2 Gestion des témoignages

```
┌──────────────┐
│  Client Form │
└──────┬───────┘
       │ submitTestimony(data)
       ▼
┌──────────────────────────┐
│ /api/testimonies/        │
│ index.post.ts            │
└──────┬───────────────────┘
       │ 1. Valide avec Zod schema
       │ 2. Insert dans DB
       │ 3. Envoie email de confirmation
       ▼
┌──────────────┐         ┌──────────────┐
│  PostgreSQL  │         │ Gmail SMTP   │
│ testimonies  │         │ (Nodemailer) │
└──────────────┘         └──────────────┘
```

### 8.3 Middleware de protection

```
Route: /admin/membres
       │
       ▼
┌────────────────────────┐
│  admin-auth.ts         │ (middleware)
│  Vérifie auth          │
└────────┬───────────────┘
         │ isAuth?
         ├─ NO ──> navigateTo('/admin/login')
         │
         ▼ YES
┌────────────────────────┐
│  Page /admin/membres   │
│  Rendu autorisé        │
└────────────────────────┘
```

---

## 9. Diagramme d'architecture global

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Vue Pages  │  │  Components  │  │  Composables │      │
│  │  (routing)   │  │   (UI/UX)    │  │   (logic)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
                    HTTP / WebSocket
                             │
┌────────────────────────────┼────────────────────────────────┐
│                    NUXT SERVER (Nitro)                       │
│                            │                                │
│  ┌─────────────────────────▼──────────────────────────┐     │
│  │              API Routes (/server/api)              │     │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │     │
│  │  │  Auth  │ │ Members│ │ Testi- │ │  News  │      │     │
│  │  │        │ │        │ │ monies │ │        │      │     │
│  │  └────────┘ └────────┘ └────────┘ └────────┘      │     │
│  └────────────────────┬────────────────────────────────┘     │
│                       │                                     │
│  ┌────────────────────▼────────────────────────────────┐     │
│  │           Server Utils & Middleware                 │     │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │     │
│  │  │ DB   │ │ JWT  │ │ Hash │ │Email │ │Mailer│      │     │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘      │     │
│  └────────────────────┬────────────────────────────────┘     │
│                       │                                     │
└───────────────────────┼─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌───────────────┐ ┌────────────┐ ┌──────────────┐
│  PostgreSQL   │ │ Gmail SMTP │ │ Plausible.io │
│  (Database)   │ │  (Emails)  │ │  (Analytics) │
│               │ │            │ │              │
│ • testimonies │ │ Nodemailer │ │   Privacy    │
│ • members     │ │  Gmail App │ │   Focused    │
│ • news        │ │  Password  │ │              │
│ • donations   │ │            │ │              │
│ • ...         │ │            │ │              │
└───────────────┘ └────────────┘ └──────────────┘
```

---

## 10. Points d'attention pour développeurs

### 10.1 Bonnes pratiques

✅ **À faire** :
- Utiliser les composables pour la logique réutilisable
- Valider toutes les données avec Zod côté serveur
- Typer strictement avec TypeScript
- Utiliser les auto-imports Nuxt
- Créer des migrations pour chaque modification de schéma
- Tester les routes API avec des outils comme Postman
- Utiliser `useState` pour l'état partagé au lieu de Pinia (sauf cas complexes)

❌ **À éviter** :
- Modifier directement le schéma DB sans migration
- Exposer des données sensibles dans le runtimeConfig public
- Utiliser `any` en TypeScript
- Créer des composables trop complexes
- Dupliquer la logique entre composants
- Oublier de gérer les erreurs dans les routes API

### 10.2 Sécurité

- **JWT tokens** : Stockés dans des cookies HTTP-only
- **Passwords** : Hashés avec bcrypt (coût 10)
- **Validation** : Zod schemas pour toutes les entrées utilisateur
- **CORS** : Configuré pour l'origine du site uniquement
- **SQL Injection** : Prévenu par Drizzle ORM (requêtes paramétrées)
- **XSS** : Protection Vue.js par défaut (échappement HTML)

### 10.3 Performance

- **SSR** : Rendu côté serveur pour le SEO et temps de chargement
- **Code splitting** : Automatique avec Nuxt
- **Images** : Utiliser `sharp` pour l'optimisation
- **Database** : Pool de connexions (max 20)
- **Caching** : À implémenter pour les pages statiques

### 10.4 Déploiement

Le projet est configuré pour :
- **Preset** : `node-server`
- **Build** : `npm run build`
- **Variables d'env** : Fichier `.env` (voir `.env.example`)
- **Migrations** : `npm run db:push` ou `npm run db:migrate`
- **Port** : 3000 par défaut (configurable via `PORT`)

---

## 11. Ressources et documentation

### Documentation officielle

- [Nuxt 4 Documentation](https://nuxt.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Nuxt UI](https://ui.nuxt.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/)

### Guides du projet

- `README.md` - Guide général
- `DEPLOYMENT.md` - Guide de déploiement
- `GMAIL_SMTP_GUIDE.md` - Configuration Gmail SMTP
- `GITHUB_ACCESS_GUIDE.md` - Accès GitHub
- `COOLIFY_ENV.md` - Variables d'environnement Coolify

---

## 12. Glossaire

| Terme | Définition |
|-------|------------|
| **SSR** | Server-Side Rendering - Rendu côté serveur |
| **Composable** | Fonction réutilisable avec logique Vue (Composition API) |
| **ORM** | Object-Relational Mapping - Mapping objet-relationnel |
| **JWT** | JSON Web Token - Token d'authentification |
| **Middleware** | Fonction exécutée avant une route |
| **Schema** | Structure de données définie (DB ou validation) |
| **Migration** | Script de modification de la base de données |
| **Slug** | URL-friendly version d'un titre (ex: `mon-article`) |
| **CRUD** | Create, Read, Update, Delete |
| **Type-safe** | Sécurisé par les types (TypeScript) |

---

**Version** : 1.0
**Dernière mise à jour** : 2025-10-17
**Mainteneur** : Équipe ADUL21

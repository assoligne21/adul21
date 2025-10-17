# Configuration du Projet ADUL21

## Table des matières

1. [Configuration Nuxt](#1-configuration-nuxt)
2. [Variables d'environnement](#2-variables-denvironnement)
3. [Configuration Docker](#3-configuration-docker)
4. [Configuration Drizzle ORM](#4-configuration-drizzle-orm)
5. [Configuration Coolify](#5-configuration-coolify)
6. [Scripts npm](#6-scripts-npm)
7. [Configuration TypeScript](#7-configuration-typescript)
8. [Déploiement](#8-déploiement)

---

## 1. Configuration Nuxt

### Fichier : `/home/adul21/adul21-website/nuxt.config.ts`

#### 1.1 Métadonnées du projet

```typescript
compatibilityDate: '2024-10-12'
devtools: { enabled: true }
future: {
  compatibilityVersion: 4  // Nuxt 4 compatibility
}
```

#### 1.2 Modules installés

```typescript
modules: [
  '@nuxt/ui',        // Composants UI + TailwindCSS
  '@pinia/nuxt',     // State management
  '@vueuse/nuxt',    // Composition utilities
  '@nuxt/icon'       // Icon system
]
```

**Détails des modules :**

| Module | Rôle | Documentation |
|--------|------|--------------|
| `@nuxt/ui` | Système de design avec TailwindCSS 4, composants prêts à l'emploi | https://ui.nuxt.com |
| `@pinia/nuxt` | Gestion d'état réactive (alternative à Vuex) | https://pinia.vuejs.org |
| `@vueuse/nuxt` | Collection de composables Vue (useFetch, useStorage, etc.) | https://vueuse.org |
| `@nuxt/icon` | Accès à 200k+ icônes (Iconify) | https://nuxt.com/modules/icon |

#### 1.3 Runtime Config

##### Variables serveur (privées)

Accessibles uniquement côté serveur via `useRuntimeConfig()` :

```typescript
runtimeConfig: {
  // Base de données
  databaseUrl: process.env.DATABASE_URL || '',

  // Authentification
  jwtSecret: process.env.JWT_SECRET || '',

  // Email (Gmail SMTP)
  gmailUser: process.env.GMAIL_USER || '',
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || 'ADUL21 <assoligne21@gmail.com>',
}
```

##### Variables publiques (exposées au client)

Accessibles partout via `useRuntimeConfig().public` :

```typescript
runtimeConfig: {
  public: {
    siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    plausibleDomain: process.env.PLAUSIBLE_DOMAIN || 'adul21.fr',

    // Contrôle la phase de l'association
    // false = Phase 1 (pré-adhésions)
    // true = Phase 2 (adhésions complètes)
    associationCreated: process.env.ASSOCIATION_CREATED === 'true'
  }
}
```

**Usage dans le code :**

```typescript
// Server-side (API routes)
const config = useRuntimeConfig()
const dbUrl = config.databaseUrl  // OK
const siteUrl = config.public.siteUrl  // OK

// Client-side (composants)
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl  // OK
const dbUrl = config.databaseUrl  // Erreur ! Indisponible côté client
```

#### 1.4 App Config (SEO & Meta)

```typescript
app: {
  head: {
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1',
    title: 'ADUL21 - Association de Défense des Usagers de la Ligne 21',
    htmlAttrs: { lang: 'fr' },

    meta: [
      { name: 'description', content: '...' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'fr_FR' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ],

    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:...' }
    ],

    script: [
      // Plausible Analytics (RGPD-friendly)
      {
        defer: true,
        'data-domain': 'adul21.fr',
        src: 'https://plausible.io/js/script.js'
      }
    ]
  }
}
```

#### 1.5 Nitro Config

```typescript
nitro: {
  preset: 'node-server'  // Déploiement serveur Node.js
}
```

**Presets disponibles :**
- `node-server` : Serveur Node.js classique (utilisé ici)
- `vercel` : Déploiement Vercel
- `cloudflare` : Cloudflare Workers
- `netlify` : Netlify Functions

#### 1.6 TypeScript Config

```typescript
typescript: {
  strict: true,        // Mode strict TypeScript
  typeCheck: false     // Désactivé pour accélérer le build en dev
}
```

#### 1.7 App Config (Nuxt UI)

Fichier : `/home/adul21/adul21-website/app.config.ts`

```typescript
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',    // Couleur principale (ligne 21)
      neutral: 'neutral'    // Couleur neutre
    }
  }
})
```

---

## 2. Variables d'environnement

### Fichier : `/home/adul21/adul21-website/.env.example`

#### 2.1 Configuration complète

```bash
# Copier ce fichier en .env et remplir les valeurs

# Général
NODE_ENV=development
SITE_URL=http://localhost:3000

# PostgreSQL
DATABASE_URL=postgresql://adul21:password@localhost:5432/adul21
POSTGRES_DB=adul21
POSTGRES_USER=adul21
POSTGRES_PASSWORD=

# Email (Gmail SMTP)
# Voir GMAIL_SMTP_GUIDE.md pour la configuration
GMAIL_USER=assoligne21@gmail.com
GMAIL_APP_PASSWORD=
EMAIL_FROM=ADUL21 <assoligne21@gmail.com>

# Stripe (pour paiements adhésion et dons)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Auth
JWT_SECRET=

# Analytics (optionnel)
PLAUSIBLE_DOMAIN=adul21.fr

# Association status (false = Phase 1, true = Phase 2)
ASSOCIATION_CREATED=false
```

#### 2.2 Description détaillée des variables

| Variable | Type | Obligatoire | Description | Valeur par défaut |
|----------|------|-------------|-------------|-------------------|
| **Général** |
| `NODE_ENV` | string | Non | Environnement (`development`, `production`) | `development` |
| `SITE_URL` | string | Oui | URL publique du site | `http://localhost:3000` |
| **Base de données** |
| `DATABASE_URL` | string | Oui | URL de connexion PostgreSQL | - |
| `POSTGRES_DB` | string | Oui (Docker) | Nom de la base | `adul21` |
| `POSTGRES_USER` | string | Oui (Docker) | Utilisateur PostgreSQL | `adul21` |
| `POSTGRES_PASSWORD` | string | Oui | Mot de passe PostgreSQL | - |
| **Email** |
| `GMAIL_USER` | string | Oui | Adresse Gmail | - |
| `GMAIL_APP_PASSWORD` | string | Oui | Mot de passe d'application Gmail | - |
| `EMAIL_FROM` | string | Non | Expéditeur des emails | `ADUL21 <assoligne21@gmail.com>` |
| **Paiements** |
| `STRIPE_SECRET_KEY` | string | Non | Clé secrète Stripe | - |
| `STRIPE_PUBLISHABLE_KEY` | string | Non | Clé publique Stripe | - |
| `STRIPE_WEBHOOK_SECRET` | string | Non | Secret webhook Stripe | - |
| **Authentification** |
| `JWT_SECRET` | string | Oui | Secret pour JWT (min 32 caractères) | - |
| **Analytics** |
| `PLAUSIBLE_DOMAIN` | string | Non | Domaine Plausible Analytics | `adul21.fr` |
| **Configuration métier** |
| `ASSOCIATION_CREATED` | boolean | Non | Phase de l'association | `false` |

#### 2.3 Génération de secrets sécurisés

```bash
# JWT_SECRET (32+ caractères)
openssl rand -base64 32

# POSTGRES_PASSWORD
openssl rand -base64 24
```

#### 2.4 Configuration par environnement

##### Développement local

```bash
NODE_ENV=development
SITE_URL=http://localhost:3000
DATABASE_URL=postgresql://adul21:password@localhost:5432/adul21
ASSOCIATION_CREATED=false
```

##### Production

```bash
NODE_ENV=production
SITE_URL=https://adul21.fr
DATABASE_URL=postgresql://user:pass@postgres-prod:5432/adul21
ASSOCIATION_CREATED=true
JWT_SECRET=<secret-sécurisé-32-chars>
```

---

## 3. Configuration Docker

### 3.1 Dockerfile

Fichier : `/home/adul21/adul21-website/Dockerfile`

#### Architecture multi-stage

```dockerfile
# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci  # Toutes les dépendances (dev + prod)

# Copie du code source
COPY . .

# Build de l'application
ARG SITE_URL=https://adul21.fr
ENV SITE_URL=${SITE_URL}
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

# Copie des fichiers buildés
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json /app/

# Installation des dépendances de production uniquement
RUN npm ci --omit=dev

# Variables d'environnement
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Démarrage
CMD ["node", ".output/server/index.mjs"]
```

**Avantages du multi-stage :**
- Image finale légère (pas de devDependencies)
- Build cache optimisé
- Sécurité (pas de code source dans l'image finale)

### 3.2 docker-compose.yml

Fichier : `/home/adul21/adul21-website/docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL 16
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${POSTGRES_DB:-adul21}
      - POSTGRES_USER=${POSTGRES_USER:-adul21}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./postgres-schema.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - adul21-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-adul21} -d ${POSTGRES_DB:-adul21}"]
      interval: 5s
      timeout: 5s
      retries: 10
      start_period: 10s

  # Application Nuxt
  adul21-web:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    expose:
      - "3000"
    environment:
      - NODE_ENV=production
      - SITE_URL=${SITE_URL}
      - DATABASE_URL=postgresql://${POSTGRES_USER:-adul21}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB:-adul21}
      - GMAIL_USER=${GMAIL_USER}
      - GMAIL_APP_PASSWORD=${GMAIL_APP_PASSWORD}
      - EMAIL_FROM=${EMAIL_FROM}
      - JWT_SECRET=${JWT_SECRET}
      - PLAUSIBLE_DOMAIN=${PLAUSIBLE_DOMAIN}
      - ASSOCIATION_CREATED=${ASSOCIATION_CREATED:-false}
    networks:
      - adul21-network
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://localhost:3000').then(() => process.exit(0)).catch(() => process.exit(1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  adul21-network:
    driver: bridge

volumes:
  postgres-data:
```

#### Services définis

| Service | Image | Port | Rôle |
|---------|-------|------|------|
| `postgres` | `postgres:16-alpine` | 5432 (interne) | Base de données PostgreSQL |
| `adul21-web` | Build local | 3000 | Application Nuxt |

#### Volumes

- `postgres-data` : Données PostgreSQL persistantes
- `./postgres-schema.sql` : Script d'initialisation de la BDD (monté en read-only)

#### Healthchecks

**PostgreSQL :**
```bash
pg_isready -U adul21 -d adul21
# Vérifie que PostgreSQL accepte les connexions
```

**Application :**
```javascript
fetch('http://localhost:3000')
// Vérifie que le serveur Nuxt répond
```

### 3.3 .dockerignore

Fichier : `/home/adul21/adul21-website/.dockerignore`

```
node_modules
.nuxt
.output
.env
.env.*
!.env.example
.git
coverage
*.md
!package.json
```

**Pourquoi exclure ces fichiers ?**
- `node_modules` : Réinstallés dans le conteneur
- `.nuxt`, `.output` : Générés lors du build
- `.env*` : Secrets injectés via variables d'environnement
- `.git`, `*.md` : Inutiles en production

### 3.4 Commandes Docker

```bash
# Build et démarrage
docker-compose up -d

# Logs
docker-compose logs -f adul21-web
docker-compose logs -f postgres

# Arrêt
docker-compose down

# Rebuild complet
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Accès à la BDD
docker-compose exec postgres psql -U adul21 -d adul21

# Exécution de migrations
docker-compose exec adul21-web npm run db:push
```

---

## 4. Configuration Drizzle ORM

### 4.1 drizzle.config.ts

Fichier : `/home/adul21/adul21-website/drizzle.config.ts`

```typescript
import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config()

export default {
  schema: './server/database/schema.ts',      // Schéma TypeScript
  out: './server/database/migrations',        // Migrations SQL générées
  dialect: 'postgresql',                      // Dialecte SQL
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/adul21'
  },
  verbose: true,  // Logs détaillés
  strict: true    // Mode strict (vérifie les changements)
} satisfies Config
```

### 4.2 Scripts de base de données

Définis dans `/home/adul21/adul21-website/package.json` :

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",  // Génère les migrations SQL
    "db:migrate": "drizzle-kit migrate",    // Applique les migrations
    "db:push": "drizzle-kit push",          // Push direct du schéma (dev)
    "db:studio": "drizzle-kit studio"       // Interface web Drizzle Studio
  }
}
```

#### Workflow de migration

```bash
# 1. Modifier le schéma
# Éditer server/database/schema.ts

# 2. Générer la migration SQL
npm run db:generate
# Crée un fichier dans server/database/migrations/

# 3. Vérifier la migration générée
cat server/database/migrations/0001_xxx.sql

# 4. Appliquer la migration
npm run db:migrate

# Alternative : Push direct (dev uniquement)
npm run db:push
```

#### Drizzle Studio

```bash
npm run db:studio
# Ouvre https://local.drizzle.studio
# Interface graphique pour explorer/éditer la BDD
```

### 4.3 Fichier de schéma

Exemple : `/home/adul21/adul21-website/server/database/schema.ts`

```typescript
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'

export const preMembers = pgTable('pre_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  // ...
})
```

### 4.4 Connexion à la base

Fichier : `/home/adul21/adul21-website/server/database/client.ts`

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const config = useRuntimeConfig()
const client = postgres(config.databaseUrl)
export const db = drizzle(client, { schema })
```

**Usage dans une API route :**

```typescript
// server/api/members/index.get.ts
import { db } from '~/server/database/client'
import { preMembers } from '~/server/database/schema'

export default defineEventHandler(async () => {
  const members = await db.select().from(preMembers)
  return members
})
```

---

## 5. Configuration Coolify

### 5.1 Fichier .coolify

Fichier : `/home/adul21/adul21-website/.coolify`

```yaml
# Type de déploiement
type: dockerfile

# Port exposé par l'application
port: 3000

# Healthcheck
healthcheck:
  path: /
  interval: 30
  timeout: 10
  retries: 3

# Build settings
build:
  dockerfile: Dockerfile
  context: .
```

### 5.2 Variables d'environnement Coolify

À définir dans l'interface Coolify :

**Obligatoires :**
```bash
SITE_URL=https://adul21.fr
DATABASE_URL=postgresql://user:pass@host:5432/adul21
JWT_SECRET=<secret-32-chars>
GMAIL_USER=assoligne21@gmail.com
GMAIL_APP_PASSWORD=<app-password>
```

**Optionnelles :**
```bash
EMAIL_FROM=ADUL21 <assoligne21@gmail.com>
PLAUSIBLE_DOMAIN=adul21.fr
ASSOCIATION_CREATED=true
```

### 5.3 Processus de déploiement Coolify

1. **Push Git**
   ```bash
   git push origin main
   ```

2. **Coolify détecte le push**
   - Lit le fichier `.coolify`
   - Détecte le `type: dockerfile`

3. **Build de l'image Docker**
   ```bash
   docker build -f Dockerfile .
   ```

4. **Injection des variables d'environnement**
   - Variables définies dans l'UI Coolify
   - Accessibles dans le conteneur

5. **Déploiement**
   ```bash
   docker run -p 3000:3000 <image>
   ```

6. **Healthcheck**
   - Requête GET sur `/` toutes les 30s
   - Si échec après 3 tentatives : rollback

### 5.4 Commandes Coolify CLI

```bash
# Logs en temps réel
coolify logs -f <app-name>

# Redémarrage
coolify restart <app-name>

# Variables d'environnement
coolify env set <app-name> KEY=value
coolify env list <app-name>

# Déploiement manuel
coolify deploy <app-name>
```

---

## 6. Scripts npm

### Fichier : `/home/adul21/adul21-website/package.json`

```json
{
  "scripts": {
    // Développement
    "dev": "nuxt dev",                    // Serveur de dev (http://localhost:3000)
    "build": "nuxt build",                // Build production
    "preview": "nuxt preview",            // Preview du build
    "generate": "nuxt generate",          // SSG (static site generation)
    "postinstall": "nuxt prepare",        // Auto-générer les types Nuxt

    // Base de données (Drizzle)
    "db:generate": "drizzle-kit generate", // Générer migrations SQL
    "db:migrate": "drizzle-kit migrate",   // Appliquer migrations
    "db:push": "drizzle-kit push",         // Push schéma (dev)
    "db:studio": "drizzle-kit studio"      // Interface graphique BDD
  }
}
```

### 6.1 Scripts de développement

| Script | Commande | Description | Port |
|--------|----------|-------------|------|
| `dev` | `npm run dev` | Serveur de développement avec HMR | 3000 |
| `build` | `npm run build` | Build optimisé pour production | - |
| `preview` | `npm run preview` | Preview du build en local | 3000 |
| `generate` | `npm run generate` | Génération statique (SSG) | - |

**Exemple de workflow dev :**

```bash
# 1. Installation
npm install

# 2. Démarrage dev
npm run dev
# → http://localhost:3000

# 3. Build pour tester
npm run build
npm run preview
# → http://localhost:3000 (version buildée)
```

### 6.2 Scripts de base de données

| Script | Commande | Usage | Quand l'utiliser |
|--------|----------|-------|------------------|
| `db:generate` | `npm run db:generate` | Génère les fichiers SQL de migration | Après modification du schéma |
| `db:migrate` | `npm run db:migrate` | Applique les migrations | En production |
| `db:push` | `npm run db:push` | Push direct du schéma (sans migration) | En développement uniquement |
| `db:studio` | `npm run db:studio` | Interface web pour explorer la BDD | Debug / exploration |

**Workflow migration typique :**

```bash
# 1. Modifier le schéma
# Éditer server/database/schema.ts

# 2. Générer la migration
npm run db:generate
# → Crée server/database/migrations/0001_xxx.sql

# 3. Vérifier le SQL généré
cat server/database/migrations/0001_xxx.sql

# 4. Appliquer en dev
npm run db:push

# 5. En production
npm run db:migrate
```

---

## 7. Configuration TypeScript

### 7.1 tsconfig.json

Fichier : `/home/adul21/adul21-website/tsconfig.json`

```json
{
  "files": [],
  "references": [
    { "path": "./.nuxt/tsconfig.app.json" },
    { "path": "./.nuxt/tsconfig.server.json" },
    { "path": "./.nuxt/tsconfig.shared.json" },
    { "path": "./.nuxt/tsconfig.node.json" }
  ]
}
```

**Explication :**
- Nuxt génère automatiquement les configurations TypeScript dans `.nuxt/`
- Le `tsconfig.json` racine référence ces configs
- **Ne pas modifier ce fichier directement**

### 7.2 Configuration TypeScript dans nuxt.config.ts

```typescript
typescript: {
  strict: true,        // Mode strict TypeScript
  typeCheck: false     // Désactivé pour accélérer le build en dev
}
```

**Options disponibles :**

| Option | Valeur | Impact | Recommandation |
|--------|--------|--------|----------------|
| `strict` | `true` | Active tous les checks stricts TypeScript | Toujours activer |
| `typeCheck` | `false` | Désactive le check TS pendant le build | `false` en dev, `true` en CI/CD |
| `shim` | `true` | Génère `shims.d.ts` pour `.vue` files | Activé par défaut |

### 7.3 Types auto-générés

Après `npm run dev` ou `npm run build`, Nuxt génère :

```
.nuxt/
  ├── tsconfig.app.json       # Config pour composants/pages
  ├── tsconfig.server.json    # Config pour API routes
  ├── tsconfig.shared.json    # Config partagée
  ├── tsconfig.node.json      # Config pour scripts Node
  └── types/                  # Types auto-générés
      ├── middleware.d.ts
      ├── layouts.d.ts
      └── ...
```

**Types disponibles automatiquement :**

```typescript
// Auto-imports de composables
const { data } = await useFetch('/api/members')

// Routes typées
navigateTo('/about')  // Autocomplete + type-safe

// Runtime config typé
const config = useRuntimeConfig()
config.public.siteUrl  // ✅ Typé automatiquement
```

### 7.4 Types personnalisés

Fichier : `/home/adul21/adul21-website/types/index.ts`

```typescript
// Exporter des types réutilisables
export interface PreMember {
  id: string
  firstName: string
  lastName: string
  email: string
  // ...
}
```

**Usage :**

```typescript
import type { PreMember } from '~/types'

const member: PreMember = { /* ... */ }
```

---

## 8. Déploiement

### 8.1 Checklist pré-déploiement

**Configuration :**
- [ ] Fichier `.env` créé avec toutes les variables
- [ ] `JWT_SECRET` généré (32+ caractères)
- [ ] Mots de passe PostgreSQL sécurisés
- [ ] Configuration Gmail SMTP validée
- [ ] Variable `ASSOCIATION_CREATED` définie

**Build :**
- [ ] `npm run build` réussit en local
- [ ] Tests passent (si présents)
- [ ] Pas de warnings TypeScript critiques

**Base de données :**
- [ ] PostgreSQL accessible
- [ ] Schéma initialisé (`postgres-schema.sql`)
- [ ] Migrations appliquées (`npm run db:migrate`)

**Sécurité :**
- [ ] Pas de secrets dans le code source
- [ ] `.env` dans `.gitignore`
- [ ] HTTPS activé en production
- [ ] CORS configuré si nécessaire

### 8.2 Déploiement Docker local

```bash
# 1. Cloner le projet
git clone <repo-url> adul21-website
cd adul21-website

# 2. Créer .env
cp .env.example .env
nano .env  # Remplir les valeurs

# 3. Build et démarrage
docker-compose up -d

# 4. Vérifier les logs
docker-compose logs -f adul21-web

# 5. Initialiser la BDD (si nécessaire)
docker-compose exec adul21-web npm run db:push

# 6. Accès
# → http://localhost:3000
```

### 8.3 Déploiement Coolify

#### Étape 1 : Préparer le repository

```bash
# Vérifier que le projet est prêt
git status
git add .
git commit -m "Prêt pour déploiement"
git push origin main
```

#### Étape 2 : Configurer Coolify

1. Créer une nouvelle application
2. Sélectionner le repository Git
3. Type : `Dockerfile`
4. Fichier : `Dockerfile`

#### Étape 3 : Définir les variables d'environnement

Dans l'interface Coolify, ajouter :

```bash
# Production
NODE_ENV=production
SITE_URL=https://adul21.fr

# Base de données
DATABASE_URL=postgresql://user:pass@postgres-host:5432/adul21

# Auth
JWT_SECRET=<secret-généré>

# Email
GMAIL_USER=assoligne21@gmail.com
GMAIL_APP_PASSWORD=<app-password>
EMAIL_FROM=ADUL21 <assoligne21@gmail.com>

# Analytics
PLAUSIBLE_DOMAIN=adul21.fr

# Phase association
ASSOCIATION_CREATED=true
```

#### Étape 4 : Configurer la base de données

Option 1 : **PostgreSQL externe (recommandé)**

```bash
# Dans Coolify, créer un service PostgreSQL
# Copier l'URL de connexion dans DATABASE_URL
```

Option 2 : **PostgreSQL dans docker-compose**

```bash
# Utiliser le docker-compose.yml du projet
# Coolify détecte automatiquement les services
```

#### Étape 5 : Premier déploiement

```bash
# Dans Coolify UI
# 1. Cliquer "Deploy"
# 2. Suivre les logs en temps réel
# 3. Vérifier le healthcheck
```

#### Étape 6 : Initialiser la base de données

```bash
# Accéder au conteneur
coolify exec <app-name> sh

# Appliquer les migrations
npm run db:migrate

# Ou push direct
npm run db:push
```

#### Étape 7 : Vérification

```bash
# Healthcheck
curl https://adul21.fr/

# API test
curl https://adul21.fr/api/health

# Logs
coolify logs -f <app-name>
```

### 8.4 Déploiement manuel (VPS)

```bash
# 1. Connexion SSH
ssh user@vps-ip

# 2. Installation Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Installation PostgreSQL
sudo apt install postgresql postgresql-contrib

# 4. Cloner le projet
git clone <repo-url> adul21-website
cd adul21-website

# 5. Configuration
cp .env.example .env
nano .env

# 6. Installation
npm install

# 7. Build
npm run build

# 8. Initialiser la BDD
npm run db:push

# 9. Démarrer avec PM2
npm install -g pm2
pm2 start .output/server/index.mjs --name adul21
pm2 save
pm2 startup

# 10. Nginx reverse proxy
sudo nano /etc/nginx/sites-available/adul21
```

Configuration Nginx :

```nginx
server {
    listen 80;
    server_name adul21.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/adul21 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL avec Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d adul21.fr
```

### 8.5 Mise à jour en production

```bash
# Sur le serveur
cd adul21-website
git pull origin main
npm install
npm run build
npm run db:migrate  # Appliquer les nouvelles migrations

# Redémarrer (PM2)
pm2 restart adul21

# Ou (Docker)
docker-compose down
docker-compose up -d --build
```

### 8.6 Rollback en cas de problème

```bash
# Git
git log --oneline  # Trouver le commit précédent
git checkout <commit-hash>
npm run build
pm2 restart adul21

# Docker
docker-compose down
docker-compose up -d <previous-image>

# Coolify
# Interface UI : sélectionner le déploiement précédent → Rollback
```

---

## 9. Troubleshooting

### 9.1 Problèmes courants

#### Build échoue

```bash
# Vérifier les dépendances
rm -rf node_modules package-lock.json
npm install

# Vérifier TypeScript
npx tsc --noEmit

# Logs détaillés
npm run build -- --verbose
```

#### Connexion BDD échoue

```bash
# Vérifier DATABASE_URL
echo $DATABASE_URL

# Tester la connexion
psql $DATABASE_URL

# Docker : vérifier que postgres est prêt
docker-compose logs postgres
```

#### Gmail SMTP ne fonctionne pas

```bash
# Vérifier les variables
echo $GMAIL_USER
echo $GMAIL_APP_PASSWORD

# Tester avec nodemailer
node -e "
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});
transport.verify().then(console.log).catch(console.error);
"
```

#### Port 3000 déjà utilisé

```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou utiliser un autre port
PORT=3001 npm run dev
```

### 9.2 Logs utiles

```bash
# Application
pm2 logs adul21
docker-compose logs -f adul21-web
coolify logs -f <app-name>

# Base de données
docker-compose logs postgres
tail -f /var/log/postgresql/postgresql-16-main.log

# Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 10. Ressources

### Documentation officielle

- **Nuxt 3** : https://nuxt.com/docs
- **Nuxt UI** : https://ui.nuxt.com
- **Drizzle ORM** : https://orm.drizzle.team
- **PostgreSQL** : https://www.postgresql.org/docs
- **Docker** : https://docs.docker.com
- **Coolify** : https://coolify.io/docs

### Outils utiles

- **Drizzle Studio** : `npm run db:studio` → https://local.drizzle.studio
- **Plausible Analytics** : https://plausible.io/adul21.fr
- **Nuxt DevTools** : Intégré dans `npm run dev` (Shift + Option + D)

### Support

- **GitHub Issues** : <repo-url>/issues
- **Nuxt Discord** : https://discord.com/invite/nuxt
- **Drizzle Discord** : https://discord.gg/drizzle

---

**Dernière mise à jour** : 2024-10-17

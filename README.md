# Site Web ADUL21

Site officiel de l'**Association de Défense des Usagers de la Ligne 21** (Ledenon-Cabrières-Saint-Gervasy → Nîmes)

## 🚀 Stack Technique

- **Framework**: Nuxt 4.1.3 (Vue 3 + TypeScript)
- **UI**: Nuxt UI Pro + Tailwind CSS + Heroicons
- **Base de données**: Supabase (PostgreSQL)
- **Emails**: Gmail SMTP via Nodemailer
- **Hébergement**: OVH via Coolify (Docker)
- **Analytics**: Plausible (RGPD-friendly, sans cookies)
- **Paiements**: Stripe (à activer ultérieurement)

## 📦 Installation

### Prérequis

- **Node.js** : Version 22.20.0 ou supérieure (utiliser nvm recommandé)
- **npm** : Version 9.x ou supérieure
- **Compte Supabase** : Pour la base de données PostgreSQL
- **Compte Gmail** : Pour l'envoi d'emails via SMTP

### Installation

```bash
# Cloner le repository
git clone https://github.com/smiollis/adul21.git
cd adul21-website

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
# Puis remplir les variables dans .env (voir section Configuration)
```

### Configuration

1. **Base de données Supabase**
   - Créer un projet sur https://supabase.com
   - Exécuter le script `supabase-schema.sql` dans l'éditeur SQL
   - Copier l'URL et les clés API dans `.env`

2. **Gmail SMTP**
   - Suivre le guide complet : `GMAIL_SMTP_GUIDE.md`
   - Activer la 2FA sur votre compte Gmail
   - Générer un mot de passe d'application
   - Ajouter les credentials dans `.env`

3. **Autres variables**
   - Générer un `JWT_SECRET` aléatoire (min. 32 caractères)
   - Configurer `SITE_URL` selon votre environnement

### Lancer le projet

```bash
# Serveur de développement (http://localhost:3000)
npm run dev

# Build production
npm run build

# Preview production
npm run preview
```

## 🛠️ Développement

```bash
# Serveur dev (http://localhost:3000)
npm run dev

# Build production
npm run build

# Preview production
npm run preview

# Generate static site
npm run generate
```

## 📁 Structure du Projet

```
adul21-website/
├── assets/                  # Assets (CSS, fonts)
│   └── css/                # Global styles
├── components/             # Vue components
│   ├── layout/            # AppHeader, AppFooter
│   └── home/              # HeroBanner, KeyFacts, DidYouKnow
├── composables/            # Vue composables
│   ├── useSupabase.ts     # Supabase client
│   ├── useTestimonies.ts  # Testimonies CRUD
│   └── useAuth.ts         # Authentication
├── layouts/                # Layouts
│   ├── default.vue        # Standard layout
│   └── admin.vue          # Admin dashboard layout
├── pages/                  # Pages (auto-routing)
│   ├── index.vue          # Homepage
│   ├── contact.vue        # Contact form
│   ├── revendications.vue # Demands
│   ├── arguments-juridiques.vue  # Legal arguments
│   ├── mentions-legales.vue      # Legal notice
│   ├── politique-confidentialite.vue  # Privacy policy
│   ├── temoignages/
│   │   ├── index.vue      # Testimonies list
│   │   ├── nouveau.vue    # Submit testimony
│   │   └── [id].vue       # Testimony detail
│   └── rejoindre/
│       └── adherer.vue    # Membership form
├── server/                 # Server API
│   ├── api/               # API endpoints
│   │   ├── contact.post.ts       # Contact form
│   │   ├── membership.post.ts    # Membership
│   │   └── testimonies/
│   │       └── index.post.ts     # Submit testimony
│   └── utils/
│       └── mailer.ts      # Email sending (Gmail SMTP)
├── types/                  # TypeScript types
│   └── database.types.ts  # Supabase types
├── public/                 # Static files
├── supabase-schema.sql     # Database schema
├── docker-compose.yml      # Docker configuration
├── Dockerfile             # Docker build
├── .coolify               # Coolify config
├── DEPLOYMENT.md          # Deployment guide
├── GITHUB_ACCESS_GUIDE.md # GitHub access guide
└── GMAIL_SMTP_GUIDE.md    # Gmail SMTP guide
```

## 🔑 Variables d'Environnement

Voir `.env.example` pour la liste complète.

### Principales variables

**Base de données (Supabase)**
- `SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_KEY` : Clé publique (anon key)
- `SUPABASE_SERVICE_KEY` : Clé de service (admin)

**Email (Gmail SMTP)**
- `GMAIL_USER` : Adresse Gmail complète (ex: assoligne21@gmail.com)
- `GMAIL_APP_PASSWORD` : Mot de passe d'application (16 caractères)
- `EMAIL_FROM` : Expéditeur affiché (ex: "ADUL21 <assoligne21@gmail.com>")

**Authentification**
- `JWT_SECRET` : Secret pour les tokens JWT (min. 32 caractères aléatoires)

**Général**
- `NODE_ENV` : `development` ou `production`
- `SITE_URL` : URL complète du site (ex: https://adul21.fr)
- `PLAUSIBLE_DOMAIN` : Domaine pour analytics (ex: adul21.fr)

## 🚢 Déploiement

Le projet est configuré pour un déploiement via Coolify sur serveur OVH.

### Configuration Coolify

1. **Accès GitHub** : Suivre le guide `GITHUB_ACCESS_GUIDE.md`
   - Option 1 : Repository public
   - Option 2 : Deploy Key (SSH)
   - Option 3 : Personal Access Token

2. **Variables d'environnement** : Ajouter toutes les variables de `.env.example` dans Coolify

3. **Build** : Le fichier `.coolify` configure automatiquement le build

4. **Déploiement** :
   - Push sur `main` déclenche le build
   - Docker build automatique
   - Déploiement sur port 3000

### Documentation complète

- **Déploiement** : `DEPLOYMENT.md` (guide complet Coolify)
- **Gmail SMTP** : `GMAIL_SMTP_GUIDE.md` (configuration email)
- **GitHub** : `GITHUB_ACCESS_GUIDE.md` (accès repository)

## 📧 Contact

**Email**: assoligne21@gmail.com
**Site**: https://adul21.fr

## ✨ Fonctionnalités

### Implémentées ✅

**Pages publiques**
- Page d'accueil avec statistiques et infographies
- Nos revendications (5 demandes)
- Arguments juridiques (6 arguments légaux)
- Contact (formulaire avec email)
- Mentions légales et politique de confidentialité

**Système de témoignages** ⭐⭐⭐ (HIGH PRIORITY)
- Formulaire de soumission en 4 étapes
- Liste des témoignages publiés avec filtres
- Page détail d'un témoignage
- Modération (statut: pending/approved/rejected)
- Emails de confirmation automatiques

**Système d'adhésion** ⭐⭐⭐ (HIGH PRIORITY)
- Formulaire d'adhésion en 4 étapes
- Choix du montant de cotisation (5€/10€/20€/libre)
- Instructions de paiement par email
- Statut: pending jusqu'à confirmation admin

**Base de données**
- 6 tables : members, testimonies, donations, downloads, news, incidents
- Row Level Security (RLS)
- Triggers et vues pour statistiques

**Emails transactionnels**
- Gmail SMTP via Nodemailer
- Templates HTML + texte
- Confirmations : témoignages, adhésions, contact

### À implémenter 🚧

**Paiements en ligne**
- Intégration Stripe (désactivée pour l'instant)
- Activation prévue après création officielle de l'association

**Dashboard admin**
- Modération des témoignages
- Gestion des adhérents
- Statistiques et analytics
- Gestion des actualités

**Fonctionnalités supplémentaires**
- Système de dons (avec/sans Stripe)
- Page actualités (liste + détail)
- Téléchargements (modèles de courriers)
- Signalement d'incidents

## 🔒 Sécurité & RGPD

- ✅ Politique de confidentialité complète
- ✅ Consentements RGPD pour chaque formulaire
- ✅ Row Level Security sur Supabase
- ✅ Variables d'environnement sécurisées
- ✅ Pas de cookies (Plausible Analytics)
- ✅ Authentification JWT pour admin
- ✅ Validation des données (Zod)

## 📧 Contact

**Email** : assoligne21@gmail.com
**Site** : https://adul21.fr
**GitHub** : https://github.com/smiollis/adul21

## 📄 Licence

© 2025 ADUL21 - Tous droits réservés

---

**Dernière mise à jour** : 12 octobre 2025
**Version** : 1.0.0
**Status** : 🟢 Production Ready (avec paiements manuels)

# Site Web ADUL21

Site officiel de l'**Association de Défense des Usagers de la Ligne 21** (Ledenon-Cabrières-Saint-Gervasy → Nîmes)

## 🚀 Stack Technique

- **Framework**: Nuxt 4 (Vue 3 + TypeScript)
- **UI**: Nuxt UI Pro + Tailwind CSS
- **Base de données**: Supabase (PostgreSQL)
- **Paiements**: Stripe
- **Emails**: Resend
- **Hébergement**: OVH via Coolify
- **Analytics**: Plausible (RGPD-friendly)

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
# Puis remplir les variables dans .env

# Lancer le serveur de développement
npm run dev
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
├── app/                    # App entry point
├── assets/                 # Assets (CSS, images)
├── components/            # Vue components
│   ├── layout/           # Header, Footer, Navigation
│   ├── home/             # Homepage components
│   ├── forms/            # Forms (adhesion, don, témoignage)
│   ├── testimonies/      # Testimonies display
│   ├── admin/            # Admin dashboard components
│   └── ui/               # UI components
├── composables/           # Vue composables
├── layouts/               # Layouts (default, admin)
├── middleware/            # Route middleware
├── pages/                 # Pages (auto-routing)
├── server/                # Server API
│   ├── api/              # API endpoints
│   ├── middleware/       # Server middleware
│   └── utils/            # Server utilities
├── types/                 # TypeScript types
└── public/                # Static files
```

## 🔑 Variables d'Environnement

Voir `.env.example` pour la liste complète.

Principales variables :
- `SUPABASE_URL` et `SUPABASE_KEY` : Connexion base de données
- `STRIPE_PUBLISHABLE_KEY` et `STRIPE_SECRET_KEY` : Paiements
- `RESEND_API_KEY` : Envoi d'emails
- `JWT_SECRET` : Authentification admin

## 🚢 Déploiement

Le projet est configuré pour un déploiement automatique via Coolify depuis GitHub.

1. Push sur la branche `main`
2. Coolify détecte le changement
3. Build automatique avec `npm run build`
4. Déploiement sur le serveur OVH

## 📧 Contact

**Email**: assoligne21@gmail.com
**Site**: https://adul21.fr

## 📄 Licence

© 2025 ADUL21 - Tous droits réservés

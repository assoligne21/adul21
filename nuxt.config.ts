// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-12',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon'
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private keys (server-only)
    databaseUrl: process.env.DATABASE_URL || '',
    jwtSecret: process.env.JWT_SECRET || '',

    // Gmail SMTP configuration
    gmailUser: process.env.GMAIL_USER || '',
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD || '',
    emailFrom: process.env.EMAIL_FROM || 'ADUL21 <assoligne21@gmail.com>',

    // Public keys (exposed to client)
    public: {
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      plausibleDomain: process.env.PLAUSIBLE_DOMAIN || 'adul21.fr',
      // Association status: false = Phase 1 (pre-adhesion), true = Phase 2 (full membership)
      associationCreated: process.env.ASSOCIATION_CREATED === 'true'
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'ADUL21 - Association de Défense des Usagers de la Ligne 21',
      htmlAttrs: {
        lang: 'fr'
      },
      meta: [
        { name: 'description', content: 'Association de défense des usagers de la ligne 21 Ledenon-Nîmes. Mobilisation pour rétablir la liaison directe entre Ledenon, Cabrières, Saint-Gervasy et la gare SNCF de Nîmes.' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:site_name', content: 'ADUL21' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap' }
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
  },

  nitro: {
    preset: 'node-server'
  },

  typescript: {
    strict: true,
    typeCheck: false // Désactiver pour accélérer le build en dev
  }
})

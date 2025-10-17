# Documentation SEO - ADUL21

## Vue d'ensemble

Cette documentation analyse le référencement naturel (SEO) du site ADUL21 et propose des recommandations d'optimisation pour améliorer la visibilité sur les moteurs de recherche.

**Objectifs SEO** :
- Visibilité locale (Ledenon, Cabrières, Saint-Gervasy, Nîmes)
- Positionnement sur des requêtes liées au transport public
- Attractivité pour les médias et journalistes
- Faciliter l'adhésion et la mobilisation

---

## 1. Meta Tags

### 1.1 Configuration globale (nuxt.config.ts)

```typescript
app: {
  head: {
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1',
    title: 'ADUL21 - Association de Défense des Usagers de la Ligne 21',
    htmlAttrs: {
      lang: 'fr'
    },
    meta: [
      {
        name: 'description',
        content: 'Association de défense des usagers de la ligne 21 Ledenon-Nîmes...'
      },
      { name: 'format-detection', content: 'telephone=no' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'fr_FR' },
      { property: 'og:site_name', content: 'ADUL21' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  }
}
```

### 1.2 Template de titre dynamique (app.vue)

```typescript
titleTemplate: (title) =>
  title ? `${title} - ADUL21` : 'ADUL21 - Association de Défense des Usagers de la Ligne 21'
```

**Points forts** :
- ✅ Structure cohérente des titres
- ✅ Séparateur clair (-)
- ✅ Nom de marque systématique

### 1.3 Meta tags par page

#### Page d'accueil (index.vue)
```typescript
useHead({
  title: 'Accueil',
  meta: [
    {
      name: 'description',
      content: 'ADUL21 - Association de défense des usagers de la ligne 21 Ledenon-Nîmes...'
    },
    { property: 'og:title', content: 'ADUL21 - Rétablissons la ligne 21 directe vers Nîmes' },
    { property: 'og:description', content: 'Mobilisation pour défendre le droit à la mobilité...' },
    { property: 'og:type', content: 'website' }
  ]
})
```

#### Page Témoignages (temoignages/index.vue)
```typescript
useHead({
  title: 'Témoignages',
  meta: [
    {
      name: 'description',
      content: 'Découvrez les témoignages des habitants de Ledenon, Cabrières...'
    }
  ]
})
```

#### Page Arguments juridiques
```typescript
useHead({
  title: 'Arguments juridiques',
  meta: [
    {
      name: 'description',
      content: 'Fondements juridiques des revendications de l\'ADUL21...'
    },
    {
      name: 'keywords',
      content: 'arguments juridiques, droit au transport, service public...'
    },
    { property: 'og:title', content: 'Arguments juridiques - ADUL21' },
    { property: 'og:description', content: 'Fondements juridiques de notre action...' },
    { property: 'og:type', content: 'article' }
  ]
})
```

### Checklist Meta Tags

| Élément | Status | Notes |
|---------|--------|-------|
| Title unique par page | ✅ | Bon |
| Longueur title (50-60 car) | ⚠️ | Certains titres courts |
| Meta description | ✅ | Présente partout |
| Longueur description (150-160 car) | ⚠️ | À vérifier |
| Open Graph tags | ✅ | Présents |
| og:image | ❌ | Manquant |
| Twitter Cards | ✅ | summary_large_image |
| Canonical URL | ❌ | À ajouter |
| Lang attribute | ✅ | 'fr' défini |
| Keywords meta | ⚠️ | Présent uniquement sur arguments-juridiques |

---

## 2. Structure sémantique HTML

### 2.1 Hiérarchie des headings

#### Page d'accueil
```html
<!-- Hero Banner -->
<h1>NOTRE LIGNE DIRECTE A ÉTÉ SUPPRIMÉE</h1>

<!-- Section témoignages -->
<h2>Ils témoignent</h2>
```

#### Page Revendications
```html
<h1>Nos revendications</h1>
<h2>Rétablissement immédiat de la ligne directe 21</h2>
<h2>Consultation obligatoire des usagers</h2>
<!-- etc. -->
```

#### Page Arguments juridiques
```html
<h1>Arguments juridiques</h1>
<article>
  <h2>Droit au transport et liberté d'aller et venir</h2>
  <h3>Fondement juridique</h3>
  <h3>Application au cas présent</h3>
  <h3>Références légales</h3>
</article>
```

**Points forts** :
- ✅ Un seul H1 par page
- ✅ Hiérarchie logique H1 > H2 > H3
- ✅ Utilisation de balises `<article>` pour les arguments juridiques

### 2.2 Sémantique HTML5

```html
<header>           <!-- AppHeader.vue -->
<nav>              <!-- Navigation principale -->
<main>             <!-- app.vue -->
  <NuxtPage />     <!-- Contenu des pages -->
</main>
<footer>           <!-- AppFooter.vue -->
```

**Points forts** :
- ✅ Structure HTML5 sémantique
- ✅ Balises `<article>` pour contenu autonome
- ✅ `<section>` pour regroupement thématique

### 2.3 Landmarks ARIA

**Actuellement** :
- ❌ Pas d'attributs ARIA role explicites
- ⚠️ Structure sémantique HTML5 suffit partiellement

**Recommandations** :
```html
<header role="banner">
<nav role="navigation" aria-label="Navigation principale">
<main role="main">
<footer role="contentinfo">
```

### 2.4 Schema.org / Structured Data

**Status** : ❌ **Non implémenté**

**Recommandations prioritaires** :

#### Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ADUL21",
  "description": "Association de Défense des Usagers de la Ligne 21",
  "url": "https://adul21.fr",
  "logo": "https://adul21.fr/logo-adul21.svg",
  "email": "assoligne21@gmail.com",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ledenon",
    "addressRegion": "Occitanie",
    "postalCode": "30210",
    "addressCountry": "FR"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Ledenon"
    },
    {
      "@type": "City",
      "name": "Cabrières"
    },
    {
      "@type": "City",
      "name": "Saint-Gervasy"
    }
  ]
}
```

#### BreadcrumbList Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://adul21.fr"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Témoignages",
      "item": "https://adul21.fr/temoignages"
    }
  ]
}
```

#### Article Schema (pour actualités)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Titre de l'actualité",
  "description": "Description courte",
  "datePublished": "2025-10-17",
  "author": {
    "@type": "Organization",
    "name": "ADUL21"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ADUL21",
    "logo": {
      "@type": "ImageObject",
      "url": "https://adul21.fr/logo-adul21.svg"
    }
  }
}
```

---

## 3. URLs et routing

### 3.1 Structure des URLs

```
https://adul21.fr/
https://adul21.fr/revendications
https://adul21.fr/arguments-juridiques
https://adul21.fr/temoignages
https://adul21.fr/temoignages/nouveau
https://adul21.fr/temoignages/[id]
https://adul21.fr/actualites
https://adul21.fr/actualites/[slug]
https://adul21.fr/impacts
https://adul21.fr/contact
https://adul21.fr/rejoindre/adherer
https://adul21.fr/rejoindre/soutien
https://adul21.fr/telechargements
https://adul21.fr/mentions-legales
https://adul21.fr/politique-confidentialite
```

**Points forts** :
- ✅ URLs en français
- ✅ URLs parlantes (lisibles par humains)
- ✅ Tirets pour séparation des mots
- ✅ Pas de paramètres inutiles
- ✅ Structure hiérarchique logique

**Points d'amélioration** :
- ⚠️ Utilisation de slugs pour les actualités (bon)
- ⚠️ Utilisation d'IDs numériques pour témoignages (moyen)

**Recommandation** :
```
Avant : /temoignages/42
Après : /temoignages/parent-ledenon-lycee-42
```

### 3.2 Gestion des redirections

**Status** : ⚠️ Non documenté

**Recommandations** :
- Implémenter redirections 301 si changement d'URLs
- Rediriger www vers non-www (ou inverse)
- Rediriger HTTP vers HTTPS

### 3.3 Page 404

**Status** : ✅ Gérée par Nuxt (error-404.vue)

**Recommandation** :
Personnaliser la page 404 avec :
- Message clair
- Liens vers pages principales
- Formulaire de recherche
- Tracking analytics des 404

---

## 4. Sitemap et robots.txt

### 4.1 Sitemap XML

**Status** : ❌ **Non présent**

**Impact** : Les moteurs de recherche ont plus de difficulté à découvrir toutes les pages.

**Recommandation** : Installer `@nuxtjs/sitemap`

```bash
npm install @nuxtjs/sitemap
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/sitemap'
  ],

  sitemap: {
    hostname: 'https://adul21.fr',
    gzip: true,
    routes: async () => {
      // Inclure routes dynamiques (témoignages, actualités)
      const testimonies = await fetchTestimonies()
      const news = await fetchNews()

      return [
        ...testimonies.map(t => `/temoignages/${t.id}`),
        ...news.map(n => `/actualites/${n.slug}`)
      ]
    },
    exclude: [
      '/admin/**',
      '/api/**'
    ]
  }
})
```

**Exemple de sitemap.xml** :
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://adul21.fr/</loc>
    <lastmod>2025-10-17</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://adul21.fr/revendications</loc>
    <lastmod>2025-10-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://adul21.fr/temoignages</loc>
    <lastmod>2025-10-17</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- etc. -->
</urlset>
```

### 4.2 Robots.txt

**Fichier actuel** (`/public/robots.txt`) :
```
User-Agent: *
Disallow:
```

**Points forts** :
- ✅ Permet l'indexation de tout le site
- ✅ Ouvert à tous les robots

**Recommandation améliorée** :
```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: https://adul21.fr/sitemap.xml

# Crawl rate (optionnel)
Crawl-delay: 1
```

### 4.3 Pages à indexer / ne pas indexer

**À indexer** :
- ✅ Page d'accueil
- ✅ Revendications
- ✅ Arguments juridiques
- ✅ Témoignages (liste + détails)
- ✅ Actualités (liste + articles)
- ✅ Impacts
- ✅ Contact
- ✅ Adhésion/Soutien
- ✅ Téléchargements
- ✅ Mentions légales
- ✅ Politique de confidentialité

**À NE PAS indexer** :
- ❌ Zone admin (/admin/**)
- ❌ API endpoints (/api/**)
- ❌ Formulaire nouveau témoignage (mais indexer la page résultat)

**Implémentation** :
```typescript
// Pour pages admin
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
```

---

## 5. Performance SEO

### 5.1 Core Web Vitals

**Critères Google** :
- LCP (Largest Contentful Paint) : < 2.5s
- FID (First Input Delay) : < 100ms
- CLS (Cumulative Layout Shift) : < 0.1

**Configuration actuelle** :
```typescript
// Nuxt 4 avec SSR
nitro: {
  preset: 'node-server'
}
```

**Points forts** :
- ✅ SSR activé (bon pour SEO)
- ✅ Nuxt UI optimisé
- ✅ Preconnect Google Fonts

**Optimisations supplémentaires** :

#### Images
```html
<!-- Utiliser NuxtImg avec lazy loading -->
<NuxtImg
  src="/logo-adul21.svg"
  alt="ADUL21"
  loading="lazy"
  width="200"
  height="200"
/>
```

#### Fonts
```typescript
// Déjà optimisé
link: [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
  }
]
```

**Recommandation** : Passer à `display=swap` (déjà fait ✅)

### 5.2 Mobile-First

**Configuration viewport** :
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

**Points forts** :
- ✅ Design responsive (Tailwind CSS)
- ✅ Breakpoints md:, lg:
- ✅ Menus mobile adaptatifs

**Test** : Utiliser Google Mobile-Friendly Test

### 5.3 HTTPS

**Configuration** : À configurer en production

**Recommandations** :
- Certificat SSL Let's Encrypt (gratuit)
- Redirection HTTP → HTTPS
- HSTS header

### 5.4 SSR pour crawlers

**Configuration actuelle** :
```typescript
nitro: {
  preset: 'node-server'  // ✅ SSR activé
}
```

**Avantages** :
- ✅ HTML complet dès le chargement
- ✅ Contenu visible pour bots Google
- ✅ Meilleur indexation

---

## 6. Contenu

### 6.1 Qualité et pertinence

**Points forts** :
- ✅ Contenu original et unique
- ✅ Thématique claire et cohérente
- ✅ Valeur ajoutée (arguments juridiques, impacts chiffrés)
- ✅ Langue française de qualité
- ✅ Contenu long (>300 mots par page principale)

**Page Arguments juridiques** : ~2500 mots (excellent pour SEO)
**Page Revendications** : ~800 mots (bon)
**Page Impacts** : ~1200 mots (très bon)

### 6.2 Mots-clés ciblés

#### Mots-clés primaires
- ADUL21
- Ligne 21 Nîmes
- Transport Ledenon Nîmes
- Bus Ledenon Cabrières Saint-Gervasy
- Association usagers ligne 21

#### Mots-clés secondaires
- Suppression ligne bus Nîmes
- Mobilité Ledenon
- Transport public Cabrières
- Arguments juridiques transport public
- Droit au transport Nîmes Métropole
- Témoignages usagers bus

#### Mots-clés locaux (SEO local)
- Ledenon transport
- Cabrières bus
- Saint-Gervasy mobilité
- Nîmes Métropole transport
- Gare Nîmes Ledenon

**Densité actuelle** : Bonne intégration naturelle des mots-clés

**Recommandation** : Créer une page FAQ pour cibler requêtes longue traîne

### 6.3 Structure du contenu

**Points forts** :
- ✅ Introduction claire sur chaque page
- ✅ Listes à puces (lisibilité)
- ✅ Citations et extraits en evidence
- ✅ Calls-to-action clairs

**Exemple (Revendications)** :
```html
<div class="card p-8">
  <h2>Rétablissement immédiat de la ligne directe 21</h2>
  <p>Description...</p>
  <div class="bg-primary-50 border-l-4 border-primary-600 p-4">
    <strong>Pourquoi ?</strong> Explication...
  </div>
</div>
```

### 6.4 Images et attributs alt

**Analyse des images** :

#### Header
```html
<img src="/logo-adul21.svg" alt="ADUL21" class="h-12 w-auto" />
```
✅ Alt présent et descriptif

#### Hero Banner
```html
<img src="/logo-adul21-hero.svg" alt="ADUL21" class="h-32 md:h-40 w-auto" />
```
✅ Alt présent

#### Footer
```html
<img src="/logo-adul21.svg" alt="ADUL21" class="h-40 w-auto" />
```
✅ Alt présent

**Checklist Images SEO** :

| Critère | Status | Recommandation |
|---------|--------|----------------|
| Attribut alt sur toutes images | ✅ | Bon |
| Alt descriptifs | ⚠️ | Améliorer (plus de contexte) |
| Noms de fichiers descriptifs | ✅ | Bon (logo-adul21.svg) |
| Images optimisées (poids) | ✅ | SVG légers |
| Dimensions définies | ⚠️ | Ajouter width/height |
| Lazy loading | ❌ | À implémenter |

**Recommandation alt améliorés** :
```html
<!-- Avant -->
<img src="/logo-adul21.svg" alt="ADUL21" />

<!-- Après -->
<img
  src="/logo-adul21.svg"
  alt="Logo ADUL21 - Association de Défense des Usagers de la Ligne 21"
  width="200"
  height="200"
  loading="lazy"
/>
```

### 6.5 Liens internes

**Structure de maillage** :

```
Accueil
  ├─> Revendications
  ├─> Arguments juridiques
  ├─> Témoignages
  ├─> Actualités
  ├─> Impacts
  ├─> Contact
  └─> Adhérer

Footer (présent sur toutes pages)
  ├─> Mentions légales
  ├─> Politique de confidentialité
  └─> Contact email
```

**Points forts** :
- ✅ Menu navigation dans header
- ✅ Footer avec liens vers toutes sections
- ✅ CTAs contextuels (Témoigner, Adhérer)
- ✅ Liens retour dans articles

**Recommandations** :
- Ajouter liens contextuels dans contenu (ex: lien vers "Arguments juridiques" depuis "Revendications")
- Fil d'Ariane (breadcrumbs) sur pages profondes

### 6.6 Liens externes

**Liens sortants identifiés** :

#### Plausible Analytics
```javascript
script: [
  {
    defer: true,
    'data-domain': 'adul21.fr',
    src: 'https://plausible.io/js/script.js'
  }
]
```

#### Google Fonts
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter..." />
```

**Points forts** :
- ✅ Peu de liens externes (bon pour PageRank interne)
- ✅ Liens vers services légitimes

**Recommandations** :
- Ajouter rel="nofollow" sur liens footer (politique confidentialité externe si existante)
- Liens vers sources juridiques (Légifrance) avec rel="nofollow noopener"

---

## 7. Analytics

### 7.1 Plausible Analytics

**Configuration actuelle** :
```javascript
script: [
  {
    defer: true,
    'data-domain': 'adul21.fr',
    src: 'https://plausible.io/js/script.js'
  }
]
```

**Points forts** :
- ✅ Analytics respectueux RGPD
- ✅ Pas de cookies
- ✅ Léger et rapide
- ✅ Script en defer (performance)

**Configuration publique** :
```typescript
public: {
  plausibleDomain: process.env.PLAUSIBLE_DOMAIN || 'adul21.fr'
}
```

### 7.2 Tracking sans cookies

**Avantages SEO** :
- ✅ Pas de bannière cookies (meilleure UX)
- ✅ Pas de ralentissement (pas de consent manager)
- ✅ Conforme RGPD sans configuration

### 7.3 Métriques suivies

**Métriques Plausible par défaut** :
- Pages vues
- Visiteurs uniques
- Taux de rebond
- Durée de session
- Sources de trafic
- Pages d'entrée/sortie
- Appareils (desktop/mobile/tablet)
- Navigateurs
- Pays

### 7.4 Events personnalisés

**Recommandations d'events à tracker** :

```javascript
// Témoignage soumis
plausible('Temoignage Soumis')

// Adhésion initiée
plausible('Adhesion Demarree')

// Contact envoyé
plausible('Contact Envoye', {
  props: { sujet: form.subject }
})

// Newsletter inscription
plausible('Newsletter Inscription', {
  props: { source: 'footer' }
})

// Téléchargement document
plausible('Document Telecharge', {
  props: { document: 'CourrierMairie.docx' }
})

// Partage social
plausible('Partage Social', {
  props: { reseau: 'facebook' }
})
```

**Implémentation** :
```typescript
// composables/usePlausible.ts
export const usePlausible = () => {
  const trackEvent = (eventName: string, props?: Record<string, any>) => {
    if (window.plausible) {
      window.plausible(eventName, { props })
    }
  }

  return { trackEvent }
}

// Utilisation
const { trackEvent } = usePlausible()
trackEvent('Temoignage Soumis')
```

---

## 8. Structured Data (Schema.org)

### 8.1 Organization Schema

**Implémentation recommandée** :

```typescript
// app.vue ou layout
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "ADUL21",
        "alternateName": "Association de Défense des Usagers de la Ligne 21",
        "description": "Association de défense des usagers de la ligne 21 Ledenon-Nîmes",
        "url": "https://adul21.fr",
        "logo": "https://adul21.fr/logo-adul21.svg",
        "email": "assoligne21@gmail.com",
        "foundingDate": "2024",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ledenon",
          "addressRegion": "Occitanie",
          "postalCode": "30210",
          "addressCountry": "FR"
        },
        "areaServed": [
          { "@type": "City", "name": "Ledenon" },
          { "@type": "City", "name": "Cabrières" },
          { "@type": "City", "name": "Saint-Gervasy" }
        ],
        "sameAs": [
          // Ajouter liens réseaux sociaux si existants
        ]
      })
    }
  ]
})
```

### 8.2 WebSite Schema avec SearchAction

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ADUL21",
  "url": "https://adul21.fr",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://adul21.fr/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 8.3 Article Schema (pour actualités)

```typescript
// pages/actualites/[slug].vue
const article = ref({ ... })

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.value.title,
        "description": article.value.excerpt,
        "image": article.value.coverImage || "https://adul21.fr/logo-adul21.svg",
        "datePublished": article.value.publishedAt,
        "author": {
          "@type": "Organization",
          "name": "ADUL21"
        },
        "publisher": {
          "@type": "Organization",
          "name": "ADUL21",
          "logo": {
            "@type": "ImageObject",
            "url": "https://adul21.fr/logo-adul21.svg"
          }
        }
      })
    }
  ]
})
```

### 8.4 Breadcrumb Schema

```typescript
// composables/useBreadcrumb.ts
export const useBreadcrumb = (items: { name: string; url: string }[]) => {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        })
      }
    ]
  })
}

// Utilisation
useBreadcrumb([
  { name: 'Accueil', url: 'https://adul21.fr' },
  { name: 'Témoignages', url: 'https://adul21.fr/temoignages' }
])
```

### 8.5 FAQ Schema (pour page FAQ à créer)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Pourquoi la ligne 21 directe a-t-elle été supprimée ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La ligne directe 21 a été supprimée..."
      }
    },
    {
      "@type": "Question",
      "name": "Comment adhérer à l'ADUL21 ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pour adhérer, rendez-vous sur..."
      }
    }
  ]
}
```

---

## 9. Local SEO

### 9.1 Ciblage géographique

**Zones géographiques prioritaires** :
1. Ledenon (30210)
2. Cabrières (30210)
3. Saint-Gervasy (30320)
4. Nîmes (30000)
5. Marguerittes (30320)

**Optimisations** :
- ✅ Villes mentionnées dans meta descriptions
- ✅ Contenu géolocalisé (impacts par commune)
- ✅ URLs contenant ville (non applicable ici)

### 9.2 NAP (Name, Address, Phone)

**Configuration actuelle** :

```
Nom : ADUL21
Adresse : Non publique (association en création)
Téléphone : Non public
Email : assoligne21@gmail.com
```

**Recommandations** :
- Ajouter adresse postale une fois association créée
- Cohérence NAP sur tous supports (site, annuaires, réseaux sociaux)

**Schema.org LocalBusiness** (une fois adresse disponible) :
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "ADUL21",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Adresse à définir]",
    "addressLocality": "Ledenon",
    "postalCode": "30210",
    "addressCountry": "FR"
  },
  "telephone": "[À définir]",
  "email": "assoligne21@gmail.com"
}
```

### 9.3 Google Business Profile

**Status** : ❌ Non créé

**Recommandation** : Créer fiche Google Business Profile

**Étapes** :
1. Créer compte Google Business
2. Ajouter informations (nom, adresse, email, site web)
3. Catégorie : "Association ou organisation"
4. Ajouter photos (logo, actions, réunions)
5. Publier posts réguliers (actualités)
6. Répondre aux avis

**Avantages** :
- Visibilité dans Google Maps
- Apparition dans recherches locales
- Rich snippets Google

### 9.4 Annuaires locaux

**Recommandations d'inscription** :

#### Annuaires associatifs
- [ ] associations.gouv.fr (RNA)
- [ ] loi1901.com
- [ ] HelloAsso (plateforme don)

#### Annuaires locaux Nîmes
- [ ] Mairies de Ledenon, Cabrières, Saint-Gervasy
- [ ] Nîmes Métropole (annuaire associations)
- [ ] Pages Jaunes
- [ ] Yelp France

#### Annuaires transport/mobilité
- [ ] Forums transport public
- [ ] Associations usagers transport

**Bonnes pratiques** :
- NAP cohérent partout
- Lien vers site web
- Description identique
- Logo identique

---

## 10. Recommandations SEO

### 10.1 Quick Wins (Impact rapide)

#### 1. Ajouter og:image sur toutes pages (PRIORITÉ 1)

**Impact** : ⭐⭐⭐⭐⭐ (Partages sociaux)
**Effort** : ⭐

```typescript
// app.vue
useSeoMeta({
  ogImage: 'https://adul21.fr/og-image.jpg',
  twitterImage: 'https://adul21.fr/og-image.jpg'
})

// Par page
useHead({
  meta: [
    { property: 'og:image', content: 'https://adul21.fr/og-image-temoignages.jpg' }
  ]
})
```

**Créer images Open Graph** :
- Dimensions : 1200x630px
- Format : JPG ou PNG
- Poids : < 1MB
- Contenu : Logo + texte accrocheur

#### 2. Installer module sitemap (PRIORITÉ 1)

**Impact** : ⭐⭐⭐⭐
**Effort** : ⭐⭐

```bash
npm install @nuxtjs/sitemap
```

#### 3. Ajouter canonical URLs (PRIORITÉ 2)

**Impact** : ⭐⭐⭐⭐
**Effort** : ⭐

```typescript
// app.vue
const route = useRoute()
const config = useRuntimeConfig()

useHead({
  link: [
    {
      rel: 'canonical',
      href: `${config.public.siteUrl}${route.path}`
    }
  ]
})
```

#### 4. Optimiser meta descriptions longueur (PRIORITÉ 2)

**Impact** : ⭐⭐⭐
**Effort** : ⭐⭐

**Longueur idéale** : 150-160 caractères

```typescript
// Vérifier chaque meta description
const description = "Description optimale entre 150 et 160 caractères pour un affichage complet dans Google avec appel à l'action clair et mots-clés."
```

#### 5. Ajouter structured data Organization (PRIORITÉ 1)

**Impact** : ⭐⭐⭐⭐
**Effort** : ⭐

Voir section 8.1 ci-dessus.

#### 6. Améliorer attributs alt images (PRIORITÉ 3)

**Impact** : ⭐⭐⭐
**Effort** : ⭐

```html
<!-- Avant -->
<img src="/logo-adul21.svg" alt="ADUL21" />

<!-- Après -->
<img src="/logo-adul21.svg" alt="Logo ADUL21 - Association de Défense des Usagers de la Ligne 21 Ledenon Nîmes" />
```

### 10.2 Optimisations techniques

#### 1. Implémenter lazy loading images (PRIORITÉ 2)

**Impact** : ⭐⭐⭐⭐ (Performance)
**Effort** : ⭐⭐

```html
<img loading="lazy" src="..." alt="..." />
```

#### 2. Ajouter robots meta sur pages admin (PRIORITÉ 1)

**Impact** : ⭐⭐⭐
**Effort** : ⭐

```typescript
// pages/admin/**.vue
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
```

#### 3. Configurer préconnexion ressources externes (PRIORITÉ 2)

**Impact** : ⭐⭐⭐ (Performance)
**Effort** : ⭐

Déjà fait pour Google Fonts ✅

Ajouter pour Plausible :
```typescript
link: [
  { rel: 'dns-prefetch', href: 'https://plausible.io' }
]
```

#### 4. Minification CSS/JS en production (PRIORITÉ 2)

**Impact** : ⭐⭐⭐⭐ (Performance)
**Effort** : ⭐

Vérifier configuration Vite/Nuxt :
```typescript
vite: {
  build: {
    minify: 'esbuild',
    cssMinify: true
  }
}
```

#### 5. Compression Gzip/Brotli (PRIORITÉ 2)

**Impact** : ⭐⭐⭐⭐
**Effort** : ⭐⭐

```typescript
nitro: {
  preset: 'node-server',
  compressPublicAssets: true
}
```

### 10.3 Stratégie de contenu

#### 1. Créer page FAQ (PRIORITÉ 1)

**Impact** : ⭐⭐⭐⭐⭐ (Featured snippets)
**Effort** : ⭐⭐⭐

**Questions à inclure** :
- Pourquoi la ligne 21 a été supprimée ?
- Comment adhérer à ADUL21 ?
- Quels sont les impacts chiffrés ?
- Comment témoigner ?
- Quels sont les arguments juridiques ?
- Quand la ligne sera-t-elle rétablie ?
- Comment faire un don ?
- Qui contacter ?

**Structure SEO optimale** :
```html
<article>
  <h1>Questions fréquentes</h1>

  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h2 itemprop="name">Pourquoi la ligne 21 a été supprimée ?</h2>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">Réponse détaillée...</p>
    </div>
  </div>

  <!-- Répéter pour chaque question -->
</article>
```

#### 2. Blog actualités régulier (PRIORITÉ 2)

**Impact** : ⭐⭐⭐⭐⭐ (Contenu frais)
**Effort** : ⭐⭐⭐⭐

**Fréquence recommandée** : 1 article / semaine

**Thématiques** :
- Actions menées
- Réunions publiques
- Avancées juridiques
- Témoignages mis en avant
- Tribunes presse
- Partenariats associations
- Analyse transport public région

**SEO par article** :
- Title optimisé (60 caractères)
- Meta description (160 caractères)
- H1 unique
- Images avec alt
- Liens internes
- Structured data Article
- Partage réseaux sociaux

#### 3. Développer contenu longue traîne (PRIORITÉ 2)

**Impact** : ⭐⭐⭐⭐
**Effort** : ⭐⭐⭐⭐

**Exemples de requêtes longue traîne** :
- "comment aller de ledenon à nîmes sans voiture"
- "bus ledenon gare nîmes horaires"
- "association défense usagers transport public"
- "ligne bus supprimée que faire"
- "recours juridique service public transport"

**Pages à créer** :
- Guide transport Ledenon-Nîmes
- Comparatif avant/après ligne 21
- Tutoriel recours administratif
- Lexique droit transport public

#### 4. Optimiser contenu existant (PRIORITÉ 3)

**Impact** : ⭐⭐⭐
**Effort** : ⭐⭐

**Checklist par page** :
- [ ] Title 50-60 caractères
- [ ] Meta description 150-160 caractères
- [ ] H1 unique et descriptif
- [ ] Mots-clés naturellement intégrés
- [ ] Liens internes vers pages connexes
- [ ] Images avec alt descriptifs
- [ ] CTA clair
- [ ] Contenu > 300 mots

### 10.4 Link Building (Netlinking)

#### 1. Relations presse locale (PRIORITÉ 1)

**Impact** : ⭐⭐⭐⭐⭐
**Effort** : ⭐⭐⭐

**Médias à contacter** :
- Midi Libre (Nîmes)
- France Bleu Gard Lozère
- Objectif Gard
- La Marseillaise (édition Gard)
- Actu.fr Nîmes

**Avantages** :
- Backlinks de qualité
- Visibilité locale
- Crédibilité
- Trafic direct

#### 2. Partenariats associations (PRIORITÉ 2)

**Impact** : ⭐⭐⭐⭐
**Effort** : ⭐⭐

**Cibles** :
- FNAUT (Fédération Nationale des Associations d'Usagers des Transports)
- Associations usagers SNCF
- Collectifs transport public région
- Associations environnementales (angle mobilité douce)

**Actions** :
- Échange liens footer
- Articles invités
- Communiqués communs
- Événements conjoints

#### 3. Annuaires qualité (PRIORITÉ 2)

**Impact** : ⭐⭐⭐
**Effort** : ⭐⭐

Voir section 9.4 ci-dessus.

#### 4. Réseaux sociaux (PRIORITÉ 3)

**Impact** : ⭐⭐⭐
**Effort** : ⭐⭐⭐

**Plateformes recommandées** :
- Facebook (groupe local, partages)
- Twitter/X (relais presse, élus)
- LinkedIn (professionnels, lobbying)

**Pas de lien SEO direct mais** :
- Amplification contenu
- Trafic indirect
- Signaux sociaux

### 10.5 Suivi et KPIs

#### Métriques SEO à suivre

**Trafic organique** :
- Sessions organiques / mois
- Nouveaux utilisateurs organiques
- Taux de rebond organique
- Pages vues / session

**Positionnement** :
- Position moyenne Google
- Mots-clés top 3
- Mots-clés top 10
- Mots-clés top 100

**Engagement** :
- Durée session moyenne
- Taux conversion (adhésion, témoignage)
- Pages les plus vues
- Parcours utilisateur

**Technique** :
- Core Web Vitals (LCP, FID, CLS)
- Temps chargement page
- Erreurs crawl
- Couverture index Google

#### Outils recommandés

**Google Search Console** (GRATUIT - PRIORITÉ 1)
- Performances recherche
- Couverture index
- Expérience page
- Liens entrants
- Sitemaps

**Google Analytics 4** (OPTIONNEL)
Si Plausible insuffisant :
- Comportement utilisateurs
- Conversions
- Événements

**Google PageSpeed Insights** (GRATUIT)
- Core Web Vitals
- Recommandations performance
- Version mobile/desktop

**Ahrefs / Semrush** (PAYANT - OPTIONNEL)
- Analyse backlinks
- Recherche mots-clés
- Audit SEO
- Suivi positionnement

**Screaming Frog** (GRATUIT limité)
- Crawl site complet
- Audit technique
- Détection erreurs

#### Fréquence de suivi

**Hebdomadaire** :
- Trafic Plausible
- Nouveaux témoignages/adhésions

**Mensuel** :
- Google Search Console (positions, clics)
- Core Web Vitals
- Backlinks
- Contenu publié

**Trimestriel** :
- Audit SEO complet
- Révision stratégie contenu
- Analyse concurrence

---

## Résumé des priorités SEO

### Priorité 1 (À faire immédiatement)

1. ✅ **Ajouter og:image** sur toutes pages
2. ✅ **Installer @nuxtjs/sitemap**
3. ✅ **Ajouter canonical URLs**
4. ✅ **Structured data Organization**
5. ✅ **Robots meta sur /admin**
6. ✅ **Créer page FAQ**
7. ✅ **Relations presse locale**

### Priorité 2 (Dans les 2-4 semaines)

1. ⏱️ Optimiser meta descriptions longueur
2. ⏱️ Lazy loading images
3. ⏱️ Préconnexion Plausible
4. ⏱️ Blog actualités régulier
5. ⏱️ Partenariats associations
6. ⏱️ Annuaires qualité

### Priorité 3 (Dans les 1-3 mois)

1. 📅 Améliorer alt images
2. 📅 Contenu longue traîne
3. 📅 Optimiser contenu existant
4. 📅 Réseaux sociaux
5. 📅 Google Business Profile (quand adresse dispo)

---

## Checklist SEO complète

### Meta Tags
- [x] Title unique par page
- [ ] Longueur title optimale (50-60 car)
- [x] Meta description par page
- [ ] Longueur description optimale (150-160 car)
- [x] Open Graph tags
- [ ] og:image défini
- [x] Twitter Cards
- [ ] Canonical URLs
- [x] Lang attribute (fr)
- [ ] Keywords meta (optionnel)

### Structure HTML
- [x] Un seul H1 par page
- [x] Hiérarchie H1 > H2 > H3
- [x] Sémantique HTML5 (header, nav, main, footer)
- [ ] ARIA landmarks
- [ ] Schema.org Organization
- [ ] Schema.org Article (actualités)
- [ ] Schema.org Breadcrumb

### URLs
- [x] URLs parlantes
- [x] Structure cohérente
- [ ] Redirections 301 si nécessaire
- [x] Page 404 personnalisée

### Sitemap & Robots
- [ ] Sitemap.xml généré
- [x] Robots.txt configuré
- [ ] Sitemap dans robots.txt
- [ ] Pages admin en noindex

### Performance
- [x] SSR activé
- [ ] Images optimisées
- [ ] Lazy loading
- [x] Fonts optimisées (display=swap)
- [ ] Compression Gzip/Brotli
- [x] Mobile-friendly
- [ ] HTTPS en production

### Contenu
- [x] Contenu original
- [x] Mots-clés naturels
- [x] Contenu long (>300 mots)
- [ ] Page FAQ
- [ ] Blog régulier
- [x] Liens internes
- [ ] Liens contextuels

### Images
- [x] Attributs alt
- [ ] Alt descriptifs détaillés
- [x] Noms fichiers descriptifs
- [ ] Dimensions définies
- [ ] Lazy loading
- [x] Formats optimisés (SVG)

### Local SEO
- [x] Villes dans contenu
- [ ] NAP cohérent
- [ ] Google Business Profile
- [ ] Annuaires locaux
- [ ] Schema LocalBusiness

### Analytics
- [x] Plausible installé
- [ ] Events personnalisés
- [ ] Google Search Console
- [ ] Suivi conversions

### Link Building
- [ ] Relations presse
- [ ] Partenariats associations
- [ ] Annuaires qualité
- [ ] Réseaux sociaux

---

## Annexes

### Ressources SEO

**Documentation officielle** :
- Google Search Central : https://developers.google.com/search
- Schema.org : https://schema.org
- Web.dev (Performance) : https://web.dev

**Outils gratuits** :
- Google Search Console : https://search.google.com/search-console
- Google PageSpeed Insights : https://pagespeed.web.dev
- Google Mobile-Friendly Test : https://search.google.com/test/mobile-friendly
- Schema Markup Validator : https://validator.schema.org

**Guides Nuxt SEO** :
- Nuxt SEO : https://nuxt.com/docs/getting-started/seo-meta
- @nuxtjs/sitemap : https://sitemap.nuxtjs.org

### Contact support SEO

Pour toute question SEO :
- Documentation : `/docs/11-seo.md`
- Configuration : `nuxt.config.ts`
- Analytics : Plausible Dashboard

---

**Dernière mise à jour** : 17 octobre 2025
**Version** : 1.0
**Auteur** : Documentation ADUL21

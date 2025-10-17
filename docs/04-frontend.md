# Documentation Frontend - ADUL21

## Vue d'ensemble

Le frontend de l'application ADUL21 est développé avec **Nuxt 3** (framework Vue.js) et utilise **Nuxt UI** pour l'interface utilisateur. L'architecture est modulaire avec une séparation claire entre les pages publiques et l'interface d'administration.

### Stack technologique
- **Framework** : Nuxt 3 (Vue 3 avec Composition API)
- **UI Library** : Nuxt UI (basé sur Tailwind CSS et Headless UI)
- **Icons** : Heroicons via nuxt-icon
- **State Management** : Composables Vue et useState
- **API Client** : $fetch (natif Nuxt)
- **Routing** : File-based routing (Nuxt)

---

## 1. Pages publiques

### 1.1 Page d'accueil (`/pages/index.vue`)

**Route** : `/`

**Objectif** : Page d'atterrissage présentant la mobilisation et incitant à l'action

**Composants utilisés** :
- `<HomeHeroBanner />` : Bandeau principal avec appel à l'action
- `<HomeKeyFacts />` : Statistiques clés du problème
- `<HomeDidYouKnow />` : Infographies sur l'impact financier et écologique
- `<HomeCallToAction />` : Appels à l'action (témoigner, adhérer, faire un don)
- Section témoignages (placeholder)

**Appels API** : Aucun (données statiques)

**SEO** : Meta tags configurés avec useHead()

```vue
<template>
  <div>
    <HomeHeroBanner />
    <HomeKeyFacts />
    <HomeDidYouKnow />
    <HomeCallToAction />
    <!-- Section témoignages -->
  </div>
</template>
```

---

### 1.2 Pages Témoignages

#### 1.2.1 Liste des témoignages (`/pages/temoignages/index.vue`)

**Route** : `/temoignages`

**Objectif** : Afficher tous les témoignages publiés et approuvés

**Composants utilisés** : Aucun composant enfant (tout inline)

**Fonctionnalités** :
- **Filtres** :
  - Par commune (Ledenon, Cabrières, Saint-Gervasy, Autre)
  - Par type d'usager (Lycéen, Parent, Actif, Retraité, Autre)
- **Pagination** : 9 témoignages par page
- **États** :
  - Loading
  - Error
  - Empty state
  - Success avec grille de cartes

**Appels API** :
```typescript
// Fetch testimonies on mount
const { supabase } = useSupabase()
const { data, error } = await supabase
  .from('testimonies')
  .select('*')
  .eq('is_published', true)
  .eq('moderation_status', 'approved')
  .order('created_at', { ascending: false })
```

**Computed properties** :
- `filteredTestimonies` : Application des filtres
- `paginatedTestimonies` : Pagination
- `totalPages` : Nombre de pages
- `visiblePages` : Pages visibles dans la pagination

**Helper functions** :
```typescript
getDisplayName(testimony: Testimony): string // Gestion de l'anonymat
getUserTypeLabel(type: string): string
formatDate(dateString: string): string // Format relatif
```

---

#### 1.2.2 Détail d'un témoignage (`/pages/temoignages/[id].vue`)

**Route** : `/temoignages/:id`

**Objectif** : Afficher le détail complet d'un témoignage

**Fonctionnalités** :
- Affichage complet du témoignage
- Statistiques avant/après la suppression
- Difficultés rencontrées (checkboxes)
- Compteur de vues (incrémenté à chaque visite)
- Call-to-action pour témoigner à son tour

**Appels API** :
```typescript
// Fetch single testimony
const { data, error } = await supabase
  .from('testimonies')
  .select('*')
  .eq('id', id)
  .eq('is_published', true)
  .eq('moderation_status', 'approved')
  .single()

// Increment views
await $fetch(`/api/testimonies/${id}/increment-views`, { method: 'POST' })
```

**États** :
- Loading
- Error (testimony not found)
- Success

---

#### 1.2.3 Nouveau témoignage (`/pages/temoignages/nouveau.vue`)

**Route** : `/temoignages/nouveau`

**Objectif** : Formulaire multi-étapes pour soumettre un témoignage

**Formulaire en 4 étapes** :

**Étape 1 : Informations personnelles**
- Prénom (requis)
- Nom (optionnel pour anonymat)
- Tranche d'âge (requis)
- Email (requis)
- Téléphone (optionnel)
- Commune (requis)
- Type d'usager (requis)
- Champs conditionnels :
  - Si étudiant/parent : Lycée, Filière
  - Si actif : Lieu de travail, Horaires

**Étape 2 : Usage AVANT la suppression**
- Fréquence d'utilisation (requis)
- Temps de trajet (minutes)
- Coût mensuel (€)
- Destination principale

**Étape 3 : Situation APRÈS la suppression**
- Solution de transport actuelle (requis)
- Champs conditionnels selon la solution :
  - Si voiture : Distance parcourue, Surcoût mensuel
  - Si correspondances : Nombre de correspondances, Temps d'attente, Nouveau temps total, Correspondances ratées/mois
- Problèmes rencontrés (checkboxes multiples)

**Étape 4 : Témoignage et consentements**
- Témoignage principal (50-2000 caractères, requis)
- Exemple concret (max 500 caractères, optionnel)
- Préférences de publication (requis) :
  - Prénom
  - Initiales
  - Anonyme
- Consentements :
  - Publication sur le site (requis)
  - Usage juridique
  - Contact médias
  - Témoignage oral

**Progress indicator** : Stepper visuel avec numéros et états (completed, current, pending)

**Validation** :
- HTML5 validation (required, minlength, maxlength, type)
- Validation côté client avant soumission
- Messages d'erreur contextuels

**Appels API** :
```typescript
const { data, error } = await $fetch('/api/testimonies', {
  method: 'POST',
  body: form.value
})
```

**Navigation** :
- Boutons "Retour" et "Continuer" entre les étapes
- Scroll automatique en haut de page lors du changement d'étape
- Redirection vers `/temoignages` après succès (3 secondes)

---

### 1.3 Pages Adhésion et Soutien

#### 1.3.1 Formulaire d'adhésion (`/pages/rejoindre/adherer.vue`)

**Route** : `/rejoindre/adherer`

**Objectif** : Formulaire complet pour adhérer à l'association (post-création)

**Redirection conditionnelle** : Si `associationCreated = false`, redirection vers `/rejoindre/soutien`

**Formulaire en 4 étapes** :

**Étape 1 : Coordonnées**
- Civilité (requis)
- Prénom, Nom (requis)
- Date de naissance (optionnel)
- Email, Téléphone (requis)
- Adresse complète (requis)
- Code postal, Commune (requis)

**Étape 2 : Profil d'usager**
- Type d'usager (requis)
- Champs conditionnels si étudiant : Établissement, Filière
- Usage AVANT la suppression
- Solution APRÈS la suppression

**Étape 3 : Type d'adhésion**
- Tarif réduit : 5€ (étudiants, demandeurs d'emploi)
- Tarif normal : 15€ (standard)
- Tarif de soutien : 50€
- Montant libre (minimum 5€)
- Sélection visuelle avec cartes cliquables

**Étape 4 : Engagement et consentements**
- Participation active (checkbox)
  - Si oui : domaines d'action (checkboxes multiples)
- Consentements RGPD :
  - Newsletter
  - Publication témoignage
  - Contact médias
  - Sollicitation actions
- Information sur les modalités de paiement

**Appels API** :
```typescript
await $fetch('/api/members', {
  method: 'POST',
  body: form.value
})
```

**States** :
- `submitSuccess` : Affiche message de confirmation
- `submitError` : Affiche message d'erreur

---

#### 1.3.2 Formulaire de pré-adhésion (`/pages/rejoindre/soutien.vue`)

**Route** : `/rejoindre/soutien`

**Objectif** : Inscription gratuite avant création officielle de l'association

**Fonctionnalités** :
- Compteur de soutiens en temps réel
- Formulaire simplifié (une seule page)
- Informations sur la phase de pré-création

**Champs du formulaire** :
- Prénom, Nom (requis)
- Email, Téléphone (requis)
- Commune (requis)
- Type d'usager (requis)
- Options d'engagement :
  - Devenir membre dès la création
  - S'investir activement (avec domaines d'action)
  - Héberger une réunion
  - Distribuer des tracts
- Consentements :
  - Newsletter
  - Contact à la création
  - Invitation AG constitutive

**Appels API** :
```typescript
// Get current support count
const { data } = await $fetch('/api/pre-members/count')

// Submit support
const response = await $fetch('/api/pre-members', {
  method: 'POST',
  body: form.value
})
```

**Success state** : Affiche le nombre total de soutiens mis à jour

---

### 1.4 Page Contact (`/pages/contact.vue`)

**Route** : `/contact`

**Objectif** : Formulaire de contact avec l'association

**Layout** : Grille 2 colonnes (info + formulaire)

**Colonne gauche - Informations** :
- Email : assoligne21@gmail.com
- Délai de réponse : 48h ouvrées
- Confidentialité

**Colonne droite - Formulaire** :
- Civilité, Prénom, Nom (requis)
- Email (requis), Téléphone (optionnel)
- Sujet (requis) :
  - Témoignage
  - Adhésion
  - Bénévolat
  - Demande presse/média
  - Question juridique
  - Autre
- Message (requis)
- Consentement RGPD (requis)

**Appels API** :
```typescript
await $fetch('/api/contact', {
  method: 'POST',
  body: form.value
})
```

**States** :
- `isSubmitting`
- `submitSuccess`
- `submitError`

---

### 1.5 Autres pages publiques

#### Pages informatives (statiques) :
- `/revendications` : Revendications de l'association
- `/arguments-juridiques` : Arguments juridiques
- `/impacts` : Impacts chiffrés
- `/actualites/index` : Liste des actualités
- `/actualites/[slug]` : Détail d'une actualité
- `/telechargements` : Documents téléchargeables
- `/mentions-legales` : Mentions légales
- `/politique-confidentialite` : Politique de confidentialité

---

## 2. Pages Admin

L'interface d'administration utilise le layout `admin.vue` avec sidebar et nécessite une authentification.

### 2.1 Login (`/pages/admin/login.vue`)

**Route** : `/admin/login`

**Layout** : `false` (pas de layout, page standalone)

**Middleware** : Aucun (page publique)

**Fonctionnalités** :
- Formulaire email + mot de passe
- Redirection si déjà authentifié
- Gestion des erreurs

**Appels API** :
```typescript
const { login, isAuthenticated } = useAuth()
const result = await login(email.value, password.value)

if (result.success) {
  await router.push('/admin')
}
```

**Design** :
- Fullscreen gradient background
- Card centrée
- Logo ADUL21
- Lien retour vers le site

---

### 2.2 Dashboard (`/pages/admin/index.vue`)

**Route** : `/admin`

**Layout** : `admin`

**Middleware** : `admin-auth`

**Objectif** : Vue d'ensemble des statistiques et accès rapides

**Cartes statistiques** :
- **Témoignages** : Total, en attente, publiés
- **Membres** : Total des adhésions
- **Soutiens** : Total, ceux qui veulent adhérer, bénévoles
- **Newsletter** : Abonnés actifs, désabonnés
- **Messages** : Non lus (badge rouge)
- **Actualités** : Total, publiées

**Actions rapides** :
- Modérer les témoignages
- Voir les membres
- Lire les messages

**Appels API** :
```typescript
const { data: stats, pending } = await useFetch('/api/admin/stats', {
  key: 'admin-stats'
})
```

**Structure de la réponse stats** :
```typescript
{
  testimonies: { total, pending, published },
  members: { total },
  preMembers: { total, wantToBeMembers, wantToVolunteer },
  newsletter: { active, unsubscribed },
  messages: { unread },
  news: { total, published }
}
```

---

### 2.3 Gestion des témoignages (`/pages/admin/temoignages/index.vue`)

**Route** : `/admin/temoignages`

**Layout** : `admin`

**Middleware** : `admin-auth`

**Fonctionnalités** :
- **Filtres** : Tous, En attente, Publiés
- **Tableau** avec colonnes :
  - Auteur (nom + email)
  - Ville
  - Date
  - Statut (badge coloré)
  - Actions
- **Actions** :
  - Publier (si pending)
  - Dépublier (si publié)

**Appels API** :
```typescript
// Fetch testimonies
const { data: testimoniesList, pending, refresh } = await useFetch('/api/testimonies', {
  query: { limit: 100 }
})

// Publish testimony
await $fetch(`/api/testimonies/${id}`, {
  method: 'PATCH',
  body: {
    isPublished: true,
    moderationStatus: 'approved'
  }
})

// Unpublish testimony
await $fetch(`/api/testimonies/${id}`, {
  method: 'PATCH',
  body: { isPublished: false }
})
```

**Computed** :
- `filteredTestimonies` : Filtrage par statut
- `pendingCount` : Nombre en attente
- `publishedCount` : Nombre publiés

---

### 2.4 Gestion des membres (`/pages/admin/membres/index.vue`)

**Route** : `/admin/membres`

**Layout** : `admin`

**Middleware** : `admin-auth`

**Fonctionnalités** :
- **Barre de recherche** : Recherche par nom, email, ville
- **Tableau** avec colonnes :
  - Membre (nom + email)
  - Ville
  - Type d'usager
  - Cotisation (montant en €)
  - Statut (badge coloré : actif, en attente, expiré)
  - Date d'adhésion

**Appels API** :
```typescript
const { data: membersList, pending } = await useFetch('/api/members', {
  query: { limit: 500 }
})
```

**Computed** :
```typescript
const filteredMembers = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return membersList.value.filter((member: any) =>
    member.firstName.toLowerCase().includes(query) ||
    member.lastName.toLowerCase().includes(query) ||
    member.email.toLowerCase().includes(query) ||
    member.city.toLowerCase().includes(query)
  )
})
```

**Helper functions** :
```typescript
getUserTypeLabel(type: string): string
getStatusLabel(status: string): string
formatDate(date: string): string
```

---

### 2.5 Autres pages admin

- **`/admin/soutiens`** : Gestion des pré-membres (similaire à membres)
- **`/admin/newsletter`** : Gestion de la newsletter
- **`/admin/contacts`** : Gestion des messages de contact

---

## 3. Composants réutilisables

### 3.1 Layout

#### 3.1.1 `AppHeader.vue`

**Emplacement** : `/components/layout/AppHeader.vue`

**Objectif** : Header principal avec navigation

**Fonctionnalités** :
- Logo cliquable (retour accueil)
- Navigation desktop (liens horizontaux)
- Navigation mobile (menu hamburger)
- Bouton "Adhérer" mis en avant

**Navigation items** :
```typescript
const items = [
  { label: 'Revendications', to: '/revendications' },
  { label: 'Arguments', to: '/arguments-juridiques' },
  { label: 'Témoignages', to: '/temoignages' },
  { label: 'Actualités', to: '/actualites' },
  { label: 'Contact', to: '/contact' }
]
```

**State** :
```typescript
const mobileMenuOpen = ref(false)
```

**Responsive** :
- Desktop (lg+) : Menu horizontal
- Mobile (<lg) : Menu hamburger avec overlay

---

#### 3.1.2 `AppFooter.vue`

**Emplacement** : `/components/layout/AppFooter.vue`

**Objectif** : Footer avec liens et newsletter

**Sections** (grid 4 colonnes) :
1. **About** : Logo, description, copyright
2. **L'association** : Liens vers pages clés
3. **Agir** : Liens vers actions
4. **Newsletter** : Formulaire d'inscription

**Newsletter form** :
```typescript
async function onSubmit() {
  await $fetch('/api/newsletter/subscribe', {
    method: 'POST',
    body: { email: email.value, source: 'footer' }
  })
}
```

**Bottom bar** :
- Mentions légales
- Politique de confidentialité
- Email de contact

---

### 3.2 Home (Page d'accueil)

#### 3.2.1 `HeroBanner.vue`

**Emplacement** : `/components/home/HeroBanner.vue`

**Objectif** : Bandeau héro avec titre impactant et CTA

**Éléments** :
- Background gradient avec pattern
- Logo ADUL21
- Visualisation de la ligne de bus (avec croix rouge sur la rupture)
- Titre principal : "NOTRE LIGNE DIRECTE A ÉTÉ SUPPRIMÉE"
- Sous-titre : "Nous exigeons son rétablissement immédiat"
- 3 boutons CTA :
  - **Témoigner** (rouge, très mis en avant)
  - **Adhérer** (blanc)
  - **Nos revendications** (outline)
- Indicateur de scroll (chevron animé)

**Props** : Aucun (composant autonome)

**Design** :
- Hauteur : min-h-[95vh]
- Animations : hover scale, translate, shadow
- Responsive : Texte et boutons s'adaptent

---

#### 3.2.2 `KeyFacts.vue`

**Emplacement** : `/components/home/KeyFacts.vue`

**Objectif** : Afficher les statistiques clés du problème

**Structure** : Grid 4 colonnes (responsive : 1 colonne mobile)

**Cartes** :
1. **Temps** : +45 min de temps de trajet
2. **Surcoût** : 194 à 324€/an pour les familles
3. **Habitants** : 400+ privés de mobilité
4. **Jeunes** : 120+ lycéens/étudiants impactés

**Props** : Aucun (données statiques)

**Chaque carte contient** :
- Icône colorée
- Chiffre principal (grand)
- Description

---

#### 3.2.3 `DidYouKnow.vue`

**Emplacement** : `/components/home/DidYouKnow.vue`

**Objectif** : Infographies détaillées sur l'impact par commune

**Structure** : Grid 2 colonnes (responsive : 1 colonne mobile)

**Carte Ledenon** :
- Distance : 9,2 km jusqu'à Marguerittes
- Impact par trajet : 18,4 km A/R, 1,80€, 4,8 kg CO2, 22 min
- Scénario 3 trajets/semaine : 194€, 520 kg CO2, 40h
- Scénario 5 trajets/semaine : 324€, 864 kg CO2, 66h

**Carte Cabrières** :
- Distance : 6 km jusqu'à Marguerittes
- Impact par trajet : 12 km A/R, 1,20€, 3,1 kg CO2, 14 min
- Scénario 3 trajets/semaine : 130€, 335 kg CO2, 25h
- Scénario 5 trajets/semaine : 216€, 558 kg CO2, 42h

**Section "Paradoxe écologique"** :
- Background gradient vert/bleu
- Statistiques comparatives Avant/Après
- Impact CO2 global : +1.000 tonnes/an

**Props** : Aucun (données statiques)

---

#### 3.2.4 `CallToAction.vue`

**Emplacement** : `/components/home/CallToAction.vue`

**Objectif** : Section CTA finale avec 3 boutons

**Utilise** : `<UPageCTA>` de Nuxt UI

**Liens** :
```typescript
const links = [
  {
    label: 'Témoigner',
    to: '/temoignages/nouveau',
    icon: 'i-heroicons-document-text',
    color: 'red',
    size: 'xl'
  },
  {
    label: 'Adhérer à l\'association',
    to: '/rejoindre/adherer',
    icon: 'i-heroicons-user-plus',
    color: 'primary',
    size: 'xl'
  },
  {
    label: 'Faire un don',
    to: '/rejoindre/soutien',
    icon: 'i-heroicons-heart',
    variant: 'outline',
    color: 'primary',
    size: 'xl'
  }
]
```

**Design** :
- Background gradient primary
- Titre en blanc
- Boutons avec animations hover

---

### 3.3 UI Components

#### 3.3.1 `ImpactCard.vue`

**Emplacement** : `/components/ui/ImpactCard.vue`

**Objectif** : Carte pour afficher un impact/stat avec icône

**Props** :
```typescript
interface Props {
  title: string           // Titre de la carte
  description: string     // Description
  icon: string           // Nom de l'icône Heroicons
  color?: 'primary' | 'red' | 'orange' | 'green' | 'blue'
  value?: string | number // Valeur optionnelle à afficher
}
```

**Usage** :
```vue
<UiImpactCard
  title="Temps perdu"
  description="Temps additionnel dans les transports"
  icon="heroicons:clock"
  color="red"
  value="+45 min"
/>
```

**Design** :
- Utilise `<UCard>` de Nuxt UI
- Icône circulaire colorée
- Titre en gras
- Description en texte normal
- Valeur en grand (si fournie)
- Hover effect : scale et shadow

---

#### 3.3.2 `StatsCard.vue`

**Emplacement** : `/components/ui/StatsCard.vue`

**Objectif** : Carte pour afficher une statistique centrée

**Props** :
```typescript
interface Props {
  value: string | number  // Valeur de la statistique
  label: string          // Label descriptif
  color?: 'primary' | 'red' | 'orange' | 'green' | 'blue'
  icon?: string         // Icône optionnelle
  animate?: boolean     // Animation hover
}
```

**Usage** :
```vue
<UiStatsCard
  value="400+"
  label="Habitants impactés"
  color="blue"
  icon="heroicons:user-group"
  animate
/>
```

**Design** :
- Texte centré
- Icône circulaire en haut (si fournie)
- Valeur en très grand (4xl-5xl)
- Label en petit caps
- Animation scale au hover (si animate=true)

---

## 4. Layouts

### 4.1 Layout par défaut (`app.vue`)

**Fichier** : `/app.vue`

**Structure** :
```vue
<template>
  <div>
    <LayoutAppHeader />
    <main>
      <NuxtPage />
    </main>
    <LayoutAppFooter />
  </div>
</template>
```

**Configuration SEO globale** :
- Langue : `fr`
- Title template : `${title} - ADUL21`
- Meta description
- Open Graph tags
- Twitter card
- Theme color (responsive au dark mode)

**Scripts** :
```typescript
const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? '#171717' : 'white')
```

---

### 4.2 Layout admin (`/layouts/admin.vue`)

**Objectif** : Layout pour l'interface d'administration

**Structure** :
- **Top bar** : Logo, titre "Administration", user name, bouton déconnexion
- **Sidebar** (fixed left) : Navigation avec icônes
- **Main content** : Zone de contenu (slot)

**Navigation sidebar** :
```typescript
const menuItems = [
  { label: 'Dashboard', to: '/admin', icon: 'heroicons:home' },
  { label: 'Témoignages', to: '/admin/temoignages', icon: 'heroicons:chat-bubble-left-right' },
  { label: 'Membres', to: '/admin/membres', icon: 'heroicons:users' },
  { label: 'Soutiens', to: '/admin/soutiens', icon: 'heroicons:hand-raised' },
  { label: 'Newsletter', to: '/admin/newsletter', icon: 'heroicons:envelope-open' },
  { label: 'Messages', to: '/admin/contacts', icon: 'heroicons:envelope' }
]
```

**Active state** : `active-class="bg-primary-50 text-primary-600 font-semibold"`

**Scripts** :
```typescript
const { user, logout } = useAuth()
```

**Responsive** :
- Desktop : Sidebar 256px, main flex-1
- Toute la hauteur : min-h-[calc(100vh-4rem)]

---

## 5. Composables

### 5.1 `useAuth.ts`

**Emplacement** : `/composables/useAuth.ts`

**Objectif** : Gestion de l'authentification admin

**Interface** :
```typescript
export interface AdminUser {
  id: string
  email: string
  name: string
}
```

**State** :
```typescript
const user = useState<AdminUser | null>('admin-user', () => null)
const loading = useState<boolean>('auth-loading', () => false)
```

**Méthodes** :

#### `login(email: string, password: string)`
```typescript
// POST /api/auth/login
// Retourne : { success: boolean, message?: string }
```

#### `logout()`
```typescript
// POST /api/auth/logout
// Redirection vers /admin/login
```

#### `checkAuth()`
```typescript
// GET /api/auth/me
// Vérifie si l'utilisateur est authentifié
// Retourne : boolean
```

**Computed** :
```typescript
const isAuthenticated = computed(() => !!user.value)
```

**Usage** :
```vue
<script setup>
const { user, login, logout, isAuthenticated } = useAuth()

const handleLogin = async () => {
  const result = await login(email, password)
  if (result.success) {
    // Success
  }
}
</script>
```

---

### 5.2 `useSupabase.ts`

**Emplacement** : `/composables/useSupabase.ts`

**Objectif** : Client simplifié pour les appels API (remplace Supabase client)

**Architecture** :
- Query builder pattern
- Appels vers les endpoints API Nuxt
- Compatible avec la syntaxe Supabase

**Classes** :

#### `ClientQueryBuilder`
```typescript
class ClientQueryBuilder {
  select(fields?: string)
  eq(field: string, value: any)
  order(field: string, options?: { ascending?: boolean })
  limit(count: number)
  single()
  then(resolve, reject?) // Promise interface
}
```

#### `ClientDatabase`
```typescript
class ClientDatabase {
  from(table: string) {
    return {
      select: (fields?: string) => ClientQueryBuilder
    }
  }
}
```

**Usage** :
```typescript
const { supabase } = useSupabase()

// Exemple : récupérer des témoignages
const { data, error } = await supabase
  .from('testimonies')
  .select('*')
  .eq('is_published', true)
  .order('created_at', { ascending: false })
  .limit(10)
```

**Note** : Les appels sont transformés en requêtes vers `/api/{table}?{params}`

---

### 5.3 `useTestimonies.ts`

**Emplacement** : `/composables/useTestimonies.ts`

**Objectif** : Gestion complète des témoignages côté client

**State** :
```typescript
const testimonies = ref<Testimony[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const filters = reactive({
  city: '',
  userType: '',
  moderationStatus: 'approved',
  searchQuery: ''
})
```

**Computed** :

#### `filteredTestimonies`
Application des filtres sur les témoignages

#### `stats`
```typescript
{
  total: number
  pending: number
  approved: number
  published: number
  featured: number
}
```

**Méthodes** :

#### `fetchTestimonies(options?)`
```typescript
// GET /api/testimonies?{params}
// Options: moderationStatus, published, featured
```

#### `fetchTestimony(id)`
```typescript
// GET /api/testimonies/:id
```

#### `createTestimony(data: TestimonyForm)`
```typescript
// POST /api/testimonies
```

#### `updateTestimony(id, data: Partial<Testimony>)`
```typescript
// PATCH /api/testimonies/:id
```

#### `deleteTestimony(id)`
```typescript
// DELETE /api/testimonies/:id
```

#### `moderateTestimony(id, status, notes?)`
Raccourci pour mettre à jour le statut de modération

#### `togglePublish(id, isPublished)`
Publier/dépublier un témoignage

#### `toggleFeature(id, isFeatured)`
Mettre en avant/retirer un témoignage

#### `incrementViews(id)`
```typescript
// POST /api/testimonies/:id/views
```

#### `incrementReactions(id)`
```typescript
// POST /api/testimonies/:id/reactions
```

#### `incrementShares(id)`
```typescript
// POST /api/testimonies/:id/shares
```

**Usage** :
```vue
<script setup>
const {
  testimonies,
  loading,
  error,
  filteredTestimonies,
  stats,
  fetchTestimonies,
  togglePublish
} = useTestimonies()

onMounted(() => {
  fetchTestimonies({ moderationStatus: 'approved', published: true })
})

const publish = (id: string) => {
  togglePublish(id, true)
}
</script>
```

---

### 5.4 `useMembers.ts`

**Emplacement** : `/composables/useMembers.ts`

**Objectif** : Gestion complète des membres côté client

**State** :
```typescript
const members = ref<Member[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const filters = reactive({
  city: '',
  userType: '',
  membershipStatus: 'active',
  membershipType: '',
  searchQuery: ''
})
```

**Computed** :

#### `filteredMembers`
Application des filtres sur les membres

#### `stats`
```typescript
{
  total: number
  active: number
  pending: number
  expired: number
  cancelled: number
  wantsToParticipate: number
}
```

#### `revenueStats`
```typescript
{
  totalAnnualRevenue: number
  averageFee: number
  byType: {
    reduced: number
    normal: number
    support: number
  }
}
```

#### `membersExpiringSoon`
Membres dont l'adhésion expire dans 30 jours

**Méthodes** :

#### `fetchMembers(options?)`
```typescript
// GET /api/members?{params}
// Options: membershipStatus, membershipType, wantsToParticipate
```

#### `fetchMember(id)`
```typescript
// GET /api/members/:id
```

#### `createMember(data: MemberForm)`
```typescript
// POST /api/members
```

#### `updateMember(id, data: Partial<Member>)`
```typescript
// PATCH /api/members/:id
```

#### `deleteMember(id)`
```typescript
// DELETE /api/members/:id
```

#### `updateMembershipStatus(id, status)`
Mettre à jour le statut d'adhésion

#### `renewMembership(id, endDate)`
Renouveler une adhésion

#### `cancelMembership(id)`
Annuler une adhésion

#### `updateStripeInfo(id, stripeCustomerId)`
Mettre à jour les infos Stripe

#### `getMembersByParticipationArea(area: string)`
Filtrer les membres par domaine de participation

#### `exportMembersCSV()`
Exporter les membres en CSV (download automatique)

**Usage** :
```vue
<script setup>
const {
  members,
  loading,
  filteredMembers,
  stats,
  revenueStats,
  fetchMembers,
  exportMembersCSV
} = useMembers()

onMounted(() => {
  fetchMembers({ membershipStatus: 'active' })
})

const exportData = () => {
  exportMembersCSV()
}
</script>
```

---

## 6. Formulaires et Validation

### 6.1 Validation côté client

Tous les formulaires utilisent :
- **HTML5 validation** : `required`, `minlength`, `maxlength`, `type`, `pattern`
- **Validation JavaScript** avant soumission
- **Messages d'erreur contextuels**

**Exemple (formulaire de témoignage)** :
```vue
<input
  v-model="form.first_name"
  type="text"
  required
  class="w-full px-4 py-2 border border-gray-300 rounded-lg
         focus:ring-2 focus:ring-primary-500"
/>

<textarea
  v-model="form.testimony_text"
  rows="8"
  required
  minlength="50"
  maxlength="2000"
  class="..."
></textarea>
<div class="text-sm text-gray-500 mt-1">
  {{ form.testimony_text.length }} / 2000 caractères
</div>
```

**Validation avant soumission** :
```typescript
const submitTestimony = async () => {
  if (!form.value.accepts_site_publication) {
    submitError.value = 'Vous devez accepter la publication...'
    return
  }

  if (form.value.testimony_text.length < 50 || form.value.testimony_text.length > 2000) {
    submitError.value = 'Le témoignage doit contenir entre 50 et 2000 caractères.'
    return
  }

  // Appel API...
}
```

---

### 6.2 Gestion des états de soumission

Pattern uniforme dans tous les formulaires :

```typescript
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const handleSubmit = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = ''

  try {
    await $fetch('/api/endpoint', {
      method: 'POST',
      body: form.value
    })
    submitSuccess.value = true
  } catch (error: any) {
    submitError.value = error.data?.message || 'Une erreur est survenue'
  } finally {
    isSubmitting.value = false
  }
}
```

**Affichage des messages** :
```vue
<!-- Success -->
<div v-if="submitSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
  ✓ Message de succès
</div>

<!-- Error -->
<div v-if="submitError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
  ✗ {{ submitError }}
</div>

<!-- Loading button -->
<button
  type="submit"
  :disabled="isSubmitting"
  class="btn-primary disabled:opacity-50"
>
  <Icon v-if="!isSubmitting" name="heroicons:check" class="w-5 h-5 mr-2" />
  <Icon v-else name="heroicons:arrow-path" class="w-5 h-5 mr-2 animate-spin" />
  {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer' }}
</button>
```

---

### 6.3 Champs conditionnels

**Exemple : Formulaire de témoignage (Étape 1)** :
```vue
<!-- Champs conditionnels pour les étudiants -->
<div v-if="form.user_type === 'student' || form.user_type === 'parent'"
     class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label>Lycée</label>
    <input v-model="form.school_name" type="text" />
  </div>
  <div>
    <label>Filière / Section</label>
    <input v-model="form.school_section" type="text" />
  </div>
</div>

<!-- Champs conditionnels pour les actifs -->
<div v-if="form.user_type === 'worker'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label>Lieu de travail</label>
    <input v-model="form.workplace" type="text" />
  </div>
  <div>
    <label>Horaires de travail</label>
    <input v-model="form.work_hours" type="text" />
  </div>
</div>
```

**Exemple : Formulaire de témoignage (Étape 3)** :
```vue
<!-- Si la solution est "voiture" -->
<div v-if="form.usage_after_solution === 'car'" class="space-y-4">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label>Distance parcourue (km/jour)</label>
      <input v-model.number="form.usage_after_distance" type="number" />
    </div>
    <div>
      <label>Surcoût mensuel (€)</label>
      <input v-model.number="form.usage_after_cost" type="number" />
    </div>
  </div>
</div>

<!-- Si la solution est "correspondances" -->
<div v-if="form.usage_after_solution === 'correspondences'" class="space-y-4">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label>Nombre de correspondances</label>
      <input v-model.number="form.usage_after_correspondences" type="number" />
    </div>
    <div>
      <label>Temps d'attente total (min)</label>
      <input v-model.number="form.usage_after_wait_time" type="number" />
    </div>
    <div>
      <label>Nouveau temps total (min)</label>
      <input v-model.number="form.usage_after_time" type="number" />
    </div>
  </div>
</div>
```

---

## 7. Flux de données et interactions

### 7.1 Flux de témoignage

```
┌─────────────────────────────────────────────────────────────┐
│                       FLUX DE TÉMOIGNAGE                    │
└─────────────────────────────────────────────────────────────┘

1. Utilisateur remplit le formulaire /temoignages/nouveau
   ├─ Étape 1 : Informations personnelles
   ├─ Étape 2 : Usage AVANT
   ├─ Étape 3 : Usage APRÈS
   └─ Étape 4 : Témoignage + Consentements

2. Soumission du formulaire
   └─> POST /api/testimonies
       ├─ Validation des données
       ├─ Insertion en base (Supabase)
       │  - moderation_status: 'pending'
       │  - is_published: false
       └─ Envoi email confirmation

3. Modération par l'admin
   └─> /admin/temoignages
       ├─ Affichage de tous les témoignages
       ├─ Filtre "En attente"
       └─> Action "Publier"
           └─> PATCH /api/testimonies/:id
               ├─ moderation_status: 'approved'
               └─ is_published: true

4. Affichage public
   └─> /temoignages
       ├─ Fetch uniquement is_published=true & moderation_status='approved'
       ├─ Filtres par commune et type
       └─> Clic sur un témoignage
           └─> /temoignages/:id
               ├─ Affichage complet
               └─ Incrémentation des vues
                   └─> POST /api/testimonies/:id/increment-views
```

---

### 7.2 Flux d'adhésion

```
┌─────────────────────────────────────────────────────────────┐
│                       FLUX D'ADHÉSION                       │
└─────────────────────────────────────────────────────────────┘

PHASE 1 : PRÉ-ADHÉSION (Association pas encore créée)
=======================================================

1. Utilisateur accède à /rejoindre/adherer
   └─> Redirection automatique vers /rejoindre/soutien
       (si associationCreated = false)

2. Page /rejoindre/soutien
   ├─ Fetch du compteur de soutiens
   │  └─> GET /api/pre-members/count
   └─ Formulaire simplifié (une seule page)

3. Soumission
   └─> POST /api/pre-members
       ├─ Insertion en base (pre_members)
       ├─ Envoi email confirmation
       └─ Affichage nouveau total de soutiens

PHASE 2 : ADHÉSION (Association créée)
========================================

1. Utilisateur accède à /rejoindre/adherer
   └─ Formulaire complet en 4 étapes

2. Soumission
   └─> POST /api/members
       ├─ Insertion en base (members)
       │  - membership_status: 'pending'
       ├─ Envoi email avec coordonnées bancaires
       └─ Affichage message de succès

3. Paiement manuel
   └─ Admin vérifie le paiement
       └─> /admin/membres
           └─> Update membership_status: 'active'
               └─> PATCH /api/members/:id
```

---

### 7.3 Flux de contact

```
┌─────────────────────────────────────────────────────────────┐
│                        FLUX DE CONTACT                      │
└─────────────────────────────────────────────────────────────┘

1. Utilisateur remplit le formulaire /contact
   ├─ Civilité, Nom, Prénom
   ├─ Email, Téléphone
   ├─ Sujet (dropdown)
   ├─ Message
   └─ Consentement RGPD

2. Soumission
   └─> POST /api/contact
       ├─ Validation des données
       ├─ Insertion en base (contact_messages)
       │  - is_read: false
       ├─ Envoi email à l'association
       └─ Envoi email de confirmation à l'utilisateur

3. Admin consulte les messages
   └─> /admin/contacts
       ├─ Badge "non lus" sur le dashboard
       ├─ Affichage de tous les messages
       └─> Clic sur un message
           └─> Marque comme lu
               └─> PATCH /api/contact/:id
                   └─ is_read: true
```

---

### 7.4 Flux d'authentification admin

```
┌─────────────────────────────────────────────────────────────┐
│                   FLUX D'AUTHENTIFICATION                   │
└─────────────────────────────────────────────────────────────┘

1. Admin accède à /admin ou /admin/*
   └─> Middleware 'admin-auth' vérifie l'authentification
       ├─ Si non authentifié
       │  └─> Redirection vers /admin/login
       └─ Si authentifié
           └─> Affichage de la page

2. Page de login /admin/login
   ├─ Formulaire email + mot de passe
   └─ Soumission
       └─> useAuth().login(email, password)
           └─> POST /api/auth/login
               ├─ Vérification des credentials
               ├─ Création session (cookie httpOnly)
               ├─ Retour user data
               └─> Redirection vers /admin

3. Navigation dans l'admin
   ├─ Session maintenue via cookie
   └─ User info stockée dans useState('admin-user')

4. Déconnexion
   └─> Clic sur bouton "Déconnexion"
       └─> useAuth().logout()
           └─> POST /api/auth/logout
               ├─ Suppression session
               └─> Redirection vers /admin/login
```

---

## 8. Styles et Design System

### 8.1 Tailwind CSS

Le projet utilise **Tailwind CSS** via **Nuxt UI** avec une configuration personnalisée.

**Classes utilitaires fréquentes** :
```css
/* Containers */
.container-custom { @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8; }

/* Cards */
.card { @apply bg-white rounded-xl shadow-sm p-6 border border-gray-200; }

/* Buttons */
.btn-primary {
  @apply bg-primary-600 text-white px-6 py-3 rounded-lg
         font-semibold hover:bg-primary-700 transition-colors;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-900 px-6 py-3 rounded-lg
         font-semibold hover:bg-gray-300 transition-colors;
}

.btn-outline {
  @apply border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg
         font-semibold hover:bg-primary-50 transition-colors;
}
```

---

### 8.2 Couleurs

**Palette primaire** (bleu) :
```javascript
primary: {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',  // Couleur principale
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
}
```

**Couleurs sémantiques** :
- **Success** : green-600
- **Warning** : orange-600
- **Danger** : red-600
- **Info** : blue-600

---

### 8.3 Typographie

**Échelle de tailles** :
```css
/* Headings */
h1 { @apply text-4xl md:text-5xl font-bold; }
h2 { @apply text-3xl md:text-4xl font-bold; }
h3 { @apply text-2xl md:text-3xl font-bold; }
h4 { @apply text-xl md:text-2xl font-semibold; }

/* Body */
.text-body { @apply text-base text-gray-700; }
.text-muted { @apply text-sm text-gray-600; }
.text-small { @apply text-xs text-gray-500; }
```

**Poids** :
- `font-normal` : 400
- `font-medium` : 500
- `font-semibold` : 600
- `font-bold` : 700
- `font-black` : 900

---

### 8.4 Espacements

**Système d'espacement** :
- Section : `py-16` (64px vertical)
- Container : `px-4 sm:px-6 lg:px-8`
- Cards gap : `gap-6` (24px)
- Form elements : `space-y-6` (24px vertical)

---

### 8.5 Responsive Design

**Breakpoints Tailwind** :
```javascript
sm: '640px'   // Small devices
md: '768px'   // Medium devices
lg: '1024px'  // Large devices
xl: '1280px'  // Extra large devices
2xl: '1536px' // 2X Extra large devices
```

**Pattern mobile-first** :
```vue
<!-- Par défaut mobile, puis responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- 1 col mobile, 2 cols tablette, 4 cols desktop -->
</div>

<h1 class="text-3xl md:text-4xl lg:text-5xl">
  <!-- Taille progressive -->
</h1>
```

---

### 8.6 Animations et transitions

**Hover effects** :
```css
/* Scale + Shadow */
.hover\:scale-105 { transform: scale(1.05); }
.hover\:shadow-xl { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }

/* Translate */
.hover\:-translate-y-2 { transform: translateY(-0.5rem); }

/* Transition */
.transition-all { transition: all 0.3s ease; }
```

**Keyframes personnalisées** :
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-25%); }
}

.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.animate-bounce { animation: bounce 1s infinite; }
```

---

## 9. SEO et Meta Tags

### 9.1 Configuration globale (app.vue)

```typescript
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'fr'
  },
  titleTemplate: (title) =>
    title ? `${title} - ADUL21` : 'ADUL21 - Association de Défense des Usagers de la Ligne 21'
})

useSeoMeta({
  description: 'Association de défense des usagers de la ligne 21 Ledenon-Nîmes. Mobilisation pour rétablir la liaison directe.',
  ogTitle: 'ADUL21 - Rétablissons la ligne 21 directe vers Nîmes',
  ogDescription: 'Mobilisation pour défendre le droit à la mobilité des habitants de Ledenon, Cabrières et Saint-Gervasy.',
  twitterCard: 'summary_large_image'
})
```

---

### 9.2 Meta tags par page

**Exemple : Page d'accueil**
```typescript
useHead({
  title: 'Accueil',
  meta: [
    {
      name: 'description',
      content: 'ADUL21 - Association de défense des usagers de la ligne 21 Ledenon-Nîmes. Rétablissons la liaison directe...'
    },
    { property: 'og:title', content: 'ADUL21 - Rétablissons la ligne 21 directe vers Nîmes' },
    { property: 'og:description', content: 'Mobilisation pour défendre le droit à la mobilité...' },
    { property: 'og:type', content: 'website' }
  ]
})
```

**Exemple : Détail d'un témoignage**
```typescript
useHead({
  title: computed(() =>
    testimony.value ? `Témoignage de ${getDisplayName(testimony.value)}` : 'Témoignage'
  ),
  meta: computed(() => [
    {
      name: 'description',
      content: testimony.value
        ? testimony.value.testimony_text.substring(0, 160) + '...'
        : 'Découvrez les témoignages des habitants impactés...'
    }
  ])
})
```

---

## 10. Performance et optimisations

### 10.1 Lazy loading

**Composants** :
```vue
<!-- Lazy load des composants non critiques -->
<script setup>
const HomeLatestNews = defineAsyncComponent(() =>
  import('~/components/home/LatestNews.vue')
)
</script>
```

**Images** :
```vue
<!-- Native lazy loading -->
<img src="/logo.svg" alt="Logo" loading="lazy" />
```

---

### 10.2 Code splitting

Nuxt 3 effectue automatiquement le code splitting par :
- **Pages** : Chaque page est un chunk séparé
- **Layouts** : Layouts chargés à la demande
- **Composants async** : Avec defineAsyncComponent

---

### 10.3 Caching

**API calls** :
```typescript
// Cache avec key unique
const { data: stats, pending } = await useFetch('/api/admin/stats', {
  key: 'admin-stats'
})
```

**Static assets** :
- Images dans `/public/` servies directement
- Vite optimise les assets automatiquement

---

## 11. Accessibilité

### 11.1 Semantic HTML

```vue
<!-- Utilisation de balises sémantiques -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<section>...</section>
<article>...</article>
<footer>...</footer>
```

---

### 11.2 ARIA Labels

```vue
<!-- Labels pour les inputs -->
<label for="email" class="block text-sm font-medium">
  Email <span class="text-red-500">*</span>
</label>
<input
  id="email"
  v-model="form.email"
  type="email"
  required
  aria-required="true"
/>

<!-- Boutons avec aria-label si icône seule -->
<button aria-label="Fermer le menu" @click="mobileMenuOpen = false">
  <Icon name="heroicons:x-mark" class="w-6 h-6" />
</button>
```

---

### 11.3 Keyboard Navigation

Tous les éléments interactifs sont accessibles au clavier :
- Liens : `<NuxtLink>` natif
- Boutons : `<button>` avec `@click`
- Formulaires : tabindex natif

---

## 12. Bonnes pratiques

### 12.1 Composition API

Tout le projet utilise la **Composition API** avec `<script setup>` :

```vue
<script setup lang="ts">
// Imports
import type { Testimony } from '~/types/database.types'

// Props
interface Props {
  testimony: Testimony
}
const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  publish: [id: string]
  delete: [id: string]
}>()

// State
const loading = ref(false)

// Computed
const displayName = computed(() => {
  return props.testimony.first_name
})

// Methods
const handlePublish = () => {
  emit('publish', props.testimony.id)
}

// Lifecycle
onMounted(() => {
  console.log('Mounted')
})
</script>
```

---

### 12.2 TypeScript

Utilisation systématique de **TypeScript** pour :
- **Props** : `defineProps<Props>()`
- **Emits** : `defineEmits<{ event: [param: type] }>()`
- **Refs** : `ref<Type>(initialValue)`
- **API responses** : Interfaces importées depuis `~/types/`

---

### 12.3 Naming conventions

**Composants** :
- PascalCase : `AppHeader.vue`, `HeroBanner.vue`
- Préfixes : `App` (layout), `Home` (page d'accueil), `Ui` (réutilisables)

**Composables** :
- camelCase avec préfixe `use` : `useAuth`, `useTestimonies`

**Fichiers** :
- kebab-case pour les pages : `nouveau.vue`, `[id].vue`

**Variables** :
- camelCase : `testimonies`, `loading`, `submitError`

---

### 12.4 Organisation du code

**Structure d'un composant** :
```vue
<template>
  <!-- Template ici -->
</template>

<script setup lang="ts">
// 1. Imports
import type { Props } from '~/types'

// 2. Props & Emits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 3. State
const data = ref<Data>()
const loading = ref(false)

// 4. Computed
const computed = computed(() => {})

// 5. Methods
function method() {}

// 6. Lifecycle
onMounted(() => {})
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
```

---

## 13. Conclusion

Le frontend ADUL21 est une application **Vue.js/Nuxt 3** moderne, performante et accessible, avec :

- **Architecture modulaire** : Composants réutilisables, composables pour la logique
- **Expérience utilisateur optimale** : Formulaires multi-étapes, états de chargement, messages d'erreur contextuels
- **Interface d'administration complète** : Dashboard, gestion des témoignages, membres, newsletter
- **SEO optimisé** : Meta tags, Open Graph, structure sémantique
- **Design system cohérent** : Tailwind CSS, Nuxt UI, palette de couleurs définie
- **TypeScript** : Type safety sur tout le projet
- **Accessibilité** : Semantic HTML, ARIA labels, navigation clavier

**Points clés à retenir** :
1. Formulaires en 4 étapes pour témoignages et adhésions
2. Composables réutilisables pour la logique métier
3. Interface admin sécurisée avec middleware
4. Client API simplifié (useSupabase) pour les appels backend
5. Design responsive et animations fluides

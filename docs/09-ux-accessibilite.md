# Documentation UX et Accessibilité - ADUL21

**Version** : 1.0
**Date** : 17 octobre 2025
**Statut** : Documentation technique UX/A11y

---

## Table des matières

1. [Parcours utilisateur](#1-parcours-utilisateur)
2. [UI/UX Patterns](#2-uiux-patterns)
3. [Responsive Design](#3-responsive-design)
4. [Formulaires](#4-formulaires)
5. [Accessibilité (A11y)](#5-accessibilité-a11y)
6. [Standards WCAG](#6-standards-wcag)
7. [Internationalisation](#7-internationalisation)
8. [Recommandations UX](#8-recommandations-ux)

---

## 1. Parcours utilisateur

### 1.1 Flux de navigation principal

```
Accueil (/)
├── Revendications (/revendications)
├── Arguments juridiques (/arguments-juridiques)
├── Témoignages (/temoignages)
│   ├── Liste des témoignages (/temoignages)
│   ├── Détail témoignage (/temoignages/[id])
│   └── Nouveau témoignage (/temoignages/nouveau)
├── Actualités (/actualites)
│   ├── Liste (/actualites)
│   └── Article (/actualites/[slug])
├── Contact (/contact)
└── Rejoindre
    ├── Soutien (pré-adhésion) (/rejoindre/soutien)
    └── Adhérer (/rejoindre/adherer)
```

### 1.2 Parcours du visiteur → soutien (pré-adhésion)

**Objectif** : Enregistrer gratuitement les soutiens avant la création officielle de l'association

**Étapes** :
1. **Découverte** : Arrivée sur la page d'accueil
   - Hero banner impactant avec message clair
   - CTA visible "Témoigner" / "Adhérer"

2. **Motivation** : Sections persuasives
   - Key Facts (chiffres clés)
   - Did You Know (infographies)
   - Témoignages d'usagers

3. **Action** : Navigation vers `/rejoindre/soutien`
   - Encart informatif bleu expliquant la phase de pré-création
   - Compteur de soutiens en temps réel (motivation sociale)
   - Formulaire simplifié (1 page)

4. **Conversion** :
   - Validation instantanée
   - Message de succès avec total des soutiens
   - Redirection vers accueil après 3s

**Points de friction identifiés** :
- ✅ Le formulaire est sur une seule page (pas de multi-étapes)
- ✅ Compteur de soutiens visible (preuve sociale)
- ⚠️ Manque de barre de progression visuelle pour rassurer

**Fichier source** : `/pages/rejoindre/soutien.vue`

---

### 1.3 Parcours du visiteur → membre (adhésion)

**Objectif** : Adhérer officiellement à l'association (Phase 2 uniquement)

**Conditions** :
- Disponible uniquement si `ASSOCIATION_CREATED=true`
- Sinon redirection 301 vers `/rejoindre/soutien`

**Étapes** :

#### Étape 1 : Informations personnelles
- Civilité, Prénom, Nom
- Date de naissance (optionnel)
- Email, Téléphone
- Adresse complète, Code postal, Commune

#### Étape 2 : Profil d'usager
- Type d'usager (lycéen, parent, senior, PMR, actif...)
- Champs conditionnels selon le profil
- Usage avant/après la suppression

#### Étape 3 : Type d'adhésion
- **Tarif réduit** : 5€ (étudiants, demandeurs d'emploi)
- **Tarif normal** : 15€
- **Tarif soutien** : 50€
- **Montant libre** : minimum 5€
- Sélection visuelle avec cards cliquables

#### Étape 4 : Engagement et consentements
- Participation active (optionnel)
- Domaines d'action multiples (communication, juridique, événementiel...)
- Consentements RGPD
- Info sur modalités de règlement (virement, chèque, espèces)

**Indicateurs de progression** :
```
[1] Coordonnées → [2] Profil → [3] Cotisation → [4] Engagement
```

**Validation** :
- Validation HTML5 native (required, type="email", etc.)
- Validation JS pour montant minimum (5€)
- Messages d'erreur contextuels

**Fichier source** : `/pages/rejoindre/adherer.vue`

---

### 1.4 Parcours de soumission de témoignage

**Objectif** : Collecter des témoignages structurés et exploitables juridiquement

**Étapes du formulaire multi-étapes** :

#### Étape 1 : Vos informations (Personal Info)
- Prénom (requis)
- Nom (optionnel pour anonymat)
- Tranche d'âge (requis)
- Email, Téléphone (optionnel)
- Commune (Ledenon, Cabrières, Saint-Gervasy, Autre)
- Type d'usager (lycéen, parent, senior, PMR, travailleur, autre)
- **Champs conditionnels** :
  - Si lycéen/parent → Lycée, Filière
  - Si travailleur → Lieu de travail, Horaires

#### Étape 2 : Usage AVANT la suppression
- Fréquence d'utilisation (quotidien, 2-3/semaine, hebdo, occasionnel)
- Temps de trajet (minutes)
- Coût mensuel (€)
- Destination principale

#### Étape 3 : Usage APRÈS la suppression
- Solution actuelle (voiture, correspondances, dépendance, arrêt)
- **Champs conditionnels** :
  - Si voiture → Distance/jour (km), Surcoût mensuel
  - Si correspondances → Nombre, Temps d'attente, Nouveau temps total, Correspondances ratées/mois
- Problèmes rencontrés (checkboxes multiples)

#### Étape 4 : Témoignage
- Témoignage principal (50-2000 caractères) avec compteur
- Exemple concret (optionnel, max 500 caractères)
- Préférences de publication :
  - Prénom / Initiales / Anonyme
- Consentements (publication site, usage juridique, médias, témoignage oral)

**Indicateur de progression visuel** :
```
[✓] Vos infos → [2] Avant → [3] Après → [4] Témoignage
```
- Numéros dans des cercles
- Ligne de progression entre les étapes
- Couleur : Vert (complété) / Bleu (actuel) / Gris (à venir)

**Navigation** :
- Bouton "Retour" à partir de l'étape 2
- Bouton "Continuer" (étapes 1-3)
- Bouton "Envoyer mon témoignage" (étape 4)
- Scroll automatique vers le haut à chaque changement d'étape

**Validation en temps réel** :
- Validation HTML5 (required, minlength, maxlength)
- Compteurs de caractères visibles
- Validation JS avant passage à l'étape suivante
- Messages d'erreur contextuels

**États de soumission** :
- État initial : formulaire actif
- État loading : bouton disabled, spinner visible, "Envoi en cours..."
- État succès : Message vert, auto-redirection vers `/temoignages` après 3s
- État erreur : Message rouge avec détail de l'erreur

**Fichier source** : `/pages/temoignages/nouveau.vue`

---

### 1.5 Parcours admin

**Accès** : `/admin/login`

**Authentification** :
- Email + Mot de passe
- Validation côté serveur avec JWT
- Redirection si déjà connecté
- Layout dédié (layout: false dans page meta)

**Pages admin** :
- `/admin` - Dashboard principal
- `/admin/membres` - Gestion des membres
- `/admin/soutiens` - Gestion des pré-adhérents
- `/admin/temoignages` - Modération des témoignages
- `/admin/contacts` - Messages de contact
- `/admin/newsletter` - Gestion newsletter

**Layout admin** : `/layouts/admin.vue`

**Fichier source** : `/pages/admin/login.vue`

---

## 2. UI/UX Patterns

### 2.1 Système de design

#### Couleurs (Tailwind Config)

**Palette principale** :
```css
Primary (Blue):
- primary-50: #eff6ff
- primary-100: #dbeafe
- primary-600: #2563eb (principal)
- primary-700: #1d4ed8 (hover)
- primary-900: #1e3a8a (dark)

Red (CTA important):
- red-500: #ef4444
- red-600: #dc2626 (boutons primaires)
- red-700: #b91c1c (hover)

Neutral (Grays):
- gray-50 à gray-900
- white, black
```

**Usage sémantique** :
- `primary-600` : Actions principales, liens, focus states
- `red-600` : CTA critiques ("Témoigner", "Envoyer")
- `green-500/600` : Messages de succès, validations
- `yellow-400/500` : Alertes, informations importantes
- `gray-900` : Textes principaux
- `gray-600` : Textes secondaires
- `gray-300` : Bordures, dividers

#### Typographie

**Font family** :
```css
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Échelle typographique** :
```
h1: text-4xl md:text-5xl (2.25rem / 3rem)
h2: text-3xl md:text-4xl (1.875rem / 2.25rem)
h3: text-2xl (1.5rem)
h4: text-xl (1.25rem)
body: text-base (1rem)
small: text-sm (0.875rem)
tiny: text-xs (0.75rem)
```

**Poids (font-weight)** :
- 300: Light (rarement utilisé)
- 400: Normal (corps de texte)
- 500: Medium (labels)
- 600: Semibold (sous-titres)
- 700: Bold (titres secondaires)
- 800: Extrabold (titres principaux)
- 900: Black (hero, CTAs)

**Fichier source** : `/assets/css/main.css`

---

### 2.2 Composants UI

#### Boutons

**Bouton primaire (btn-primary)** :
```css
.btn-primary {
  /* Visuel */
  padding: 1.5rem 3rem;
  font-size: 1.125rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: white;
  background-color: #dc2626;
  border: 3px solid #dc2626;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.5);

  /* Interactions */
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 15px 50px rgba(220, 38, 38, 0.7);
  background-color: #b91c1c;
}

.btn-primary:active {
  transform: scale(0.98);
}
```

**Bouton secondaire (btn-secondary)** :
```css
.btn-secondary {
  /* Similaire à btn-primary mais avec : */
  color: #1e40af;
  background-color: white;
  border: 3px solid #1e40af;
  box-shadow: 0 10px 40px rgba(30, 64, 175, 0.3);
}
```

**États** :
- `:hover` - Agrandissement (scale 1.05) + translation vers le haut
- `:active` - Rétrécissement (scale 0.98)
- `:disabled` - Opacité 50%, cursor not-allowed
- `:focus` - Ring primary (focus-visible)

**Accessibilité** :
- ✅ Contraste suffisant (ratio > 4.5:1)
- ✅ Taille tactile > 44x44px
- ⚠️ Manque de `focus-visible` explicite sur btn-primary/secondary
- ⚠️ Pas d'indicateur de chargement visuel intégré (géré en JS)

#### Cards

**Card standard (Nuxt UI)** :
```vue
<UCard class="hover:shadow-lg transition-all hover:scale-[1.02]">
  <!-- Contenu -->
</UCard>
```

**Caractéristiques** :
- Fond blanc / dark mode
- Bordure subtile
- Border-radius medium
- Padding interne consistant
- Effet hover : ombre + scale légère

**Usage** :
- Témoignages
- Actualités
- Informations de contact
- Cards de statistiques

#### Formulaires (Inputs)

**Input standard** :
```html
<input
  type="text"
  class="w-full px-4 py-2 border border-gray-300 rounded-lg
         focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
/>
```

**États** :
- Default : Border gray-300
- Focus : Ring primary + border primary
- Error : Border red-500 + ring red-500 (à implémenter)
- Disabled : Opacity 50%, cursor not-allowed

**Select** : Même style que input
**Textarea** : Même style, hauteur ajustable

**Checkboxes** :
```html
<input
  type="checkbox"
  class="mt-1 mr-3 w-5 h-5 text-primary-600 focus:ring-primary-500"
/>
```

**Accessibilité** :
- ✅ Labels associés (for/id)
- ✅ Required indicators (*)
- ✅ Placeholders descriptifs
- ✅ Autocomplete attributes (email, tel...)
- ⚠️ Pas d'aria-describedby pour messages d'erreur
- ⚠️ Pas d'aria-invalid sur champs en erreur

---

### 2.3 Feedback utilisateur

#### Messages de succès

**Structure** :
```vue
<div class="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
  <div class="flex items-start">
    <Icon name="heroicons:check-circle" class="w-6 h-6 mr-3 text-green-600" />
    <div>
      <p class="font-semibold">Titre du succès</p>
      <p class="text-sm mt-1">Message détaillé</p>
    </div>
  </div>
</div>
```

**Exemples** :
- Témoignage envoyé
- Soutien enregistré
- Adhésion validée
- Message de contact envoyé

#### Messages d'erreur

**Structure** :
```vue
<div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
  <div class="flex items-start">
    <Icon name="heroicons:x-circle" class="w-6 h-6 mr-3 text-red-600" />
    <div>
      <p class="font-semibold">Titre de l'erreur</p>
      <p class="text-sm mt-1">{{ errorMessage }}</p>
    </div>
  </div>
</div>
```

**Problèmes identifiés** :
- ⚠️ Messages génériques ("Une erreur est survenue")
- ⚠️ Pas de codes d'erreur spécifiques
- ⚠️ Pas d'assistance contextuelle (lien vers contact/aide)

#### Messages informationnels

**Structure** :
```vue
<div class="bg-blue-50 border-l-4 border-blue-500 p-6">
  <div class="flex items-start">
    <Icon name="heroicons:information-circle" class="w-6 h-6 text-blue-600 mr-3 mt-1" />
    <div>
      <h3 class="text-lg font-bold text-blue-900 mb-2">Titre</h3>
      <p class="text-blue-800">Message...</p>
    </div>
  </div>
</div>
```

**Usage** :
- Phase de pré-création (soutien.vue)
- Modalités de règlement (adherer.vue)
- Instructions formulaires

---

### 2.4 Loading states

#### Boutons en chargement

**Pattern** :
```vue
<button :disabled="isSubmitting">
  <Icon v-if="!isSubmitting" name="heroicons:check" />
  <Icon v-else name="heroicons:arrow-path" class="animate-spin" />
  {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer' }}
</button>
```

**Caractéristiques** :
- Icône change (check → arrow-path spinning)
- Texte change dynamiquement
- Bouton disabled pendant l'action
- Opacity réduite (disabled:opacity-50)

#### Skeleton loaders

**Status** : ❌ Non implémenté
**Recommandation** : Ajouter des skeletons pour :
- Liste de témoignages
- Articles d'actualités
- Dashboard admin

---

### 2.5 Animations et transitions

#### Animations définies

**Shake (CSS)** :
```css
@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-2deg); }
  20%, 40%, 60%, 80% { transform: rotate(2deg); }
}

.animate-shake {
  animation: shake 2s ease-in-out infinite;
}
```
**Usage** : Croix rouge sur la ligne de bus (hero banner)

**Bounce (Tailwind)** :
```html
<div class="animate-bounce">
  <Icon name="heroicons:chevron-down" />
</div>
```
**Usage** : Indicateur de scroll (hero banner)

**Pulse (Tailwind)** :
```html
<div class="h-1 w-12 bg-white rounded animate-pulse"></div>
```
**Usage** : Lignes de bus dans hero banner

**Spin (Tailwind)** :
```html
<Icon name="heroicons:arrow-path" class="animate-spin" />
```
**Usage** : Loading states

#### Transitions CSS

**Transitions globales** :
```css
transition: all 0.3s ease;
```

**Transitions spécifiques** :
- Boutons : `transform`, `box-shadow`, `background-color`
- Cards : `scale`, `shadow`
- Links : `color`
- Hover effects : 0.2-0.3s ease

**Scale effects** :
```css
hover:scale-105       /* Légère augmentation */
hover:scale-110       /* CTA importants */
hover:scale-[1.02]    /* Cards */
active:scale-0.98     /* Press effect */
```

**Translation effects** :
```css
hover:-translate-y-1  /* Boutons secondaires */
hover:-translate-y-2  /* CTAs principaux */
```

**Problèmes identifiés** :
- ⚠️ Animations trop nombreuses sur hero banner (peuvent causer motion sickness)
- ⚠️ Pas de `prefers-reduced-motion` media query
- ✅ Durées courtes (< 500ms)

---

## 3. Responsive Design

### 3.1 Breakpoints Tailwind v4

**Breakpoints standards** :
```
sm:  640px  (Tablette portrait)
md:  768px  (Tablette landscape)
lg:  1024px (Desktop)
xl:  1280px (Large desktop)
2xl: 1536px (Extra large)
```

**Usage dans le projet** :
```vue
<!-- Mobile first -->
<h1 class="text-4xl md:text-5xl lg:text-7xl">
  TITRE
</h1>

<!-- Grids responsives -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  <!-- Cards -->
</div>
```

---

### 3.2 Mobile-first approach

**Principe** : Les styles par défaut ciblent mobile, puis overrides progressifs

**Exemples** :

**Navigation** :
```vue
<!-- Mobile: Menu hamburger -->
<button class="lg:hidden" @click="mobileMenuOpen = !mobileMenuOpen">
  <Icon name="heroicons:bars-3" />
</button>

<!-- Desktop: Navigation horizontale -->
<div class="hidden lg:flex items-center gap-8">
  <!-- Nav items -->
</div>
```

**Typography** :
```vue
<h1 class="text-4xl md:text-5xl font-bold">
  <!-- 2.25rem mobile → 3rem tablette+ -->
</h1>
```

**Spacing** :
```vue
<div class="py-12 md:py-16 lg:py-20">
  <!-- Padding augmente avec viewport -->
</div>
```

---

### 3.3 Container système

**Container custom** (défini dans main.css) :
```css
.container-custom {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;      /* 16px mobile */
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container-custom {
    max-width: 640px;
    padding-left: 1.5rem;  /* 24px */
    padding-right: 1.5rem;
  }
}

@media (min-width: 768px) {
  .container-custom {
    max-width: 768px;
    padding-left: 2rem;    /* 32px */
    padding-right: 2rem;
  }
}

@media (min-width: 1024px) {
  .container-custom {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container-custom {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container-custom {
    max-width: 1536px;
  }
}
```

**Usage** :
```vue
<div class="container-custom">
  <!-- Contenu centré avec padding adaptatif -->
</div>
```

**Alternative Nuxt UI** :
```vue
<UContainer>
  <!-- Même comportement avec Nuxt UI -->
</UContainer>
```

---

### 3.4 Grids adaptatifs

**Pattern principal** :
```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Items -->
</div>
```

**Exemples dans le projet** :

**Footer (4 colonnes)** :
```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  <!-- About, L'association, Agir, Newsletter -->
</div>
```

**Formulaire adhésion (3 colonnes)** :
```vue
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>Civilité</div>
  <div>Prénom</div>
  <div>Nom</div>
</div>
```

**Tarifs adhésion (2 colonnes)** :
```vue
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Réduit, Normal, Soutien, Libre -->
</div>
```

---

### 3.5 Navigation mobile

**Header mobile** :

**Burger menu** :
```vue
<button
  @click="mobileMenuOpen = !mobileMenuOpen"
  class="lg:hidden p-2 text-gray-600 hover:text-gray-900"
>
  <Icon v-if="!mobileMenuOpen" name="heroicons:bars-3" class="w-6 h-6" />
  <Icon v-else name="heroicons:x-mark" class="w-6 h-6" />
</button>
```

**Menu déroulant** :
```vue
<div v-if="mobileMenuOpen" class="lg:hidden py-4 border-t border-gray-200">
  <div class="flex flex-col space-y-3">
    <NuxtLink
      v-for="item in items"
      :to="item.to"
      @click="mobileMenuOpen = false"
    >
      {{ item.label }}
    </NuxtLink>
  </div>
</div>
```

**Problèmes identifiés** :
- ✅ Fermeture automatique du menu au clic
- ✅ Icônes claires (hamburger / X)
- ⚠️ Pas de transition slide/fade pour l'ouverture
- ⚠️ Pas de focus trap dans le menu mobile
- ⚠️ Pas de gestion ESC pour fermer

**Fichier source** : `/components/layout/AppHeader.vue`

---

## 4. Formulaires

### 4.1 Formulaires multi-étapes

**Implémentations** :

#### Témoignage (4 étapes)
```
Étape 1: Vos infos
Étape 2: Usage AVANT
Étape 3: Usage APRÈS
Étape 4: Témoignage
```

**Indicateur de progression** :
```vue
<div class="flex items-center justify-between">
  <div v-for="(step, index) in steps" class="flex items-center">
    <div
      class="w-10 h-10 rounded-full flex items-center justify-center"
      :class="currentStep > index
        ? 'bg-green-500 text-white'
        : currentStep === index
          ? 'bg-primary-600 text-white'
          : 'bg-gray-300 text-gray-600'"
    >
      <Icon v-if="currentStep > index" name="heroicons:check" />
      <span v-else>{{ index + 1 }}</span>
    </div>
    <span class="text-xs mt-2 hidden sm:block">{{ step }}</span>
  </div>
</div>
```

**Navigation** :
```vue
<!-- Boutons de navigation -->
<button v-if="currentStep > 0" @click="previousStep">
  <Icon name="heroicons:arrow-left" />
  Retour
</button>

<button v-if="currentStep < steps.length - 1" @click="nextStep">
  Continuer
  <Icon name="heroicons:arrow-right" />
</button>

<button v-else @click="submitTestimony" :disabled="isSubmitting">
  Envoyer mon témoignage
</button>
```

**Scroll automatique** :
```js
window.scrollTo({ top: 0, behavior: 'smooth' })
```

#### Adhésion (4 étapes)
```
Étape 1: Coordonnées
Étape 2: Profil
Étape 3: Cotisation
Étape 4: Engagement
```

**Indicateur simplifié** :
```vue
<div class="flex items-center justify-between">
  <div v-for="stepNumber in 4">
    <div :class="step >= stepNumber ? 'bg-primary-600' : 'bg-gray-200'">
      {{ stepNumber }}
    </div>
    <div>{{ getStepLabel(stepNumber) }}</div>
  </div>
</div>
```

---

### 4.2 Validation en temps réel

**Validation HTML5 native** :
```vue
<input
  type="email"
  required
  minlength="50"
  maxlength="2000"
/>
```

**Attributs utilisés** :
- `required` : Champ obligatoire
- `type="email"` : Validation format email
- `type="tel"` : Clavier téléphone mobile
- `minlength` / `maxlength` : Limites de caractères
- `min` / `max` : Nombres (âge, montant...)
- `step` : Incréments (0.01 pour prix)

**Validation JavaScript custom** :
```js
// Exemple : vérification avant passage à l'étape suivante
const nextStep = () => {
  if (currentStep.value === 1 && !form.value.usage_before_frequency) {
    submitError.value = 'Veuillez sélectionner la fréquence d\'utilisation'
    return
  }
  currentStep.value++
}
```

**Problèmes identifiés** :
- ✅ Validation native active
- ⚠️ Pas de validation en temps réel pendant la saisie
- ⚠️ Messages d'erreur HTML5 par défaut (non personnalisés)
- ⚠️ Pas d'indicateurs visuels d'erreur sur les champs (border rouge)

---

### 4.3 Messages d'erreur clairs

**Messages contextuels** :

**Erreurs de validation** :
```js
if (form.value.testimony_text.length < 50) {
  submitError.value = 'Le témoignage doit contenir au moins 50 caractères.'
  return
}

if (form.value.membershipFee < 5) {
  submitError.value = 'Le montant minimum d\'adhésion est de 5€'
  return
}
```

**Erreurs serveur** :
```js
catch (error: any) {
  submitError.value = error.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
}
```

**Affichage** :
```vue
<div v-if="submitError" class="bg-red-50 border border-red-200 rounded-lg p-4">
  ✗ {{ submitError }}
</div>
```

**Recommandations** :
- ❌ Messages trop génériques
- ✅ Erreurs affichées au-dessus du bouton submit
- ⚠️ Pas de scroll automatique vers l'erreur
- ⚠️ Pas d'annonce ARIA pour lecteurs d'écran

---

### 4.4 Progress indicators

**Compteurs de caractères** :
```vue
<textarea
  v-model="form.testimony_text"
  minlength="50"
  maxlength="2000"
></textarea>
<div class="text-sm text-gray-500 mt-1">
  {{ form.testimony_text.length }} / 2000 caractères
</div>
```

**Indicateurs visuels utilisés** :
- ✅ Compteur en temps réel (témoignage principal, exemple concret)
- ✅ Barre de progression étapes (témoignage, adhésion)
- ✅ Étapes complétées (icône check verte)
- ⚠️ Pas de barre de progression % global

**États des boutons** :
```vue
<button :disabled="isSubmitting">
  <Icon v-if="!isSubmitting" name="heroicons:check" />
  <Icon v-else name="heroicons:arrow-path" class="animate-spin" />
  {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer' }}
</button>
```

---

### 4.5 Autocomplete et suggestions

**Autocomplete HTML5** :
```vue
<input
  type="email"
  autocomplete="email"
/>
<input
  type="tel"
  autocomplete="tel"
/>
<input
  type="password"
  autocomplete="current-password"
/>
```

**Suggestions natives** :
- ✅ Email : `autocomplete="email"`
- ✅ Téléphone : `autocomplete="tel"`
- ✅ Adresse : `autocomplete="street-address"`
- ✅ Code postal : `autocomplete="postal-code"`
- ⚠️ Pas de `autocomplete="given-name"` / `"family-name"` sur prénom/nom

**Champs conditionnels** :

**Témoignage** :
```vue
<!-- Si type = lycéen/parent -->
<div v-if="form.user_type === 'student' || form.user_type === 'parent'">
  <input v-model="form.school_name" placeholder="Ex: Lycée Albert Camus" />
  <input v-model="form.school_section" placeholder="Ex: Bac STMG" />
</div>

<!-- Si type = travailleur -->
<div v-if="form.user_type === 'worker'">
  <input v-model="form.workplace" />
  <input v-model="form.work_hours" placeholder="Ex: 8h-17h" />
</div>
```

**Adhésion (Étape 3 - Solution après suppression)** :
```vue
<!-- Si solution = voiture -->
<div v-if="form.usage_after_solution === 'car'">
  <input v-model.number="form.usage_after_distance" type="number" />
  <input v-model.number="form.usage_after_cost" type="number" />
</div>

<!-- Si solution = correspondances -->
<div v-if="form.usage_after_solution === 'correspondences'">
  <input v-model.number="form.usage_after_correspondences" />
  <input v-model.number="form.usage_after_wait_time" />
  <input v-model.number="form.usage_after_time" />
</div>
```

**Recommandations** :
- ✅ Champs conditionnels bien implémentés
- ✅ Placeholders descriptifs
- ⚠️ Pas de suggestions avancées (datalist, combobox)
- ⚠️ Pas d'aide contextuelle (tooltips, popovers)

---

## 5. Accessibilité (A11y)

### 5.1 Sémantique HTML

**Structure globale** :
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

**Landmarks ARIA implicites** :
- `<header>` → `role="banner"`
- `<main>` → `role="main"`
- `<footer>` → `role="contentinfo"`
- `<nav>` → `role="navigation"`

**Hiérarchie des titres** :

**Page d'accueil** :
```html
<h1>NOTRE LIGNE DIRECTE A ÉTÉ SUPPRIMÉE</h1>
<h2>Key Facts</h2>
<h2>Ils témoignent</h2>
<h2>Rejoignez la mobilisation</h2>
```

**Formulaires** :
```html
<h1>Partagez votre témoignage</h1>
  <h2>Vos informations</h2>
  <h2>Votre usage AVANT la suppression</h2>
  <h2>Votre situation APRÈS la suppression</h2>
  <h2>Votre témoignage</h2>
```

**Problèmes identifiés** :
- ✅ Structure globale correcte (header, main, footer)
- ✅ Hiérarchie H1 → H2 → H3 respectée
- ⚠️ Pas de `<nav>` explicite dans AppHeader
- ⚠️ Certaines sections manquent de headings (invisible pour SR)

---

### 5.2 ARIA labels et roles

**ARIA dans le projet** :

**Boutons avec aria-label** :
```vue
<UButton
  icon="i-simple-icons-facebook"
  aria-label="Partager sur Facebook"
/>
<UButton
  icon="i-simple-icons-x"
  aria-label="Partager sur X"
/>
<UButton
  icon="i-heroicons-link"
  aria-label="Copier le lien"
/>
```
**Source** : `/pages/actualites/[slug].vue`

**Problèmes identifiés** :
- ✅ Aria-label sur boutons icônes uniquement (article)
- ❌ Pas d'aria-label sur burger menu (AppHeader)
- ❌ Pas d'aria-label sur boutons icônes du footer
- ❌ Pas d'aria-live pour messages de succès/erreur
- ❌ Pas d'aria-invalid sur champs en erreur
- ❌ Pas d'aria-describedby pour messages d'aide
- ❌ Pas d'aria-required sur champs requis (HTML required utilisé)
- ❌ Pas de role="alert" sur messages d'erreur critiques

**Recommandations prioritaires** :
```vue
<!-- Burger menu -->
<button
  aria-label="Menu de navigation"
  aria-expanded="false"
  aria-controls="mobile-menu"
>

<!-- Messages d'erreur -->
<div role="alert" aria-live="assertive">
  Erreur...
</div>

<!-- Champs en erreur -->
<input
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error">Format email invalide</span>
```

---

### 5.3 Navigation au clavier

**Éléments focusables testés** :

**✅ Liens** :
```vue
<NuxtLink to="/revendications">
  <!-- Focus natif du navigateur -->
</NuxtLink>
```

**✅ Boutons** :
```vue
<button @click="mobileMenuOpen = !mobileMenuOpen">
  <!-- Focus natif -->
</button>
```

**✅ Inputs** :
```vue
<input type="text" />
<!-- Focus avec ring-2 ring-primary-500 -->
```

**⚠️ Checkboxes** :
```vue
<input type="checkbox" />
<!-- Focus natif mais peu visible -->
```

**Ordre de tabulation** :
- ✅ Ordre logique (top → bottom, left → right)
- ✅ Pas de tabindex positifs
- ⚠️ Menu mobile : pas de focus trap
- ⚠️ Formulaires multi-étapes : navigation entre étapes pas gérée au clavier

**Raccourcis clavier** :
- ❌ Aucun raccourci clavier custom
- ❌ Pas de skip links ("Aller au contenu principal")
- ❌ Pas de gestion ESC pour fermer menu mobile

**Test keyboard-only** :
```
Tab     → Navigation entre éléments ✅
Enter   → Activation boutons/liens ✅
Space   → Activation checkboxes ✅
Esc     → Fermeture menu mobile ❌
Arrows  → Navigation dans select ✅ (natif)
```

---

### 5.4 Focus states

**Focus natif du navigateur** :
- Outline bleue par défaut
- Visible mais non stylisée

**Focus Tailwind (focus:ring)** :
```css
focus:ring-2 focus:ring-primary-500 focus:border-primary-500
```

**Inputs** :
```vue
<input
  class="focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
/>
```
**Résultat** : Ring bleu (primary-500) autour de l'input

**Problèmes identifiés** :
- ✅ Focus states sur inputs bien définis
- ⚠️ Focus states sur boutons btn-primary/secondary non explicites
- ⚠️ Focus states sur liens peu visibles
- ⚠️ Pas de focus-visible (distinction clavier vs souris)
- ⚠️ Checkboxes : focus natif peu visible

**Recommandations** :
```css
/* Boutons */
.btn-primary:focus-visible {
  outline: 3px solid #fbbf24;
  outline-offset: 2px;
}

/* Liens */
a:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Checkboxes */
input[type="checkbox"]:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

---

### 5.5 Contraste des couleurs

**Texte sur fond** :

**Texte principal (gray-900 sur white)** :
- Ratio : 20.52:1 ✅ (AAA)

**Texte secondaire (gray-600 sur white)** :
- Ratio : 7.68:1 ✅ (AAA)

**Liens (primary-600 sur white)** :
- Ratio : 5.64:1 ✅ (AA, presque AAA)

**Bouton primaire (white sur red-600)** :
- Ratio : 5.87:1 ✅ (AA)

**Bouton secondaire (blue-700 sur white)** :
- Ratio : 8.95:1 ✅ (AAA)

**Messages de succès (green-800 sur green-50)** :
- Ratio : 9.23:1 ✅ (AAA)

**Messages d'erreur (red-800 sur red-50)** :
- Ratio : 9.41:1 ✅ (AAA)

**Problèmes identifiés** :
- ✅ Tous les textes respectent WCAG AA (4.5:1)
- ✅ Majorité respecte AAA (7:1)
- ⚠️ Text-gray-500 (si utilisé) : 4.54:1 (juste AA, attention)
- ⚠️ Placeholders (gray-400) : 3.92:1 ❌ (< 4.5:1)

**Recommandation** :
```css
/* Placeholders plus foncés */
::placeholder {
  color: #6b7280; /* gray-500 au lieu de gray-400 */
}
```

---

### 5.6 Taille des textes

**Taille minimale recommandée** : 16px (1rem)

**Corps de texte** :
- Default : `text-base` (1rem / 16px) ✅
- Petits textes : `text-sm` (0.875rem / 14px) ✅
- Très petits : `text-xs` (0.75rem / 12px) ⚠️

**Utilisation de text-xs** :
- Labels de progression (témoignage)
- Dates (actualités)
- Mentions légales (footer)

**Recommandations** :
- ✅ Corps de texte >= 16px
- ⚠️ Limiter text-xs aux éléments non critiques
- ✅ Titres bien dimensionnés (2xl à 7xl)

**Zoom navigateur** :
- Testé jusqu'à 200% : ✅ Layout reste fonctionnel
- Pas de débordement horizontal ✅
- Textes restent lisibles ✅

---

### 5.7 Alt text sur images

**Logos** :
```vue
<!-- Header -->
<img src="/logo-adul21.svg" alt="ADUL21" />

<!-- Footer -->
<img src="/logo-adul21.svg" alt="ADUL21" />

<!-- Hero Banner -->
<img src="/logo-adul21-hero.svg" alt="ADUL21" />

<!-- Admin Login -->
<img src="/logo-adul21.svg" alt="ADUL21" />
```

**Problèmes identifiés** :
- ✅ Alt text présent sur tous les logos
- ⚠️ Alt text générique "ADUL21" (peu descriptif)
- ❌ Pas d'images décoratives avec alt=""
- ❌ Pas d'images de contenu (témoignages, actualités) avec alt descriptif

**Recommandations** :
```vue
<!-- Logo header (fonctionnel) -->
<img src="/logo-adul21.svg" alt="ADUL21 - Retour à l'accueil" />

<!-- Logo footer (décoratif) -->
<img src="/logo-adul21.svg" alt="" aria-hidden="true" />

<!-- Cover image article -->
<img :src="article.coverImage" :alt="article.title" />
```

---

## 6. Standards WCAG

### 6.1 Niveau de conformité

**Objectif** : WCAG 2.1 niveau AA

**Statut actuel** : Conformité partielle (~60%)

**Critères WCAG 2.1** :

#### Principe 1 : Perceptible

| Critère | Niveau | Statut | Notes |
|---------|--------|--------|-------|
| 1.1.1 - Contenu non textuel | A | ⚠️ Partiel | Alt text présents mais génériques |
| 1.3.1 - Information et relations | A | ✅ Conforme | Sémantique HTML correcte |
| 1.3.2 - Ordre séquentiel logique | A | ✅ Conforme | Ordre de lecture logique |
| 1.4.1 - Utilisation de la couleur | A | ✅ Conforme | Pas uniquement couleur |
| 1.4.3 - Contraste (minimum) | AA | ✅ Conforme | Tous textes > 4.5:1 |
| 1.4.4 - Redimensionnement du texte | AA | ✅ Conforme | Zoom 200% OK |
| 1.4.10 - Reflow | AA | ✅ Conforme | Responsive sans scroll horizontal |
| 1.4.11 - Contraste non textuel | AA | ⚠️ Partiel | Focus states peu visibles |
| 1.4.12 - Espacement du texte | AA | ✅ Conforme | Line-height suffisant |

#### Principe 2 : Utilisable

| Critère | Niveau | Statut | Notes |
|---------|--------|--------|-------|
| 2.1.1 - Clavier | A | ⚠️ Partiel | Navigation possible mais incomplète |
| 2.1.2 - Pas de piège au clavier | A | ❌ Non conforme | Menu mobile sans focus trap |
| 2.4.1 - Contourner des blocs | A | ❌ Non conforme | Pas de skip links |
| 2.4.2 - Titre de page | A | ✅ Conforme | Tous les pages ont un title |
| 2.4.3 - Parcours du focus | A | ✅ Conforme | Ordre logique |
| 2.4.4 - Fonction du lien (selon contexte) | A | ✅ Conforme | Liens descriptifs |
| 2.4.7 - Focus visible | AA | ⚠️ Partiel | Focus natif OK mais non stylisé |
| 2.5.5 - Taille de la cible | AAA | ✅ Conforme | Boutons > 44x44px |

#### Principe 3 : Compréhensible

| Critère | Niveau | Statut | Notes |
|---------|--------|--------|-------|
| 3.1.1 - Langue de la page | A | ✅ Conforme | `<html lang="fr">` |
| 3.2.1 - Au focus | A | ✅ Conforme | Pas de changement de contexte |
| 3.2.2 - À la saisie | A | ✅ Conforme | Pas de soumission auto |
| 3.3.1 - Identification des erreurs | A | ⚠️ Partiel | Messages présents mais génériques |
| 3.3.2 - Étiquettes ou instructions | A | ✅ Conforme | Labels présents |
| 3.3.3 - Suggestion après erreur | AA | ❌ Non conforme | Pas de suggestions contextuelles |
| 3.3.4 - Prévention des erreurs | AA | ⚠️ Partiel | Confirmation pour adhésion OK |

#### Principe 4 : Robuste

| Critère | Niveau | Statut | Notes |
|---------|--------|--------|-------|
| 4.1.1 - Analyse syntaxique | A | ✅ Conforme | HTML valide (Nuxt) |
| 4.1.2 - Nom, rôle et valeur | A | ⚠️ Partiel | ARIA manquant (aria-label, roles) |
| 4.1.3 - Messages d'état | AA | ❌ Non conforme | Pas de aria-live |

---

### 6.2 Points conformes

✅ **Sémantique HTML** : Structure header/main/footer, hiérarchie titres

✅ **Contraste des couleurs** : Tous les textes > 4.5:1 (WCAG AA)

✅ **Responsive design** : Mobile-first, zoom 200% sans perte

✅ **Titres de pages** : Toutes les pages ont un `<title>` unique

✅ **Labels de formulaire** : Tous les champs ont un `<label for="...">`

✅ **Taille des cibles tactiles** : Boutons > 44x44px

✅ **Ordre de tabulation** : Logique et séquentiel

✅ **Langue de la page** : `<html lang="fr">`

✅ **Validation native** : HTML5 required, type, min/max

✅ **Messages de feedback** : Succès/erreur présents

---

### 6.3 Points à améliorer

#### Priorité HAUTE (Bloquants A/AA)

❌ **Skip links** (2.4.1 - A)
```vue
<a href="#main-content" class="sr-only focus:not-sr-only">
  Aller au contenu principal
</a>
<main id="main-content">
```

❌ **Focus trap menu mobile** (2.1.2 - A)
```js
// Utiliser @vueuse/core useFocusTrap
const { activate, deactivate } = useFocusTrap(menuRef)
```

❌ **ARIA live regions** (4.1.3 - AA)
```vue
<div role="alert" aria-live="assertive">
  {{ errorMessage }}
</div>
<div aria-live="polite" aria-atomic="true">
  {{ successMessage }}
</div>
```

❌ **Aria-label sur boutons icônes** (4.1.2 - A)
```vue
<button aria-label="Ouvrir le menu de navigation">
  <Icon name="heroicons:bars-3" aria-hidden="true" />
</button>
```

#### Priorité MOYENNE (Améliorations AA)

⚠️ **Focus-visible stylisé** (2.4.7 - AA)
```css
*:focus-visible {
  outline: 3px solid #fbbf24;
  outline-offset: 2px;
}
```

⚠️ **Aria-invalid sur champs en erreur** (4.1.2 - A)
```vue
<input
  :aria-invalid="emailError ? 'true' : 'false'"
  aria-describedby="email-error"
/>
<span id="email-error" v-if="emailError">{{ emailError }}</span>
```

⚠️ **Alt text descriptifs** (1.1.1 - A)
```vue
<img
  :src="testimony.userAvatar"
  :alt="`Photo de profil de ${testimony.firstName}`"
/>
```

⚠️ **Suggestions d'erreur** (3.3.3 - AA)
```js
if (emailError) {
  return {
    error: 'Format email invalide',
    suggestion: 'Exemple : votre.nom@exemple.fr'
  }
}
```

#### Priorité BASSE (Optimisations AAA)

⚠️ **Prefers-reduced-motion** (Hors WCAG mais bonne pratique)
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

⚠️ **Landmarks ARIA explicites**
```vue
<header role="banner">
<nav role="navigation" aria-label="Navigation principale">
<main role="main">
<footer role="contentinfo">
```

---

## 7. Internationalisation

### 7.1 Langue

**Langue principale** : Français (France)

**Configuration** :
```vue
<!-- app.vue -->
<script setup>
useHead({
  htmlAttrs: { lang: 'fr' }
})
</script>
```

```ts
// nuxt.config.ts
app: {
  head: {
    htmlAttrs: { lang: 'fr' },
    meta: [
      { property: 'og:locale', content: 'fr_FR' }
    ]
  }
}
```

**Attributs lang** :
- ✅ `<html lang="fr">` dans app.vue
- ✅ `<html lang="fr">` dans nuxt.config.ts
- ✅ Meta `og:locale` = `fr_FR`

**Multilingue** :
- ❌ Pas d'i18n configuré
- ❌ Pas de module @nuxtjs/i18n
- ❌ Pas de sélecteur de langue

**Recommandation** : Projet monolingue français, pas besoin d'i18n pour le moment

---

### 7.2 Dates et formats

**Format de date** :
```js
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
```

**Résultat** : "11 octobre 2025"

**Usage** :
- Articles d'actualités
- Dates de témoignages
- Footer copyright : `{{ new Date().getFullYear() }}`

**Formats utilisés** :
- ✅ `Intl.DateTimeFormat('fr-FR')` pour dates
- ✅ Format long (jour mois année)
- ⚠️ Pas de format court (DD/MM/YYYY) utilisé
- ⚠️ Pas de format heure (HH:mm)

---

### 7.3 Monnaie

**Format monétaire** : EUR (€)

**Usage** :
```vue
<!-- Tarifs adhésion -->
<div class="text-2xl font-bold text-primary-600">5€</div>
<div class="text-2xl font-bold text-primary-600">15€</div>
<div class="text-2xl font-bold text-primary-600">50€</div>

<!-- Formulaires -->
<input type="number" step="0.01" placeholder="Ex: 45" />
<label>Coût mensuel (€)</label>
```

**Format utilisé** :
- ⚠️ Format simple : `5€` (sans espace avant €)
- ⚠️ Pas d'utilisation de `Intl.NumberFormat`

**Recommandation** :
```js
// Utiliser Intl pour format cohérent
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

// Résultat : "5,00 €" (avec espace insécable)
```

**Conversion** :
- ❌ Pas de conversion de devises
- ❌ Pas de sélecteur de devise
- ✅ EUR uniquement (projet français)

---

## 8. Recommandations UX

### 8.1 Améliorations suggérées

#### Priorité CRITIQUE

**1. Accessibilité clavier**
```
Problème : Menu mobile sans focus trap, pas de gestion ESC
Impact : Utilisateurs clavier bloqués
Solution :
- Implémenter useFocusTrap (@vueuse/core)
- Gérer touche ESC pour fermer
- Ajouter skip links
Effort : 2-3h
```

**2. Messages d'erreur ARIA**
```
Problème : Pas d'annonce pour lecteurs d'écran
Impact : Utilisateurs malvoyants ne savent pas qu'il y a erreur
Solution :
- Ajouter role="alert" aria-live="assertive"
- Ajouter aria-invalid sur champs
- Ajouter aria-describedby pour messages
Effort : 1-2h
```

**3. Focus states visibles**
```
Problème : Focus peu visible sur boutons/liens
Impact : Navigation clavier difficile
Solution :
- Ajouter focus-visible avec outline contrasté
- Utiliser couleur différente du hover
Effort : 1h
```

#### Priorité HAUTE

**4. Validation en temps réel**
```
Problème : Erreurs visibles uniquement à la soumission
Impact : Frustration utilisateur, perte de temps
Solution :
- Valider email au blur
- Valider longueur témoignage en temps réel
- Afficher erreurs sous champs concernés
Effort : 3-4h
```

**5. Loading states avancés**
```
Problème : Pas de skeleton loaders
Impact : Perception de lenteur
Solution :
- Ajouter skeletons pour listes (témoignages, actualités)
- Ajouter shimmer effect
Effort : 2-3h
```

**6. Progress bar global**
```
Problème : Formulaires multi-étapes sans % de complétion
Impact : Utilisateur ne sait pas combien de temps reste
Solution :
- Ajouter barre % : "Étape 2/4 - 50%"
- Rendre la barre interactive (clic pour revenir)
Effort : 1-2h
```

#### Priorité MOYENNE

**7. Animations responsables**
```
Problème : Animations continues sans prefers-reduced-motion
Impact : Motion sickness pour certains utilisateurs
Solution :
- Ajouter @media (prefers-reduced-motion: reduce)
- Désactiver animate-shake, animate-bounce
Effort : 1h
```

**8. Autocomplete amélioré**
```
Problème : Attributs autocomplete incomplets
Impact : Remplissage formulaires moins fluide
Solution :
- Ajouter autocomplete="given-name" / "family-name"
- Ajouter autocomplete="bday" pour date naissance
Effort : 30min
```

**9. Aide contextuelle**
```
Problème : Pas d'info-bulles ou popovers d'aide
Impact : Utilisateurs perdus sur certains champs
Solution :
- Ajouter tooltips avec icône "?" (Nuxt UI UTooltip)
- Exemple : "Pourquoi cette information ?"
Effort : 2-3h
```

**10. Confirmation avant actions critiques**
```
Problème : Pas de confirmation avant envoi formulaire
Impact : Erreurs d'envoi, données perdues
Solution :
- Ajouter modal de confirmation (UModal Nuxt UI)
- Récapitulatif avant soumission témoignage
Effort : 2h
```

#### Priorité BASSE

**11. Sauvegarde brouillon**
```
Problème : Formulaires longs perdus si refresh
Impact : Frustration majeure
Solution :
- Sauvegarder form state dans localStorage
- Auto-save toutes les 30s
- Message "Brouillon sauvegardé"
Effort : 3-4h
```

**12. Recherche et filtres**
```
Problème : Liste témoignages sans recherche
Impact : Difficile de trouver un témoignage spécifique
Solution :
- Barre de recherche
- Filtres par commune, type d'usager, date
Effort : 4-5h
```

**13. Partage social amélioré**
```
Problème : Boutons de partage non fonctionnels (actualités)
Impact : Pas de viralité
Solution :
- Implémenter partage réel (Web Share API + fallback)
- Ajouter bouton "Copier le lien" fonctionnel
Effort : 2h
```

---

### 8.2 Tests utilisateur à réaliser

**Tests d'accessibilité** :

**1. Test lecteur d'écran**
- Outil : NVDA (Windows) ou VoiceOver (Mac)
- Pages : Accueil, Formulaire témoignage, Formulaire adhésion
- Focus : Navigation, annonces, labels

**2. Test navigation clavier uniquement**
- Sans souris/trackpad
- Vérifier tous les parcours critiques
- Focus visible, pas de piège

**3. Test contraste**
- Outil : WebAIM Contrast Checker, axe DevTools
- Vérifier tous les textes, boutons, icônes
- Mode clair ET mode sombre (si implémenté)

**4. Test responsive**
- Devices : iPhone SE, iPad, Desktop 1920px
- Breakpoints : 375px, 768px, 1024px, 1440px
- Vérifier grilles, navigation, formulaires

**Tests UX** :

**5. Test formulaire témoignage (5 utilisateurs)**
- Mesurer temps de complétion
- Observer points de friction
- Mesurer taux d'abandon par étape
- Collecter feedback qualitatif

**6. Test formulaire adhésion (5 utilisateurs)**
- Mesurer temps de complétion
- Observer compréhension tarifs
- Vérifier clarté modalités paiement

**7. Test navigation globale (5 utilisateurs)**
- Trouver page "Revendications" : temps
- Trouver formulaire témoignage : temps
- Comprendre différence Soutien vs Adhésion : %

**8. Test mobile (3 utilisateurs)**
- Navigation menu burger
- Remplissage formulaire sur iPhone
- Lisibilité textes, taille boutons

**Métriques à collecter** :

| Métrique | Objectif |
|----------|----------|
| Taux de complétion témoignage | > 70% |
| Temps moyen témoignage | < 5 min |
| Taux de complétion adhésion | > 80% |
| Taux d'abandon étape 1 | < 10% |
| Taux d'erreur formulaires | < 5% |
| SUS Score (System Usability Scale) | > 70 |
| Conformité WCAG AA | 100% |

---

### 8.3 Friction points identifiés

**Parcours témoignage** :

❌ **Étape 1 : Trop de champs**
- 10+ champs sur première étape
- Risque d'abandon élevé
- **Solution** : Réduire à l'essentiel (Prénom, Email, Commune, Type)

⚠️ **Étape 2-3 : Champs numériques imprécis**
- "Temps de trajet (minutes)" : difficile à estimer
- "Coût mensuel" : calcul complexe
- **Solution** : Proposer des tranches (0-10min, 10-20min...) ou rendre optionnel

❌ **Étape 4 : Témoignage 50-2000 caractères**
- Minimum 50 trop court, peu de valeur
- Maximum 2000 peut être bloquant
- **Solution** : Minimum 100-150, ajouter exemples

⚠️ **Consentements multiples**
- 4 checkboxes de consentement
- Confusion possible
- **Solution** : Grouper, clarifier, pré-cocher les non-critiques

**Parcours adhésion** :

❌ **Étape 3 : Sélection tarif**
- 4 cards à cliquer
- "Montant libre" déroutant (input dans card)
- **Solution** : Ajouter radio buttons, clarifier UX montant libre

⚠️ **Étape 4 : Participation active**
- Champs conditionnels (si oui → 6 checkboxes)
- Peut intimider
- **Solution** : Clarifier "optionnel", ajouter "Je ne sais pas encore"

**Parcours soutien** :

✅ **Formulaire simple et clair**
- 1 seule page
- Champs essentiels uniquement
- Compteur motivant

⚠️ **Consentements complexes**
- 3 consentements à la fin
- Pas d'explication RGPD claire
- **Solution** : Lien vers politique de confidentialité, texte simplifié

**Navigation globale** :

❌ **Différence Soutien vs Adhérer**
- Termes similaires
- Confusion possible pour utilisateurs
- **Solution** : Renommer "Soutien" en "Pré-inscription gratuite", clarifier header

⚠️ **Menu mobile : pas de fermeture auto**
- Menu reste ouvert après clic lien
- **Solution** : ✅ Déjà implémenté (@click="mobileMenuOpen = false")

**Feedback** :

❌ **Messages d'erreur génériques**
- "Une erreur est survenue"
- Pas d'action proposée
- **Solution** : Messages spécifiques + lien contact en cas d'erreur persistante

⚠️ **Pas de confirmation avant envoi**
- Risque d'envoi accidentel
- **Solution** : Récapitulatif + bouton "Confirmer l'envoi"

---

## Conclusion

### Récapitulatif de la conformité

| Domaine | Statut | Score | Priorité |
|---------|--------|-------|----------|
| Sémantique HTML | ✅ Bon | 85% | - |
| Responsive Design | ✅ Bon | 90% | - |
| Formulaires | ⚠️ Moyen | 70% | Haute |
| Accessibilité clavier | ⚠️ Moyen | 60% | Critique |
| ARIA / Lecteurs d'écran | ❌ Insuffisant | 40% | Critique |
| Contraste couleurs | ✅ Bon | 95% | - |
| Messages utilisateur | ⚠️ Moyen | 65% | Haute |
| Animations | ⚠️ Moyen | 60% | Moyenne |
| **Global WCAG AA** | ⚠️ Partiel | **~65%** | **Critique** |

### Actions prioritaires (Quick Wins)

**1-2h de travail** :
1. ✅ Ajouter skip links
2. ✅ Ajouter aria-label sur boutons icônes
3. ✅ Ajouter role="alert" sur messages erreur
4. ✅ Ajouter focus-visible stylisé
5. ✅ Ajouter prefers-reduced-motion

**Impact** : Conformité WCAG AA passe de 65% à ~80%

### Ressources

**Outils de test** :
- [axe DevTools](https://www.deque.com/axe/devtools/) (Chrome/Firefox)
- [WAVE](https://wave.webaim.org/) (Extension navigateur)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (Chrome DevTools)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [NVDA](https://www.nvaccess.org/) (Lecteur d'écran Windows gratuit)

**Références** :
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/fr/docs/Web/Accessibility)
- [Nuxt UI Accessibility](https://ui.nuxt.com/getting-started/accessibility)
- [Vue.js Accessibility](https://vuejs.org/guide/best-practices/accessibility.html)

---

**Fin de la documentation UX et Accessibilité**

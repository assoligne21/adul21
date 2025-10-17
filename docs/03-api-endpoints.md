# Documentation des Endpoints API - ADUL21

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Authentification](#authentification)
3. [Endpoints publics](#endpoints-publics)
   - [Testimonies (Témoignages)](#testimonies)
   - [Members (Adhérents)](#members)
   - [Pre-Members (Soutiens)](#pre-members)
   - [News (Actualités)](#news)
   - [Contact](#contact)
   - [Incidents](#incidents)
   - [Donations](#donations)
   - [Newsletter](#newsletter)
4. [Endpoints protégés (Admin)](#endpoints-protégés-admin)
5. [Schémas de validation](#schémas-de-validation)
6. [Codes d'erreur](#codes-derreur)

---

## Vue d'ensemble

L'API ADUL21 est construite avec Nuxt 3 et utilise :
- **Drizzle ORM** pour la base de données PostgreSQL
- **Zod** pour la validation des données
- **JWT** pour l'authentification admin
- **Resend** pour l'envoi d'emails

Base URL : `/api`

---

## Authentification

### POST /api/auth/login

Authentification d'un administrateur.

**Auth requise** : Non

**Body** :
```json
{
  "email": "admin@adul21.fr",
  "password": "motdepasse"
}
```

**Réponse (200)** :
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "admin@adul21.fr",
    "name": "Admin Name"
  }
}
```

**Erreurs** :
- `400` - Email et mot de passe requis
- `401` - Email ou mot de passe incorrect
- `403` - Compte désactivé

**Notes** :
- Crée un JWT et le stocke dans un cookie HTTP-only
- Met à jour la date de dernière connexion

---

### POST /api/auth/logout

Déconnexion de l'administrateur.

**Auth requise** : Non (supprime simplement le cookie)

**Body** : Aucun

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

### GET /api/auth/me

Récupère les informations de l'utilisateur connecté.

**Auth requise** : Oui (JWT)

**Query params** : Aucun

**Réponse (200)** :
```json
{
  "user": {
    "userId": "uuid",
    "email": "admin@adul21.fr",
    "name": "Admin Name"
  }
}
```

**Erreurs** :
- `401` - Token manquant ou invalide

---

## Endpoints publics

## Testimonies

### GET /api/testimonies

Récupère la liste des témoignages.

**Auth requise** : Non

**Query params** :
| Paramètre | Type | Description | Défaut |
|-----------|------|-------------|--------|
| `moderation_status` | string | `pending`, `approved`, `rejected`, `needs_modification` | `approved` |
| `published` | boolean | Filtre par statut de publication | `true` |
| `featured` | boolean | Témoignages mis en avant | - |
| `city` | string | `Ledenon`, `Cabrières`, `Saint-Gervasy`, `Autre` | - |
| `user_type` | string | `student`, `parent`, `senior`, `pmr`, `worker`, `other` | - |
| `search` | string | Recherche dans le texte et nom de l'auteur | - |
| `limit` | number | Nombre de résultats | Tous |

**Réponse (200)** :
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "firstName": "Jean",
      "lastName": "Dupont",
      "ageRange": "30-50",
      "city": "Ledenon",
      "userType": "worker",
      "testimonyText": "Mon témoignage...",
      "publicationPreference": "first_name",
      "moderationStatus": "approved",
      "isPublished": true,
      "isFeatured": false,
      "viewsCount": 42,
      "reactionsCount": 5,
      "sharesCount": 3,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Erreurs** :
- `500` - Erreur serveur

---

### POST /api/testimonies

Crée un nouveau témoignage.

**Auth requise** : Non (public)

**Body** : Voir [Schéma testimonySchema](#testimonyschema)

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Votre témoignage a été enregistré avec succès",
  "data": {
    "id": "uuid",
    "createdAt": "2024-01-15T10:30:00Z",
    "moderationStatus": "pending",
    "isPublished": false
  }
}
```

**Erreurs** :
- `400` - Données invalides (validation Zod)
- `500` - Erreur serveur

**Notes** :
- Statut initial : `moderationStatus: "pending"`, `isPublished: false`
- Nécessite modération admin avant publication

---

### GET /api/testimonies/[id]

Récupère un témoignage spécifique.

**Auth requise** : Non

**Params URL** : `id` (UUID du témoignage)

**Réponse (200)** :
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Jean",
    "testimonyText": "Mon témoignage détaillé...",
    "city": "Ledenon",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Erreurs** :
- `400` - ID manquant
- `404` - Témoignage introuvable (ou non publié/approuvé)
- `500` - Erreur serveur

**Notes** :
- Retourne uniquement les témoignages `isPublished: true` et `moderationStatus: "approved"`

---

### PATCH /api/testimonies/[id]

Met à jour un témoignage (admin).

**Auth requise** : Recommandé (pas de vérification dans le code actuel, à sécuriser)

**Params URL** : `id` (UUID)

**Body** :
```json
{
  "moderation_status": "approved",
  "moderation_notes": "Validé pour publication",
  "is_published": true,
  "is_featured": false,
  "views_count": 50,
  "reactions_count": 8,
  "shares_count": 5
}
```

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Témoignage mis à jour avec succès",
  "data": {
    "id": "uuid",
    "moderationStatus": "approved",
    "isPublished": true,
    "moderatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Erreurs** :
- `400` - ID manquant ou données invalides
- `404` - Témoignage introuvable
- `500` - Erreur serveur

---

### DELETE /api/testimonies/[id]

Supprime un témoignage.

**Auth requise** : Recommandé (à sécuriser)

**Params URL** : `id` (UUID)

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Témoignage supprimé avec succès"
}
```

**Erreurs** :
- `400` - ID manquant
- `404` - Témoignage introuvable
- `500` - Erreur serveur

---

### POST /api/testimonies/[id]/increment-views

Incrémente le compteur de vues d'un témoignage.

**Auth requise** : Non

**Params URL** : `id` (UUID)

**Body** : Aucun

**Réponse (200)** :
```json
{
  "success": true,
  "views_count": 43
}
```

**Erreurs** :
- `400` - ID manquant
- `404` - Témoignage introuvable
- `500` - Erreur serveur

**Notes** :
- Utilise Supabase directement (voir code pour migration Drizzle)

---

## Members

### GET /api/members

Récupère la liste des adhérents.

**Auth requise** : Recommandé (données sensibles)

**Query params** :
| Paramètre | Type | Description |
|-----------|------|-------------|
| `membership_status` | string | `pending`, `active`, `expired`, `cancelled` |
| `membership_type` | string | `reduced`, `normal`, `support`, `custom` |
| `city` | string | `Ledenon`, `Cabrières`, `Saint-Gervasy`, `Autre` |
| `user_type` | string | `student`, `parent`, `worker`, `senior`, `pmr`, `other` |
| `wants_to_participate` | boolean | Filtrer par volonté de participation |
| `search` | string | Recherche dans nom/prénom/email |
| `limit` | number | Nombre de résultats |

**Réponse (200)** :
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "civility": "M.",
      "firstName": "Pierre",
      "lastName": "Martin",
      "email": "pierre.martin@email.com",
      "phone": "0601020304",
      "city": "Ledenon",
      "membershipType": "normal",
      "membershipStatus": "active",
      "membershipFee": "20",
      "membershipStartDate": "2024-01-15T00:00:00Z",
      "membershipEndDate": "2025-01-15T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Erreurs** :
- `500` - Erreur serveur

---

### POST /api/members

Crée une nouvelle adhésion.

**Auth requise** : Non (formulaire public)

**Body** : Voir [Schéma memberSchema](#memberschema)

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Adhésion enregistrée avec succès",
  "data": {
    "id": "uuid",
    "email": "membre@email.com",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Erreurs** :
- `400` - Données invalides ou email déjà existant
- `409` - Email déjà utilisé
- `500` - Erreur serveur

**Notes** :
- Statut initial : `membershipStatus: "pending"`
- Dates : 1 an à partir de la date de création
- Envoie 2 emails : confirmation au membre + notification admin

---

### GET /api/members/[id]

Récupère un adhérent spécifique.

**Auth requise** : Recommandé

**Params URL** : `id` (UUID)

**Réponse (200)** :
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Pierre",
    "lastName": "Martin",
    "email": "pierre.martin@email.com",
    "membershipStatus": "active"
  }
}
```

**Erreurs** :
- `400` - ID manquant
- `404` - Adhérent introuvable
- `500` - Erreur serveur

---

### PATCH /api/members/[id]

Met à jour un adhérent.

**Auth requise** : Recommandé

**Params URL** : `id` (UUID)

**Body** :
```json
{
  "membership_status": "active",
  "membership_end_date": "2025-12-31",
  "stripe_customer_id": "cus_xxxxx",
  "payment_method": "stripe",
  "notes": "Paiement reçu le 15/01/2024",
  "is_admin": false
}
```

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Adhérent mis à jour avec succès",
  "data": {
    "id": "uuid",
    "membershipStatus": "active",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Erreurs** :
- `400` - ID manquant ou données invalides
- `404` - Adhérent introuvable
- `500` - Erreur serveur

---

### DELETE /api/members/[id]

Supprime un adhérent.

**Auth requise** : Oui

**Params URL** : `id` (UUID)

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Adhérent supprimé avec succès"
}
```

**Erreurs** :
- `400` - ID manquant
- `404` - Adhérent introuvable
- `500` - Erreur serveur

---

## Pre-Members

### POST /api/pre-members

Enregistre un soutien (avant création officielle de l'association).

**Auth requise** : Non

**Body** :
```json
{
  "firstName": "Marie",
  "lastName": "Dubois",
  "email": "marie.dubois@email.com",
  "phone": "0601020304",
  "city": "Ledenon",
  "userType": "parent",
  "wantsToBecomeMember": true,
  "wantsToVolunteer": true,
  "canHostMeeting": false,
  "canDistributeFlyers": true,
  "participationAreas": ["Communication", "Organisation d'événements"],
  "acceptsNewsletter": true,
  "acceptsContactWhenCreated": true,
  "acceptsAgInvitation": true
}
```

**Validation** :
- `firstName` : min 2, max 100 caractères
- `lastName` : min 2, max 100 caractères
- `email` : email valide
- `phone` : min 10, max 20 caractères
- `city` : enum `['Ledenon', 'Cabrières', 'Saint-Gervasy', 'Autre']`
- `userType` : enum `['student', 'parent', 'worker', 'senior', 'pmr', 'other']`

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Inscription enregistrée avec succès",
  "totalSupports": 142,
  "preMember": {
    "id": "uuid",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Erreurs** :
- `400` - Données invalides ou email déjà inscrit
- `500` - Erreur serveur

**Notes** :
- Vérifie l'unicité de l'email
- Retourne le compteur total de soutiens
- Envoie 2 emails : confirmation + notification admin avec compteur

---

### GET /api/pre-members/count

Récupère le nombre total de soutiens.

**Auth requise** : Non (affichage public)

**Query params** : Aucun

**Réponse (200)** :
```json
{
  "success": true,
  "data": {
    "count": 142
  }
}
```

**Notes** :
- Retourne `0` en cas d'erreur (gestion gracieuse)

---

## News

### GET /api/news

Récupère la liste des actualités.

**Auth requise** : Non

**Query params** :
| Paramètre | Type | Description | Défaut |
|-----------|------|-------------|--------|
| `published` | boolean | Filtre par statut de publication | `true` |
| `limit` | number | Nombre de résultats | Tous |

**Réponse (200)** :
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Titre de l'actualité",
      "slug": "titre-de-lactualite",
      "excerpt": "Résumé court...",
      "content": "Contenu complet...",
      "coverImageUrl": "https://...",
      "authorId": "uuid",
      "isPublished": true,
      "publishedAt": "2024-01-15T10:00:00Z",
      "metaTitle": "SEO title",
      "metaDescription": "SEO description",
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ]
}
```

**Notes** :
- Tri par date de publication décroissante

---

### POST /api/news

Crée une nouvelle actualité.

**Auth requise** : Recommandé

**Body** : Voir [Schéma newsSchema](#newsschema)

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Actualité créée avec succès",
  "data": {
    "id": "uuid",
    "title": "Titre",
    "slug": "titre",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Erreurs** :
- `400` - Données invalides
- `409` - Slug déjà existant
- `500` - Erreur serveur

---

### GET /api/news/[slug]

Récupère une actualité par son slug (fichier vide dans le projet).

**Status** : Non implémenté (fichier vide)

---

### GET /api/news/[id]

Récupère une actualité par son ID (fichier vide dans le projet).

**Status** : Non implémenté (fichier vide)

---

### PATCH /api/news/[id]

Met à jour une actualité (fichier vide dans le projet).

**Status** : Non implémenté (fichier vide)

---

### DELETE /api/news/[id]

Supprime une actualité (fichier vide dans le projet).

**Status** : Non implémenté (fichier vide)

---

## Contact

### POST /api/contact

Envoie un message de contact.

**Auth requise** : Non

**Body** :
```json
{
  "civility": "Mme",
  "firstName": "Sophie",
  "lastName": "Leroy",
  "email": "sophie.leroy@email.com",
  "phone": "0601020304",
  "subject": "testimony",
  "message": "Je souhaite témoigner de ma situation...",
  "acceptsProcessing": true
}
```

**Validation** :
- `civility` : enum `['M.', 'Mme', 'Autre']`
- `firstName` : min 2, max 100
- `lastName` : min 2, max 100
- `email` : email valide
- `phone` : max 20 (optionnel)
- `subject` : enum `['testimony', 'membership', 'volunteering', 'press', 'legal', 'other']`
- `message` : min 10, max 5000
- `acceptsProcessing` : doit être `true`

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Votre message a été envoyé avec succès"
}
```

**Erreurs** :
- `400` - Données invalides
- `500` - Erreur lors de l'envoi d'email

**Notes** :
- Envoie 2 emails :
  1. Notification admin avec les détails
  2. Confirmation utilisateur avec délai de réponse 48h
- Échoue si l'email admin ne peut être envoyé

---

## Incidents

### POST /api/incidents

Signale un incident sur la ligne 21.

**Auth requise** : Non

**Body** :
```json
{
  "incident_date": "2024-01-15",
  "incident_time": "08:30",
  "incident_type": "missed_correspondence",
  "bus_line": "Ligne 21",
  "description": "J'ai raté ma correspondance à cause du retard...",
  "consequence": "late_work",
  "consequence_details": "Arrivé 30 min en retard au travail",
  "taxi_cost": 25.50,
  "email": "user@email.com"
}
```

**Validation** :
- `incident_date` : format `YYYY-MM-DD`
- `incident_time` : format `HH:MM` (optionnel)
- `incident_type` : enum `['missed_correspondence', 'delay', 'no_bus', 'accessibility', 'extra_cost', 'other']`
- `bus_line` : string (optionnel)
- `description` : min 20 caractères
- `consequence` : enum `['late_work', 'missed_appointment', 'taxi_cost', 'abandoned_trip', 'other']` (optionnel)
- `consequence_details` : string (optionnel)
- `taxi_cost` : nombre positif (optionnel)
- `email` : email valide (optionnel)

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Incident signalé avec succès",
  "data": {
    "id": "uuid",
    "incidentDate": "2024-01-15",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Erreurs** :
- `400` - Données invalides
- `500` - Erreur serveur

---

## Donations

### POST /api/donations

Enregistre un don.

**Auth requise** : Non

**Body** :
```json
{
  "email": "donor@email.com",
  "first_name": "Thomas",
  "last_name": "Bernard",
  "amount": 50,
  "type": "one_time",
  "accepts_newsletter": true,
  "message": "Bon courage pour votre mobilisation"
}
```

**Validation** :
- `email` : email valide
- `first_name` : string (optionnel)
- `last_name` : string (optionnel)
- `amount` : nombre positif, minimum 1€
- `type` : enum `['one_time', 'monthly']`
- `accepts_newsletter` : boolean
- `message` : string (optionnel)

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Don enregistré avec succès",
  "data": {
    "id": "uuid",
    "amount": "50",
    "currency": "EUR",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Erreurs** :
- `400` - Données invalides
- `500` - Erreur serveur

**Notes** :
- Statut initial : `pending`
- Devise : EUR par défaut
- Nécessite intégration paiement (Stripe) pour finalisation

---

## Newsletter

### POST /api/newsletter/subscribe

Inscription à la newsletter.

**Auth requise** : Non

**Body** :
```json
{
  "email": "user@email.com",
  "first_name": "Alice",
  "last_name": "Dupont",
  "source": "footer"
}
```

**Validation** :
- `email` : email valide
- `first_name` : string (optionnel)
- `last_name` : string (optionnel)
- `source` : string (défaut: "footer")

**Réponse (200)** :
```json
{
  "success": true,
  "message": "Inscription à la newsletter réussie",
  "data": {
    "id": "uuid",
    "email": "user@email.com",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Erreurs** :
- `400` - Données invalides
- `409` - Email déjà inscrit
- `500` - Erreur serveur

---

## Endpoints protégés (Admin)

### GET /api/admin/stats

Récupère les statistiques globales.

**Auth requise** : Oui (JWT)

**Query params** : Aucun

**Réponse (200)** :
```json
{
  "testimonies": {
    "total": 87,
    "pending": 12,
    "published": 65
  },
  "members": {
    "total": 54
  },
  "preMembers": {
    "total": 142,
    "wantToBeMembers": 98,
    "wantToVolunteer": 67
  },
  "newsletter": {
    "total": 234,
    "active": 230,
    "unsubscribed": 4
  },
  "messages": {
    "unread": 5
  },
  "news": {
    "total": 15,
    "published": 12
  }
}
```

**Erreurs** :
- `401` - Non authentifié

---

### GET /api/admin/newsletter

Récupère la liste des abonnés newsletter.

**Auth requise** : Oui (JWT)

**Query params** :
| Paramètre | Type | Description | Défaut |
|-----------|------|-------------|--------|
| `limit` | number | Nombre de résultats | 1000 |

**Réponse (200)** :
```json
[
  {
    "id": "uuid",
    "email": "user@email.com",
    "firstName": "Alice",
    "lastName": "Dupont",
    "source": "footer",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**Notes** :
- Tri par date de création décroissante

---

### GET /api/admin/pre-members

Récupère la liste des soutiens (pre-members).

**Auth requise** : Oui (JWT)

**Query params** :
| Paramètre | Type | Description | Défaut |
|-----------|------|-------------|--------|
| `limit` | number | Nombre de résultats | 500 |

**Réponse (200)** :
```json
[
  {
    "id": "uuid",
    "firstName": "Marie",
    "lastName": "Dubois",
    "email": "marie.dubois@email.com",
    "phone": "0601020304",
    "city": "Ledenon",
    "userType": "parent",
    "wantsToBecomeMember": true,
    "wantsToVolunteer": true,
    "canHostMeeting": false,
    "canDistributeFlyers": true,
    "participationAreas": ["Communication"],
    "acceptsNewsletter": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**Notes** :
- Tri par date de création décroissante

---

## Schémas de validation

### testimonySchema

```typescript
{
  // Étape 1 : Informations personnelles
  first_name: string (min: 2),
  last_name: string (optionnel),
  age_range: 'under_18' | '18-30' | '30-50' | '50-70' | 'over_70',
  email: string (email valide),
  phone: string (optionnel),
  city: 'Ledenon' | 'Cabrières' | 'Saint-Gervasy' | 'Autre',
  user_type: 'student' | 'parent' | 'senior' | 'pmr' | 'worker' | 'other',
  school_name: string (optionnel),
  school_section: string (optionnel),
  workplace: string (optionnel),
  work_hours: string (optionnel),

  // Étape 2 : Avant suppression
  usage_before_frequency: 'daily' | '2-3_per_week' | 'weekly' | 'occasional' (optionnel),
  usage_before_time: number (entier positif, optionnel),
  usage_before_cost: number (positif, optionnel),
  usage_before_destination: string (optionnel),

  // Étape 3 : Après suppression
  usage_after_solution: 'car' | 'correspondences' | 'depends_on_someone' | 'stopped',
  usage_after_time: number (entier positif, optionnel),
  usage_after_correspondences: number (entier positif, optionnel),
  usage_after_wait_time: number (entier positif, optionnel),
  usage_after_cost: number (positif, optionnel),
  usage_after_distance: number (positif, optionnel),
  problems: string[] (tableau),
  missed_correspondences_per_month: number (entier positif, optionnel),

  // Étape 4 : Témoignage
  testimony_text: string (min: 50),
  concrete_example: string (optionnel),
  publication_preference: 'first_name' | 'initials' | 'anonymous',
  accepts_site_publication: boolean,
  accepts_legal_use: boolean,
  accepts_media_contact: boolean,
  accepts_oral_testimony: boolean,
  accepts_association_contact: boolean (défaut: false)
}
```

---

### memberSchema

```typescript
{
  // Informations personnelles
  civility: 'M.' | 'Mme' | 'Autre',
  firstName: string (min: 2),
  lastName: string (min: 2),
  birthDate: string (optionnel),
  email: string (email valide),
  phone: string (min: 10),
  address: string (min: 5),
  postalCode: string (regex: /^\d{5}$/),
  city: 'Ledenon' | 'Cabrières' | 'Saint-Gervasy' | 'Autre',

  // Profil usager
  userType: 'student' | 'parent' | 'worker' | 'senior' | 'pmr' | 'other',
  schoolName: string (optionnel),
  schoolSection: string (optionnel),
  usageBefore: 'daily' | '2-3_per_week' | 'weekly' | 'occasional' (optionnel),
  usageAfter: 'car' | 'correspondences' | 'depends_on_someone' | 'stopped' (optionnel),

  // Adhésion
  membershipType: 'reduced' | 'normal' | 'support' | 'custom',
  membershipFee: number (min: 1, positif),

  // Engagement
  wantsToParticipate: boolean,
  participationAreas: string[],
  acceptsNewsletter: boolean,
  acceptsTestimonyPublication: boolean,
  acceptsMediaContact: boolean,
  acceptsActionSolicitation: boolean
}
```

---

### newsSchema

```typescript
{
  title: string (min: 5),
  slug: string (min: 3, regex: /^[a-z0-9-]+$/),
  excerpt: string (optionnel),
  content: string (min: 50),
  cover_image_url: string (URL, optionnel),
  author_id: string (UUID, optionnel),
  is_published: boolean (défaut: false),
  published_at: string (optionnel),
  meta_title: string (optionnel),
  meta_description: string (optionnel)
}
```

---

## Codes d'erreur

| Code | Signification | Usage |
|------|---------------|-------|
| `200` | OK | Requête réussie |
| `400` | Bad Request | Données invalides (validation Zod) ou paramètres manquants |
| `401` | Unauthorized | Token JWT manquant ou invalide |
| `403` | Forbidden | Compte désactivé ou accès refusé |
| `404` | Not Found | Ressource introuvable |
| `409` | Conflict | Doublon (email déjà existant, slug déjà utilisé) |
| `500` | Internal Server Error | Erreur serveur ou base de données |

**Format d'erreur** :
```json
{
  "statusCode": 400,
  "statusMessage": "Données invalides",
  "data": {
    "errors": [
      {
        "path": ["email"],
        "message": "Email invalide"
      }
    ]
  }
}
```

---

## Notes d'implémentation

### Sécurité

1. **Endpoints à sécuriser** :
   - `PATCH /api/testimonies/[id]` - Ajouter `requireAuth(event)`
   - `DELETE /api/testimonies/[id]` - Ajouter `requireAuth(event)`
   - `GET /api/members` - Données sensibles, ajouter authentification
   - `PATCH /api/members/[id]` - Ajouter `requireAuth(event)`
   - `DELETE /api/members/[id]` - Ajouter `requireAuth(event)`
   - Tous les endpoints `/api/news/*` - Ajouter authentification

2. **CORS** : Configurer les origines autorisées en production

3. **Rate limiting** : Implémenter pour les endpoints publics (contact, pre-members, testimonies)

### Migration Supabase vers Drizzle

Le fichier `/api/testimonies/[id]/increment-views.post.ts` utilise encore Supabase. À migrer vers Drizzle :

```typescript
// Remplacer
const { data, error } = await supabase
  .from('testimonies')
  .update({ views_count: testimony.views_count + 1 })

// Par
await db
  .update(testimonies)
  .set({ viewsCount: sql`${testimonies.viewsCount} + 1` })
  .where(eq(testimonies.id, id))
```

### Endpoints non implémentés

Fichiers vides à implémenter :
- `/api/news/[slug].get.ts`
- `/api/news/[id].get.ts`
- `/api/news/[id].patch.ts`
- `/api/news/[id].delete.ts`

### Améliorations suggérées

1. **Pagination** : Ajouter offset/cursor pour les listes longues
2. **Filtres avancés** : Dates (createdAt between), tri personnalisé
3. **Exports** : CSV pour les listes admin (membres, soutiens)
4. **Webhooks Stripe** : Automatiser activation des adhésions après paiement
5. **Upload d'images** : Pour les actualités (cover_image_url)
6. **Statistiques détaillées** : Dashboard avec graphiques (témoignages par ville, adhésions par mois)

---

**Documentation générée le** : 2024-01-15
**Version de l'API** : 1.0
**Base de données** : PostgreSQL + Drizzle ORM
**Framework** : Nuxt 3

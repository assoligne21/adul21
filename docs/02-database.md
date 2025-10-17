# Documentation de la Base de Données - ADUL21

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration et Connexion](#configuration-et-connexion)
3. [Schéma Détaillé des Tables](#schéma-détaillé-des-tables)
4. [Relations entre Tables](#relations-entre-tables)
5. [Types et Énumérations](#types-et-énumérations)
6. [Système de Migrations](#système-de-migrations)
7. [Diagramme des Relations](#diagramme-des-relations)

---

## Vue d'ensemble

### Informations Générales

- **ORM** : Drizzle ORM
- **SGBD** : PostgreSQL
- **Driver** : postgres-js
- **Nombre total de tables** : 11
- **Fichier de schéma** : `/server/database/schema.ts`
- **Fichier de connexion** : `/server/database/connection.ts`

### Liste des Tables

1. **testimonies** - Témoignages des usagers de la ligne 21
2. **members** - Membres actifs de l'association
3. **preMembers** - Soutiens avant la création officielle de l'association
4. **news** - Articles et actualités
5. **donations** - Dons ponctuels
6. **subscriptions** - Dons mensuels récurrents
7. **incidents** - Signalements d'incidents sur la ligne 21
8. **downloads** - Statistiques de téléchargement de fichiers
9. **newsletterSubscribers** - Abonnés à la newsletter
10. **contactMessages** - Messages du formulaire de contact
11. **adminUsers** - Utilisateurs administrateurs

---

## Configuration et Connexion

### Configuration Drizzle (`drizzle.config.ts`)

```typescript
{
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/adul21'
  },
  verbose: true,
  strict: true
}
```

### Connexion à la Base de Données

```typescript
// Client pour les requêtes
const queryClient = postgres(connectionString)
export const db = drizzle(queryClient, { schema })

// Client pour les migrations (limite à 1 connexion)
export const migrationClient = postgres(connectionString, { max: 1 })
```

### Variable d'Environnement

```
DATABASE_URL=postgresql://user:password@host:5432/database
```

---

## Schéma Détaillé des Tables

### 1. Table `testimonies`

**Rôle** : Stocke les témoignages des usagers concernant leurs expériences avec la ligne 21.

#### Colonnes

| Colonne | Type | Contraintes | Default | Description |
|---------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | Date de création |
| `updated_at` | TIMESTAMP | NOT NULL | `now()` | Date de mise à jour |
| **Informations Auteur** |
| `first_name` | VARCHAR(100) | NOT NULL | - | Prénom |
| `last_name` | VARCHAR(100) | - | - | Nom de famille |
| `email` | VARCHAR(255) | NOT NULL | - | Email |
| `phone` | VARCHAR(20) | - | - | Téléphone |
| `city` | VARCHAR(100) | NOT NULL | - | Ville |
| `age_range` | VARCHAR(50) | NOT NULL | - | Tranche d'âge |
| **Profil** |
| `user_type` | VARCHAR(50) | NOT NULL | - | Type d'usager (élève, étudiant, salarié) |
| `school_name` | VARCHAR(255) | - | - | Nom de l'établissement scolaire |
| `school_section` | VARCHAR(255) | - | - | Section/classe |
| `workplace` | VARCHAR(255) | - | - | Lieu de travail |
| `work_hours` | VARCHAR(255) | - | - | Horaires de travail |
| **Utilisation Avant** |
| `usage_before_frequency` | VARCHAR(50) | - | - | Fréquence d'utilisation avant |
| `usage_before_time` | INTEGER | - | - | Temps de trajet avant (minutes) |
| `usage_before_destination` | TEXT | - | - | Destination avant |
| `usage_before_cost` | DECIMAL(10,2) | - | - | Coût avant (EUR) |
| **Utilisation Après** |
| `usage_after_solution` | VARCHAR(50) | - | - | Solution adoptée après |
| `usage_after_time` | INTEGER | - | - | Temps de trajet après (minutes) |
| `usage_after_correspondences` | INTEGER | - | - | Nombre de correspondances |
| `usage_after_wait_time` | INTEGER | - | - | Temps d'attente (minutes) |
| `usage_after_cost` | DECIMAL(10,2) | - | - | Coût après (EUR) |
| `usage_after_distance` | DECIMAL(10,2) | - | - | Distance (km) |
| `problems` | JSON | - | - | Liste des problèmes rencontrés |
| `missed_correspondences_per_month` | INTEGER | - | - | Correspondances ratées par mois |
| **Témoignage** |
| `testimony_text` | TEXT | NOT NULL | - | Texte du témoignage |
| `concrete_example` | TEXT | - | - | Exemple concret |
| **Publication** |
| `publication_preference` | VARCHAR(50) | NOT NULL | - | Préférence de publication |
| `accepts_site_publication` | BOOLEAN | NOT NULL | `false` | Accepte publication site |
| `accepts_legal_use` | BOOLEAN | NOT NULL | `false` | Accepte usage juridique |
| `accepts_association_contact` | BOOLEAN | NOT NULL | `false` | Accepte contact association |
| `accepts_media_contact` | BOOLEAN | NOT NULL | `false` | Accepte contact médias |
| `accepts_oral_testimony` | BOOLEAN | NOT NULL | `false` | Accepte témoignage oral |
| **Photo** |
| `photo_url` | TEXT | - | - | URL de la photo |
| **Modération** |
| `moderation_status` | VARCHAR(50) | NOT NULL | `'pending'` | Statut de modération |
| `moderation_notes` | TEXT | - | - | Notes de modération |
| `moderated_by` | VARCHAR(255) | - | - | Modéré par |
| `moderated_at` | TIMESTAMP | - | - | Date de modération |
| **Statistiques** |
| `views_count` | INTEGER | NOT NULL | `0` | Nombre de vues |
| `reactions_count` | INTEGER | NOT NULL | `0` | Nombre de réactions |
| `shares_count` | INTEGER | NOT NULL | `0` | Nombre de partages |
| **Flags** |
| `is_published` | BOOLEAN | NOT NULL | `false` | Est publié |
| `is_featured` | BOOLEAN | NOT NULL | `false` | Est mis en avant |

#### Index

- PRIMARY KEY sur `id`

#### Valeurs d'Énumération

**moderation_status** : `pending`, `approved`, `rejected`

---

### 2. Table `members`

**Rôle** : Gère les adhérents officiels de l'association ADUL21.

#### Colonnes

| Colonne | Type | Contraintes | Default | Description |
|---------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | Date de création |
| `updated_at` | TIMESTAMP | NOT NULL | `now()` | Date de mise à jour |
| **Informations Personnelles** |
| `civility` | VARCHAR(10) | NOT NULL | - | Civilité (M., Mme, etc.) |
| `first_name` | VARCHAR(100) | NOT NULL | - | Prénom |
| `last_name` | VARCHAR(100) | NOT NULL | - | Nom |
| `birth_date` | VARCHAR(10) | - | - | Date de naissance (YYYY-MM-DD) |
| **Contact** |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | - | Email |
| `phone` | VARCHAR(20) | - | - | Téléphone |
| `address` | TEXT | NOT NULL | - | Adresse complète |
| `postal_code` | VARCHAR(10) | NOT NULL | - | Code postal |
| `city` | VARCHAR(100) | NOT NULL | - | Ville |
| **Profil** |
| `user_type` | VARCHAR(50) | NOT NULL | - | Type d'usager |
| `school_name` | VARCHAR(255) | - | - | Nom de l'établissement |
| `school_section` | VARCHAR(255) | - | - | Section |
| `usage_before` | VARCHAR(50) | - | - | Utilisation avant |
| `usage_after` | VARCHAR(50) | - | - | Utilisation après |
| **Adhésion** |
| `membership_fee` | DECIMAL(10,2) | NOT NULL | - | Montant de la cotisation |
| `membership_type` | VARCHAR(50) | NOT NULL | - | Type d'adhésion |
| `membership_status` | VARCHAR(50) | NOT NULL | `'pending'` | Statut de l'adhésion |
| `membership_start_date` | TIMESTAMP | - | - | Date de début |
| `membership_end_date` | TIMESTAMP | - | - | Date de fin |
| `payment_method` | VARCHAR(50) | - | - | Méthode de paiement |
| `stripe_customer_id` | VARCHAR(255) | - | - | ID client Stripe |
| **Engagement** |
| `wants_to_participate` | BOOLEAN | NOT NULL | `false` | Souhaite participer |
| `participation_areas` | JSON | - | - | Domaines de participation |
| **Consentements** |
| `accepts_newsletter` | BOOLEAN | NOT NULL | `false` | Accepte newsletter |
| `accepts_testimony_publication` | BOOLEAN | NOT NULL | `false` | Accepte publication témoignage |
| `accepts_media_contact` | BOOLEAN | NOT NULL | `false` | Accepte contact médias |
| `accepts_action_solicitation` | BOOLEAN | NOT NULL | `false` | Accepte sollicitation actions |
| **Administration** |
| `is_admin` | BOOLEAN | NOT NULL | `false` | Est administrateur |
| `notes` | TEXT | - | - | Notes internes |

#### Index

- PRIMARY KEY sur `id`
- UNIQUE sur `email`

#### Valeurs d'Énumération

**membership_status** : `pending`, `active`, `expired`, `cancelled`
**membership_type** : `normal`, `student`, `family`, `reduced`

---

### 3. Table `preMembers`

**Rôle** : Gère les soutiens avant la création officielle de l'association (phase de mobilisation).

#### Colonnes

| Colonne | Type | Contraintes | Default | Description |
|---------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | Date de création |
| `updated_at` | TIMESTAMP | NOT NULL | `now()` | Date de mise à jour |
| **Informations Personnelles** |
| `first_name` | VARCHAR(100) | NOT NULL | - | Prénom |
| `last_name` | VARCHAR(100) | NOT NULL | - | Nom |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | - | Email |
| `phone` | VARCHAR(20) | NOT NULL | - | Téléphone |
| `city` | VARCHAR(100) | NOT NULL | - | Ville |
| `user_type` | VARCHAR(50) | NOT NULL | - | Type d'usager |
| **Intentions** |
| `wants_to_become_member` | BOOLEAN | NOT NULL | `false` | Souhaite devenir membre |
| `wants_to_volunteer` | BOOLEAN | NOT NULL | `false` | Souhaite être bénévole |
| `can_host_meeting` | BOOLEAN | NOT NULL | `false` | Peut héberger réunion |
| `can_distribute_flyers` | BOOLEAN | NOT NULL | `false` | Peut distribuer tracts |
| `participation_areas` | JSON | - | - | Domaines de participation |
| **Consentements** |
| `accepts_newsletter` | BOOLEAN | NOT NULL | `false` | Accepte newsletter |
| `accepts_contact_when_created` | BOOLEAN | NOT NULL | `false` | Accepte contact à la création |
| `accepts_ag_invitation` | BOOLEAN | NOT NULL | `false` | Accepte invitation AG |
| **Migration** |
| `converted_to_member_id` | UUID | - | - | ID membre après conversion |
| `converted_at` | TIMESTAMP | - | - | Date de conversion |

#### Index

- PRIMARY KEY sur `id`
- UNIQUE sur `email`

---

### 4. Table `news`

**Rôle** : Gère les articles d'actualité et les communications publiques de l'association.

#### Colonnes

| Colonne | Type | Contraintes | Default | Description |
|---------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | Date de création |
| `updated_at` | TIMESTAMP | NOT NULL | `now()` | Date de mise à jour |
| **Contenu** |
| `title` | VARCHAR(255) | NOT NULL | - | Titre de l'article |
| `slug` | VARCHAR(255) | NOT NULL, UNIQUE | - | Slug URL |
| `excerpt` | TEXT | - | - | Résumé/extrait |
| `content` | TEXT | NOT NULL | - | Contenu complet |
| `cover_image_url` | TEXT | - | - | URL image de couverture |
| **Auteur** |
| `author_id` | UUID | - | - | ID de l'auteur |
| **Publication** |
| `is_published` | BOOLEAN | NOT NULL | `false` | Est publié |
| `published_at` | TIMESTAMP | - | - | Date de publication |
| **SEO** |
| `meta_title` | VARCHAR(255) | - | - | Meta titre |
| `meta_description` | TEXT | - | - | Meta description |
| **Statistiques** |
| `views_count` | INTEGER | NOT NULL | `0` | Nombre de vues |

#### Index

- PRIMARY KEY sur `id`
- UNIQUE sur `slug`

---

### 5. Table `donations`

**Rôle** : Gère les dons ponctuels effectués via Stripe.

#### Colonnes

| Colonne | Type | Contraintes | Default | Description |
|---------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | Date de création |
| **Donateur** |
| `email` | VARCHAR(255) | NOT NULL | - | Email du donateur |
| `first_name` | VARCHAR(100) | - | - | Prénom |
| `last_name` | VARCHAR(100) | - | - | Nom |
| **Montant** |
| `amount` | DECIMAL(10,2) | NOT NULL | - | Montant du don |
| `currency` | VARCHAR(3) | NOT NULL | `'EUR'` | Devise |
| `payment_method` | VARCHAR(50) | - | - | Méthode de paiement |
| **Stripe** |
| `stripe_payment_intent_id` | VARCHAR(255) | - | - | ID PaymentIntent Stripe |
| `stripe_customer_id` | VARCHAR(255) | - | - | ID client Stripe |
| **Statut** |
| `status` | VARCHAR(50) | NOT NULL | `'pending'` | Statut du paiement |
| `completed_at` | TIMESTAMP | - | - | Date de finalisation |
| **Reçu Fiscal** |
| `receipt_sent` | BOOLEAN | NOT NULL | `false` | Reçu envoyé |
| `receipt_sent_at` | TIMESTAMP | - | - | Date d'envoi du reçu |
| **Autres** |
| `accepts_newsletter` | BOOLEAN | NOT NULL | `false` | Accepte newsletter |
| `message` | TEXT | - | - | Message du donateur |

#### Index

- PRIMARY KEY sur `id`

#### Valeurs d'Énumération

**status** : `pending`, `succeeded`, `failed`, `cancelled`

---

### 6. Table `subscriptions`

**Rôle** : Gère les abonnements mensuels récurrents via Stripe.

#### Colonnes

| Colonne | Type | Contraintes | Default | Description |
|---------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | Date de création |
| `updated_at` | TIMESTAMP | NOT NULL | `now()` | Date de mise à jour |
| **Abonné** |
| `email` | VARCHAR(255) | NOT NULL | - | Email |
| `first_name` | VARCHAR(100) | - | - | Prénom |
| `last_name` | VARCHAR(100) | - | - | Nom |
| **Montant** |
| `amount` | DECIMAL(10,2) | NOT NULL | - | Montant mensuel |
| `currency` | VARCHAR(3) | NOT NULL | `'EUR'` | Devise |
| `billing_day` | INTEGER | NOT NULL | - | Jour de prélèvement (1-31) |
| **Stripe** |
| `stripe_subscription_id` | VARCHAR(255) | NOT NULL, UNIQUE | - | ID Subscription Stripe |
| `stripe_customer_id` | VARCHAR(255) | NOT NULL | - | ID client Stripe |
| **Statut** |
| `status` | VARCHAR(50) | NOT NULL | `'active'` | Statut de l'abonnement |
| `start_date` | TIMESTAMP | NOT NULL | - | Date de début |
| `end_date` | TIMESTAMP | - | - | Date de fin |
| `cancel_at_period_end` | BOOLEAN | NOT NULL | `false` | Annulé en fin de période |
| **Autres** |
| `accepts_newsletter` | BOOLEAN | NOT NULL | `false` | Accepte newsletter |

#### Index

- PRIMARY KEY sur `id`
- UNIQUE sur `stripe_subscription_id`

#### Valeurs d'Énumération

**status** : `active`, `past_due`, `cancelled`, `unpaid`

---

### 7. Table `incidents`

**Rôle** : Stocke les signalements d'incidents concernant la ligne 21.

#### Colonnes

| Colonne | Type | Contraintes | Default | Description |
|---------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | Date de création |
| **Incident** |
| `incident_date` | VARCHAR(10) | NOT NULL | - | Date de l'incident (YYYY-MM-DD) |
| `incident_time` | VARCHAR(5) | - | - | Heure de l'incident (HH:MM) |
| `incident_type` | VARCHAR(100) | NOT NULL | - | Type d'incident |
| `bus_line` | VARCHAR(50) | - | - | Ligne de bus concernée |
| `description` | TEXT | NOT NULL | - | Description de l'incident |
| **Conséquences** |
| `consequence` | VARCHAR(100) | - | - | Type de conséquence |
| `consequence_details` | TEXT | - | - | Détails de la conséquence |
| `taxi_cost` | DECIMAL(10,2) | - | - | Coût du taxi (si applicable) |
| **Contact** |
| `email` | VARCHAR(255) | - | - | Email du signalant |

#### Index

- PRIMARY KEY sur `id`

#### Valeurs d'Énumération

**incident_type** : `retard`, `annulation`, `bus_plein`, `panne`, `accident`, `autre`
**consequence** : `retard_travail`, `retard_cours`, `correspondance_ratee`, `frais_taxi`, `autre`

---

### 8. Table `downloads`

**Rôle** : Statistiques de téléchargement des fichiers (tracts, documents, etc.).

#### Colonnes

| Colonne | Type | Contraintes | Default | Description |
|---------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | Date de téléchargement |
| **Fichier** |
| `file_name` | VARCHAR(255) | NOT NULL | - | Nom du fichier |
| `file_type` | VARCHAR(50) | NOT NULL | - | Type de fichier |
| **Tracking** |
| `ip_address` | VARCHAR(45) | - | - | Adresse IP (IPv4/IPv6) |
| `user_agent` | TEXT | - | - | User Agent |
| `country_code` | VARCHAR(2) | - | - | Code pays (ISO 3166-1) |
| `city` | VARCHAR(100) | - | - | Ville |

#### Index

- PRIMARY KEY sur `id`

---

### 9. Table `newsletterSubscribers`

**Rôle** : Gère les abonnés à la newsletter de l'association.

#### Colonnes

| Colonne | Type | Contraintes | Default | Description |
|---------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | Date d'inscription |
| **Abonné** |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | - | Email |
| `first_name` | VARCHAR(100) | - | - | Prénom |
| `last_name` | VARCHAR(100) | - | - | Nom |
| **Statut** |
| `is_active` | BOOLEAN | NOT NULL | `true` | Est actif |
| `unsubscribed_at` | TIMESTAMP | - | - | Date de désinscription |
| **Source** |
| `source` | VARCHAR(50) | NOT NULL | - | Source de l'inscription |

#### Index

- PRIMARY KEY sur `id`
- UNIQUE sur `email`

#### Valeurs d'Énumération

**source** : `footer`, `adhesion`, `donation`, `testimony`, `contact`, `manual`

---

### 10. Table `contactMessages`

**Rôle** : Gère les messages envoyés via le formulaire de contact.

#### Colonnes

| Colonne | Type | Contraintes | Default | Description |
|---------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | Date de réception |
| **Expéditeur** |
| `name` | VARCHAR(100) | NOT NULL | - | Nom complet |
| `email` | VARCHAR(255) | NOT NULL | - | Email |
| `phone` | VARCHAR(20) | - | - | Téléphone |
| **Message** |
| `subject` | VARCHAR(255) | NOT NULL | - | Sujet |
| `message` | TEXT | NOT NULL | - | Message |
| `accepts_contact` | BOOLEAN | NOT NULL | `false` | Accepte d'être recontacté |
| **Traitement** |
| `status` | VARCHAR(50) | NOT NULL | `'new'` | Statut du message |
| `replied_at` | TIMESTAMP | - | - | Date de réponse |
| `replied_by` | VARCHAR(255) | - | - | Répondu par |
| `reply_notes` | TEXT | - | - | Notes de réponse |

#### Index

- PRIMARY KEY sur `id`

#### Valeurs d'Énumération

**status** : `new`, `read`, `replied`, `archived`

---

### 11. Table `adminUsers`

**Rôle** : Gère les comptes administrateurs du backoffice.

#### Colonnes

| Colonne | Type | Contraintes | Default | Description |
|---------|------|-------------|---------|-------------|
| `id` | UUID | PRIMARY KEY | `gen_random_uuid()` | Identifiant unique |
| `created_at` | TIMESTAMP | NOT NULL | `now()` | Date de création |
| `updated_at` | TIMESTAMP | NOT NULL | `now()` | Date de mise à jour |
| **Authentification** |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | - | Email de connexion |
| `password_hash` | VARCHAR(255) | NOT NULL | - | Hash du mot de passe |
| `name` | VARCHAR(100) | NOT NULL | - | Nom complet |
| **Activité** |
| `last_login_at` | TIMESTAMP | - | - | Dernière connexion |
| `is_active` | BOOLEAN | NOT NULL | `true` | Compte actif |

#### Index

- PRIMARY KEY sur `id`
- UNIQUE sur `email`

---

## Relations entre Tables

### Relations Explicites

#### 1. preMembers → members
- **Type** : One-to-One (optionnelle)
- **Clé** : `preMembers.converted_to_member_id` → `members.id`
- **Description** : Lorsqu'un pré-membre devient membre officiel, le lien est établi.

#### 2. news → adminUsers
- **Type** : Many-to-One (optionnelle)
- **Clé** : `news.author_id` → `adminUsers.id`
- **Description** : Chaque article peut avoir un auteur administrateur.

### Relations Implicites

#### 3. members ↔ donations
- **Relation** : Via `email` et `stripe_customer_id`
- **Description** : Un membre peut effectuer plusieurs dons.

#### 4. members ↔ subscriptions
- **Relation** : Via `email` et `stripe_customer_id`
- **Description** : Un membre peut avoir un abonnement mensuel.

#### 5. members ↔ newsletterSubscribers
- **Relation** : Via `email`
- **Description** : Les membres qui acceptent la newsletter sont ajoutés aux abonnés.

#### 6. donations/subscriptions → newsletterSubscribers
- **Relation** : Via `email` et `accepts_newsletter`
- **Description** : Les donateurs/abonnés acceptant la newsletter sont ajoutés automatiquement.

#### 7. testimonies ↔ members
- **Relation** : Via `email`
- **Description** : Un témoignage peut être lié à un membre via l'email.

---

## Types et Énumérations

### Types PostgreSQL Utilisés

| Type Drizzle | Type PostgreSQL | Usage |
|--------------|-----------------|-------|
| `uuid()` | UUID | Identifiants uniques |
| `timestamp()` | TIMESTAMP | Dates et heures |
| `varchar(n)` | VARCHAR(n) | Chaînes de longueur limitée |
| `text()` | TEXT | Chaînes de longueur illimitée |
| `integer()` | INTEGER | Nombres entiers |
| `decimal(p,s)` | DECIMAL(p,s) | Montants financiers |
| `boolean()` | BOOLEAN | Valeurs true/false |
| `json()` | JSON | Données structurées |

### Énumérations

#### userType
```typescript
'eleve' | 'etudiant' | 'salarie' | 'parent' | 'autre'
```

#### moderationStatus
```typescript
'pending' | 'approved' | 'rejected'
```

#### membershipStatus
```typescript
'pending' | 'active' | 'expired' | 'cancelled'
```

#### membershipType
```typescript
'normal' | 'student' | 'family' | 'reduced'
```

#### donationStatus / subscriptionStatus
```typescript
'pending' | 'succeeded' | 'failed' | 'cancelled'
// Subscriptions: 'active' | 'past_due' | 'cancelled' | 'unpaid'
```

#### contactMessageStatus
```typescript
'new' | 'read' | 'replied' | 'archived'
```

### Types JSON

#### participationAreas
```typescript
type ParticipationAreas = string[]
// Exemples: ['communication', 'evenements', 'juridique', 'temoignages']
```

#### problems
```typescript
type Problems = string[]
// Exemples: ['retards', 'correspondances_ratees', 'bus_pleins', 'horaires_inadaptes']
```

---

## Système de Migrations

### Configuration

Les migrations sont gérées par **Drizzle Kit** et stockées dans `/server/database/migrations/`.

### Scripts Disponibles

```bash
# Générer une migration à partir du schéma
npm run db:generate

# Appliquer les migrations en base
npm run db:migrate

# Push direct du schéma (développement uniquement)
npm run db:push

# Interface graphique Drizzle Studio
npm run db:studio
```

### Historique des Migrations

```
/server/database/migrations/
├── 0000_safe_sunfire.sql           # Migration initiale
├── 0001_faithful_machine_man.sql   # Ajouts/modifications
├── 0002_cloudy_nekra.sql           # Dernières modifications
└── meta/
    ├── _journal.json                # Journal des migrations
    ├── 0000_snapshot.json
    ├── 0001_snapshot.json
    └── 0002_snapshot.json
```

### Processus de Migration

1. **Modifier le schéma** : Éditer `/server/database/schema.ts`
2. **Générer la migration** : `npm run db:generate`
3. **Vérifier le SQL** : Consulter le fichier `.sql` généré
4. **Appliquer** : `npm run db:migrate`

---

## Diagramme des Relations

```mermaid
erDiagram
    testimonies {
        uuid id PK
        varchar email
        varchar moderation_status
        boolean is_published
        text testimony_text
    }

    members {
        uuid id PK
        varchar email UK
        varchar membership_status
        varchar stripe_customer_id
        boolean accepts_newsletter
    }

    preMembers {
        uuid id PK
        varchar email UK
        uuid converted_to_member_id FK
        timestamp converted_at
    }

    news {
        uuid id PK
        varchar slug UK
        uuid author_id FK
        boolean is_published
    }

    donations {
        uuid id PK
        varchar email
        varchar stripe_customer_id
        varchar status
        decimal amount
    }

    subscriptions {
        uuid id PK
        varchar email
        varchar stripe_subscription_id UK
        varchar status
        decimal amount
    }

    incidents {
        uuid id PK
        varchar incident_date
        varchar incident_type
        text description
    }

    downloads {
        uuid id PK
        varchar file_name
        varchar ip_address
    }

    newsletterSubscribers {
        uuid id PK
        varchar email UK
        varchar source
        boolean is_active
    }

    contactMessages {
        uuid id PK
        varchar email
        varchar status
        text message
    }

    adminUsers {
        uuid id PK
        varchar email UK
        varchar password_hash
        boolean is_active
    }

    preMembers ||--o| members : "converts to"
    news }o--|| adminUsers : "authored by"
    members ||--o{ donations : "makes (via email)"
    members ||--o| subscriptions : "has (via email)"
    members ||--o| newsletterSubscribers : "subscribes (via email)"
    donations ||--o| newsletterSubscribers : "may subscribe"
    subscriptions ||--o| newsletterSubscribers : "may subscribe"
    testimonies ||--o| members : "linked by email"
```

### Légende des Relations

- `||--o|` : One-to-One (optionnelle)
- `||--o{` : One-to-Many
- `}o--||` : Many-to-One

---

## Exemples de Données

### Exemple: Testimony

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "Marie",
  "lastName": "Dupont",
  "email": "marie.dupont@example.com",
  "city": "Schiltigheim",
  "ageRange": "18-25",
  "userType": "etudiant",
  "schoolName": "Université de Strasbourg",
  "usageAfterTime": 45,
  "usageAfterCorrespondences": 2,
  "problems": ["retards", "correspondances_ratees", "bus_pleins"],
  "testimonyText": "Depuis la suppression de la ligne 21, je perds 30 minutes par jour...",
  "moderationStatus": "approved",
  "isPublished": true,
  "isFeatured": false
}
```

### Exemple: Member

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "civility": "Mme",
  "firstName": "Sophie",
  "lastName": "Martin",
  "email": "sophie.martin@example.com",
  "city": "Strasbourg",
  "userType": "salarie",
  "membershipFee": 20.00,
  "membershipType": "normal",
  "membershipStatus": "active",
  "wantsToParticipate": true,
  "participationAreas": ["communication", "evenements"],
  "acceptsNewsletter": true
}
```

### Exemple: Donation

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "email": "jean.dupuis@example.com",
  "firstName": "Jean",
  "lastName": "Dupuis",
  "amount": 50.00,
  "currency": "EUR",
  "status": "succeeded",
  "stripePaymentIntentId": "pi_3MtwBwLkdIwHu7ix28a3tqPa",
  "acceptsNewsletter": true,
  "receiptSent": true,
  "completedAt": "2024-01-15T10:30:00Z"
}
```

---

## Bonnes Pratiques

### Sécurité

1. **Mots de passe** : Toujours hasher avec bcrypt/argon2 (`adminUsers.password_hash`)
2. **Données sensibles** : Ne jamais exposer les `stripe_customer_id` publiquement
3. **RGPD** : Respecter les consentements (`accepts_*` flags)

### Performance

1. **Index** : Les colonnes `email` sont indexées (UNIQUE)
2. **UUID** : Utilisation de `gen_random_uuid()` pour les ID
3. **Timestamps** : Automatiques via `defaultNow()`

### Maintenance

1. **Soft Delete** : Préférer `is_active` à la suppression physique
2. **Audit Trail** : `created_at` et `updated_at` sur toutes les tables principales
3. **Migration** : Toujours générer et vérifier avant application

---

## Requêtes Utiles

### Statistiques Globales

```sql
-- Nombre total de témoignages publiés
SELECT COUNT(*) FROM testimonies WHERE is_published = true;

-- Membres actifs
SELECT COUNT(*) FROM members WHERE membership_status = 'active';

-- Montant total des dons
SELECT SUM(amount) FROM donations WHERE status = 'succeeded';

-- Abonnés actifs à la newsletter
SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = true;
```

### Recherches Courantes

```sql
-- Témoignages en attente de modération
SELECT * FROM testimonies
WHERE moderation_status = 'pending'
ORDER BY created_at DESC;

-- Membres avec abonnement actif
SELECT m.*, s.amount
FROM members m
JOIN subscriptions s ON m.stripe_customer_id = s.stripe_customer_id
WHERE s.status = 'active';

-- Messages non traités
SELECT * FROM contact_messages
WHERE status = 'new'
ORDER BY created_at ASC;
```

---

## Conclusion

Cette base de données PostgreSQL, gérée par Drizzle ORM, offre une structure complète et évolutive pour le projet ADUL21. Les 11 tables couvrent tous les aspects de la gestion d'une association militante : témoignages, adhésions, dons, communication et administration.

La conception privilégie la flexibilité (types JSON), la traçabilité (timestamps), et le respect de la vie privée (flags de consentement RGPD).

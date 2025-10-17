# Documentation RGPD - Conformité et Protection des Données

## Vue d'ensemble

Cette documentation présente une analyse complète de la conformité RGPD du projet ADUL21, identifie les données personnelles collectées, évalue les mesures de sécurité, et propose un plan d'action pour garantir une conformité totale avec le Règlement Général sur la Protection des Données (RGPD).

**Date d'analyse** : 17 octobre 2025
**Responsable du traitement** : Association de Défense des Usagers de la Ligne 21 (ADUL21)
**Contact données personnelles** : assoligne21@gmail.com

---

## Table des matières

1. [Base légale de traitement](#1-base-légale-de-traitement)
2. [Données personnelles collectées](#2-données-personnelles-collectées)
3. [Consentements collectés](#3-consentements-collectés)
4. [Droits des personnes](#4-droits-des-personnes)
5. [Durée de conservation](#5-durée-de-conservation)
6. [Sécurité des données](#6-sécurité-des-données)
7. [Transferts de données](#7-transferts-de-données)
8. [Cookies et tracking](#8-cookies-et-tracking)
9. [Documentation RGPD](#9-documentation-rgpd)
10. [DPO et contact](#10-dpo-et-contact)
11. [Violations de données](#11-violations-de-données)
12. [Évaluation de conformité](#12-évaluation-de-conformité)
13. [Recommandations](#13-recommandations)

---

## 1. Base légale de traitement

Le RGPD exige une base légale pour tout traitement de données personnelles (Article 6 du RGPD). Pour ADUL21, les bases légales sont :

### 1.1 Consentement (Article 6.1.a)

**Utilisé pour** :
- ✅ Témoignages (publication sur le site)
- ✅ Newsletter (envoi d'informations)
- ✅ Contact par les médias
- ✅ Messages de contact

**Caractéristiques** :
- Consentement **libre** : cases non pré-cochées ✅
- Consentement **spécifique** : par finalité (publication, newsletter, médias) ✅
- Consentement **éclairé** : informations claires fournies ✅
- Consentement **univoque** : action positive requise (cocher une case) ✅
- **Révocable** : possibilité de retirer le consentement ⚠️ (partiellement implémenté)

### 1.2 Exécution d'un contrat (Article 6.1.b)

**Utilisé pour** :
- ✅ Adhésion à l'association (membres)
- ✅ Pré-adhésion (futurs membres)

**Justification** : Les données collectées sont nécessaires pour exécuter le contrat d'adhésion (gestion administrative, convocations AG, etc.)

### 1.3 Obligation légale (Article 6.1.c)

**Utilisé pour** :
- ✅ Dons (conservation 10 ans pour obligations fiscales et comptables)

**Justification** : Code général des impôts (article 238 bis) et Code de commerce (conservation documents comptables)

### 1.4 Intérêt légitime (Article 6.1.f)

**Possiblement utilisable pour** :
- Actions juridiques (utilisation témoignages dans cadre légal)
- Sécurité du site (logs, authentification admin)

**Condition** : Réaliser un test de proportionnalité (intérêt légitime vs droits et libertés)

---

## 2. Données personnelles collectées

### 2.1 Inventaire complet par table de base de données

#### Table : `testimonies` (Témoignages)

| Donnée | Type | Catégorie RGPD | Obligatoire | Sensible |
|--------|------|----------------|-------------|----------|
| first_name | VARCHAR(100) | Identité | ✅ Oui | Non |
| last_name | VARCHAR(100) | Identité | ❌ Non | Non |
| email | VARCHAR(255) | Contact | ✅ Oui | Non |
| phone | VARCHAR(20) | Contact | ❌ Non | Non |
| city | VARCHAR(100) | Localisation | ✅ Oui | Non |
| age_range | VARCHAR(20) | Démographie | ✅ Oui | Non |
| user_type | VARCHAR(50) | Profil | ✅ Oui | Non |
| school_name | VARCHAR(200) | Profil | ❌ Non | Non |
| school_section | VARCHAR(200) | Profil | ❌ Non | Non |
| workplace | VARCHAR(200) | Profil | ❌ Non | Non |
| work_hours | VARCHAR(100) | Profil | ❌ Non | Non |
| testimony_text | TEXT | Contenu | ✅ Oui | Potentiel |
| concrete_example | TEXT | Contenu | ❌ Non | Potentiel |
| photo_url | TEXT | Média | ❌ Non | ⚠️ Biométrique |

**Consentements associés** :
- accepts_site_publication (obligatoire)
- accepts_legal_use
- accepts_association_contact
- accepts_media_contact
- accepts_oral_testimony

**Volume estimé** : ~100-500 témoignages par an

---

#### Table : `members` (Adhérents)

| Donnée | Type | Catégorie RGPD | Obligatoire | Sensible |
|--------|------|----------------|-------------|----------|
| civility | VARCHAR(10) | Identité | ✅ Oui | Non |
| first_name | VARCHAR(100) | Identité | ✅ Oui | Non |
| last_name | VARCHAR(100) | Identité | ✅ Oui | Non |
| birth_date | DATE | Identité | ❌ Non | Non |
| email | VARCHAR(255) | Contact | ✅ Oui | Non |
| phone | VARCHAR(20) | Contact | ✅ Oui | Non |
| address | TEXT | Localisation | ✅ Oui | Non |
| postal_code | VARCHAR(10) | Localisation | ✅ Oui | Non |
| city | VARCHAR(100) | Localisation | ✅ Oui | Non |
| user_type | VARCHAR(50) | Profil | ✅ Oui | Non |
| school_name | VARCHAR(200) | Profil | ❌ Non | Non |
| school_section | VARCHAR(200) | Profil | ❌ Non | Non |
| usage_before | VARCHAR(50) | Usage | ❌ Non | Non |
| usage_after | VARCHAR(50) | Usage | ❌ Non | Non |
| membership_fee | DECIMAL(10,2) | Financier | ✅ Oui | Non |
| membership_level | VARCHAR(20) | Administratif | ✅ Oui | Non |
| payment_method | VARCHAR(50) | Financier | ✅ Oui | Non |
| solidarity_proof_type | VARCHAR(50) | Justificatif | ❌ Non | ⚠️ Social |
| solidarity_proof_url | TEXT | Justificatif | ❌ Non | ⚠️ Social |
| password_hash | VARCHAR(255) | Authentification | Si admin | ⚠️ Technique |

**Consentements associés** :
- accepts_newsletter
- accepts_testimony_publication
- accepts_media_contact
- accepts_action_solicitation

**Volume estimé** : ~200-1000 membres

**⚠️ Données sensibles potentielles** :
- `solidarity_proof_type` et `solidarity_proof_url` : peuvent révéler une situation sociale précaire (RSA, AAH, chômage)

---

#### Table : `pre_members` (Pré-adhésions)

| Donnée | Type | Catégorie RGPD | Obligatoire | Sensible |
|--------|------|----------------|-------------|----------|
| first_name | VARCHAR(100) | Identité | ✅ Oui | Non |
| last_name | VARCHAR(100) | Identité | ✅ Oui | Non |
| email | VARCHAR(255) | Contact | ✅ Oui | Non |
| phone | VARCHAR(20) | Contact | ✅ Oui | Non |
| city | VARCHAR(100) | Localisation | ✅ Oui | Non |
| user_type | VARCHAR(50) | Profil | ✅ Oui | Non |
| wants_to_become_member | BOOLEAN | Engagement | ❌ Non | Non |
| wants_to_volunteer | BOOLEAN | Engagement | ❌ Non | Non |
| can_host_meeting | BOOLEAN | Engagement | ❌ Non | Non |
| can_distribute_flyers | BOOLEAN | Engagement | ❌ Non | Non |
| participation_areas | TEXT[] | Engagement | ❌ Non | Non |

**Consentements associés** :
- accepts_newsletter
- accepts_contact_when_created
- accepts_ag_invitation

**Volume estimé** : ~500-2000 soutiens (phase pré-création)

---

#### Table : `donations` (Dons)

| Donnée | Type | Catégorie RGPD | Obligatoire | Sensible |
|--------|------|----------------|-------------|----------|
| email | VARCHAR(255) | Contact | ✅ Oui | Non |
| first_name | VARCHAR(100) | Identité | ❌ Non | Non |
| last_name | VARCHAR(100) | Identité | ❌ Non | Non |
| amount | DECIMAL(10,2) | Financier | ✅ Oui | Non |
| payment_method | VARCHAR(50) | Financier | ✅ Oui | Non |

**Consentements associés** :
- accepts_newsletter

**Conservation** : 10 ans (obligation légale fiscale)

---

#### Table : `contact_messages` (Messages de contact)

⚠️ **Note** : Cette table n'existe pas dans le schéma SQL actuel. Les messages de contact sont probablement envoyés uniquement par email sans stockage en base.

**Données collectées via le formulaire de contact** :
- civility
- first_name
- last_name
- email
- phone (optionnel)
- subject
- message
- accepts_processing (consentement RGPD)

**Recommandation** : Créer une table `contact_messages` pour traçabilité et gestion des demandes.

---

#### Table : `incidents` (Signalements)

| Donnée | Type | Catégorie RGPD | Obligatoire | Sensible |
|--------|------|----------------|-------------|----------|
| email | VARCHAR(255) | Contact | ❌ Non | Non |
| incident_date | DATE | Événement | ✅ Oui | Non |
| incident_type | VARCHAR(50) | Événement | ✅ Oui | Non |
| description | TEXT | Contenu | ✅ Oui | Non |
| consequence | VARCHAR(50) | Impact | ❌ Non | Non |
| taxi_cost | DECIMAL(10,2) | Financier | ❌ Non | Non |

**Volume estimé** : ~50-200 incidents par an

---

#### Table : `downloads` (Tracking téléchargements)

| Donnée | Type | Catégorie RGPD | Obligatoire | Sensible |
|--------|------|----------------|-------------|----------|
| ip_address | INET | Connexion | ❌ Non | ⚠️ Oui |
| user_agent | TEXT | Connexion | ❌ Non | Non |
| country_code | VARCHAR(2) | Localisation | ❌ Non | Non |
| city | VARCHAR(100) | Localisation | ❌ Non | Non |

**⚠️ ATTENTION** :
- **L'adresse IP est une donnée personnelle** selon le RGPD
- Conservation limitée recommandée : 6 mois maximum
- Anonymisation ou pseudonymisation conseillée
- Base légale : intérêt légitime (statistiques) OU consentement requis

---

#### Table : `admin_users` (Administrateurs)

⚠️ **Note** : Les administrateurs sont stockés dans la table `members` avec le flag `is_admin = true`.

| Donnée | Type | Catégorie RGPD | Obligatoire | Sensible |
|--------|------|----------------|-------------|----------|
| email | VARCHAR(255) | Contact | ✅ Oui | Non |
| password_hash | VARCHAR(255) | Authentification | ✅ Oui | ⚠️ Oui |
| is_admin | BOOLEAN | Autorisation | ✅ Oui | Non |

**Sécurité** :
- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ JWT pour authentification (durée 7 jours)
- ✅ Cookies httpOnly, secure, sameSite

---

### 2.2 Catégorisation des données personnelles

| Catégorie | Exemples | Tables concernées |
|-----------|----------|-------------------|
| **Données d'identité** | Civilité, nom, prénom, date de naissance, âge | testimonies, members, pre_members, donations |
| **Données de contact** | Email, téléphone, adresse postale | Toutes les tables |
| **Données de localisation** | Ville, code postal, pays | testimonies, members, pre_members, downloads |
| **Données de profil** | Type d'usager, lycée, filière, lieu de travail | testimonies, members, pre_members |
| **Données financières** | Montant adhésion, montant don, mode de paiement | members, donations |
| **Données de contenu** | Témoignages, messages, incidents | testimonies, contact_messages, incidents |
| **Données de connexion** | Adresse IP, user agent, cookies | downloads, sessions admin |
| **Données d'authentification** | Mot de passe hashé, JWT | members (admins) |
| **Données sensibles potentielles** | Justificatifs sociaux (RSA, AAH), photos | members (solidarity_proof) |

---

## 3. Consentements collectés

### 3.1 Formulaire de témoignage

**Fichier** : `/pages/temoignages/nouveau.vue`

| Consentement | Type | Pré-coché | Obligatoire | Conforme RGPD |
|-------------|------|-----------|-------------|---------------|
| accepts_site_publication | Publication web | ✅ Oui (true) | ✅ Oui | ⚠️ **Non conforme** |
| accepts_legal_use | Usage juridique | ❌ Non | ❌ Non | ✅ Conforme |
| accepts_media_contact | Contact médias | ❌ Non | ❌ Non | ✅ Conforme |
| accepts_oral_testimony | Témoignage oral | ❌ Non | ❌ Non | ✅ Conforme |

**⚠️ PROBLÈME MAJEUR** :
```vue
accepts_site_publication: true,  // ❌ PRÉ-COCHÉ !
```

**Article 4(11) RGPD** : Le consentement doit être une **action positive claire**. Une case pré-cochée n'est PAS un consentement valide.

**Solution** :
```vue
accepts_site_publication: false,  // ✅ NON pré-coché
```

---

### 3.2 Formulaire d'adhésion

**Fichier** : `/pages/rejoindre/adherer.vue`

| Consentement | Type | Pré-coché | Obligatoire | Conforme RGPD |
|-------------|------|-----------|-------------|---------------|
| acceptsNewsletter | Newsletter | ❌ Non | ❌ Non | ✅ Conforme |
| acceptsTestimonyPublication | Publication témoignage | ❌ Non | ❌ Non | ✅ Conforme |
| acceptsMediaContact | Contact médias | ❌ Non | ❌ Non | ✅ Conforme |
| acceptsActionSolicitation | Sollicitation actions | ❌ Non | ❌ Non | ✅ Conforme |

**✅ Tous les consentements sont corrects** : cases non pré-cochées, finalités distinctes.

---

### 3.3 Formulaire de pré-adhésion

**Fichier** : `/pages/rejoindre/soutien.vue`

| Consentement | Type | Pré-coché | Obligatoire | Conforme RGPD |
|-------------|------|-----------|-------------|---------------|
| acceptsNewsletter | Newsletter | ❌ Non | ❌ Non | ✅ Conforme |
| acceptsContactWhenCreated | Contact création asso | ✅ Oui (true) | ❌ Non | ⚠️ **Non conforme** |
| acceptsAgInvitation | Invitation AG | ✅ Oui (true) | ❌ Non | ⚠️ **Non conforme** |

**⚠️ PROBLÈME** :
```vue
acceptsContactWhenCreated: true,  // ❌ PRÉ-COCHÉ
acceptsAgInvitation: true,        // ❌ PRÉ-COCHÉ
```

**Solution** :
```vue
acceptsContactWhenCreated: false,  // ✅ NON pré-coché
acceptsAgInvitation: false,        // ✅ NON pré-coché
```

---

### 3.4 Formulaire de contact

**Fichier** : `/pages/contact.vue`

| Consentement | Type | Pré-coché | Obligatoire | Conforme RGPD |
|-------------|------|-----------|-------------|---------------|
| acceptsProcessing | Traitement données contact | ❌ Non | ✅ Oui | ✅ Conforme |

**✅ Conforme** : case non pré-cochée, obligatoire pour soumettre le formulaire.

**Texte du consentement** :
```
J'accepte que mes données soient traitées par l'ADUL21 dans le cadre de ma demande de contact.
Ces données ne seront pas partagées avec des tiers.
```

**✅ Clair, spécifique et informé.**

---

### 3.5 Formulaire de don

**Fichier** : `/pages/rejoindre/don.vue` (non trouvé - probablement pas encore créé)

**Consentement attendu** :
- accepts_newsletter (optionnel)

---

### 3.6 Synthèse des problèmes de consentement

| Formulaire | Consentement | Problème | Priorité |
|-----------|-------------|----------|----------|
| Témoignage | accepts_site_publication | Pré-coché | 🔴 CRITIQUE |
| Pré-adhésion | acceptsContactWhenCreated | Pré-coché | 🟠 ÉLEVÉE |
| Pré-adhésion | acceptsAgInvitation | Pré-coché | 🟠 ÉLEVÉE |

**Impact** :
- Risque de **nullité des consentements**
- Risque de **sanction CNIL** (jusqu'à 4% du CA ou 20M€ pour les organisations, moins pour les associations)
- Risque de **perte de confiance** des utilisateurs

---

## 4. Droits des personnes

Le RGPD accorde 8 droits fondamentaux aux personnes concernées (Chapitre III du RGPD).

### 4.1 Droit d'accès (Article 15)

**Droit** : Obtenir la confirmation que ses données sont traitées + copie de celles-ci.

**Implémentation actuelle** : ❌ **Non implémenté**

**Ce qui devrait être fourni** :
- Confirmation du traitement
- Copie des données (format structuré : JSON, CSV)
- Finalités du traitement
- Catégories de données
- Destinataires des données
- Durée de conservation
- Existence des autres droits
- Droit de réclamation CNIL

**Solution technique** :
```typescript
// server/api/gdpr/access.post.ts
export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  // Rechercher dans toutes les tables
  const [member, testimony, preMember, donation] = await Promise.all([
    db.select().from(members).where(eq(members.email, email)),
    db.select().from(testimonies).where(eq(testimonies.email, email)),
    db.select().from(preMembers).where(eq(preMembers.email, email)),
    db.select().from(donations).where(eq(donations.email, email))
  ])

  // Anonymiser les données sensibles
  const data = {
    member: member.map(m => ({ ...m, password_hash: undefined })),
    testimony,
    preMember,
    donation
  }

  // Envoyer par email sécurisé
  await sendEmail(email, 'Vos données personnelles ADUL21', data)
})
```

**Délai de réponse** : 1 mois maximum (Article 12.3)

---

### 4.2 Droit de rectification (Article 16)

**Droit** : Corriger des données inexactes ou incomplètes.

**Implémentation actuelle** : ⚠️ **Partielle**
- ✅ Possible pour les admins (backend)
- ❌ Pas d'interface utilisateur pour les personnes concernées

**Solution** :
- Créer un formulaire de demande de rectification
- Validation manuelle par un admin
- Notification de la modification

---

### 4.3 Droit à l'effacement - "Droit à l'oubli" (Article 17)

**Droit** : Supprimer ses données dans certains cas.

**Implémentation actuelle** : ❌ **Non implémenté**

**Cas de suppression obligatoire** :
1. Données plus nécessaires
2. Retrait du consentement (témoignages, newsletter)
3. Opposition au traitement
4. Traitement illicite

**Exceptions** :
- ❌ Dons : conservation 10 ans (obligation légale)
- ❌ Adhésions : conservation 3 ans après fin (obligation comptable)

**Solution technique** :
```typescript
// server/api/gdpr/delete.post.ts
export default defineEventHandler(async (event) => {
  const { email, type } = await readBody(event)

  if (type === 'testimony') {
    // Supprimer témoignage (si consentement révoqué)
    await db.delete(testimonies).where(eq(testimonies.email, email))
  }

  if (type === 'pre_member') {
    // Supprimer pré-adhésion (si non converti en membre)
    await db.delete(preMembers).where(eq(preMembers.email, email))
  }

  if (type === 'newsletter') {
    // Désabonnement newsletter
    await updateNewsletterStatus(email, false)
  }

  // NE PAS supprimer : members, donations (obligations légales)
})
```

---

### 4.4 Droit à la limitation (Article 18)

**Droit** : "Geler" le traitement des données (ne plus les utiliser, mais les conserver).

**Cas d'application** :
- Contestation de l'exactitude (pendant vérification)
- Traitement illicite mais personne s'oppose à suppression
- Données plus nécessaires mais personne les veut pour action en justice
- En attente de vérification de l'opposition

**Implémentation actuelle** : ❌ **Non implémenté**

**Solution** : Ajouter un champ `processing_limited` (BOOLEAN) dans chaque table.

---

### 4.5 Droit à la portabilité (Article 20)

**Droit** : Récupérer ses données dans un format structuré, couramment utilisé et lisible par machine.

**Implémentation actuelle** : ❌ **Non implémenté**

**Formats recommandés** :
- JSON (lisible par machine)
- CSV (lisible humain + machine)
- XML

**Solution** :
```typescript
// server/api/gdpr/portability.post.ts
export default defineEventHandler(async (event) => {
  const { email, format } = await readBody(event)

  const data = await getAllUserData(email)

  if (format === 'json') {
    return data  // JSON natif
  }

  if (format === 'csv') {
    return convertToCSV(data)
  }
})
```

---

### 4.6 Droit d'opposition (Article 21)

**Droit** : S'opposer au traitement pour des raisons tenant à sa situation particulière.

**Implémentation actuelle** : ⚠️ **Partielle**
- ✅ Opposition newsletter : possible (désinscription)
- ❌ Opposition autres traitements : non implémenté

**Solution** :
- Créer un formulaire d'opposition
- Évaluer au cas par cas (sauf newsletter = opposition absolue)

---

### 4.7 Droit de retirer son consentement (Article 7.3)

**Droit** : Retirer son consentement à tout moment.

**Implémentation actuelle** : ⚠️ **Partielle**
- ❌ Pas de lien de désinscription newsletter
- ❌ Pas de révocation témoignage

**Solution** :
- Ajouter lien "Se désabonner" dans emails newsletter
- Créer page `/desabonnement` avec formulaire
- Permettre retrait consentement témoignage (dépublication)

---

### 4.8 Droits liés aux décisions automatisées (Article 22)

**Non applicable** : ADUL21 n'utilise pas de profilage ni de décision automatisée.

---

### 4.9 Tableau récapitulatif des droits

| Droit | Implémenté | Délai réponse | Priorité |
|-------|-----------|---------------|----------|
| Accès | ❌ Non | 1 mois | 🔴 CRITIQUE |
| Rectification | ⚠️ Partiel | 1 mois | 🟠 ÉLEVÉE |
| Effacement | ❌ Non | 1 mois | 🔴 CRITIQUE |
| Limitation | ❌ Non | 1 mois | 🟡 MOYENNE |
| Portabilité | ❌ Non | 1 mois | 🟡 MOYENNE |
| Opposition | ⚠️ Partiel | 1 mois | 🟠 ÉLEVÉE |
| Retrait consentement | ⚠️ Partiel | Immédiat | 🔴 CRITIQUE |
| Réclamation CNIL | ✅ Oui (info) | - | ✅ OK |

---

### 4.10 Procédure de demande d'exercice de droits

**Actuel** :
- Email à : assoligne21@gmail.com
- Objet : "Exercice de mes droits RGPD"
- Pièce d'identité requise

**✅ Conforme** : Procédure claire, gratuite, délai 1 mois.

**Recommandation** : Créer un formulaire dédié `/mes-droits-rgpd` pour faciliter les demandes.

---

## 5. Durée de conservation

**Principe** : Les données ne doivent pas être conservées plus longtemps que nécessaire (Article 5.1.e du RGPD).

### 5.1 Durées définies dans la politique de confidentialité

| Type de données | Durée selon politique | Base légale | Conforme |
|----------------|----------------------|-------------|----------|
| Adhérents actifs | Durée adhésion + 1 an | Contrat | ✅ Oui |
| Anciens adhérents | 3 ans après fin adhésion | Obligation comptable | ✅ Oui |
| Témoignages publiés | Jusqu'à retrait consentement ou dissolution asso | Consentement | ⚠️ Vague |
| Messages de contact | 1 an après dernière interaction | Consentement | ✅ Oui |
| Dons | 10 ans | Obligation légale (fiscale) | ✅ Oui |
| Documents comptables | 10 ans | Obligation légale | ✅ Oui |

### 5.2 Durées recommandées (meilleures pratiques)

| Type de données | Durée recommandée | Raison |
|----------------|-------------------|--------|
| Pré-adhérents non convertis | 2 ans | Prescription civile |
| Témoignages NON publiés (rejetés) | 1 an | Archivage minimal |
| Témoignages publiés | Durée action juridique + 5 ans MAX | Limitation proportionnelle |
| Newsletter (inactifs) | 3 ans sans interaction | Présomption d'abandon |
| Logs serveur | 6 mois | CNIL recommande 6-12 mois |
| Logs IP (downloads) | 6 mois | CNIL recommande 6 mois |
| Incidents signalés | 3 ans | Prescription action civile |

### 5.3 Implémentation technique de la purge

**Actuel** : ❌ **Aucun mécanisme de purge automatique**

**Recommandation** : Créer un script de purge automatique (cron job).

**Exemple** :
```typescript
// server/cron/gdpr-purge.ts

// Tous les mois, supprimer :
// - Pré-adhérents non convertis > 2 ans
// - Témoignages rejetés > 1 an
// - Logs IP > 6 mois
// - Newsletter inactifs > 3 ans

async function purgeOldData() {
  const twoYearsAgo = new Date()
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

  // Pré-adhérents
  await db.delete(preMembers)
    .where(and(
      eq(preMembers.converted_to_member, false),
      lt(preMembers.created_at, twoYearsAgo)
    ))

  // Logs IP
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  await db.delete(downloads)
    .where(lt(downloads.created_at, sixMonthsAgo))
}
```

---

## 6. Sécurité des données

**Principe** : Garantir un niveau de sécurité approprié au risque (Article 32 RGPD).

### 6.1 Mesures techniques implémentées

#### 6.1.1 Chiffrement en transit

**HTTPS** : ✅ **Implémenté**
- Certificat SSL/TLS
- Toutes les communications client-serveur chiffrées
- Force HTTPS (redirections)

**Protocole** : TLS 1.2 minimum recommandé, TLS 1.3 idéal.

#### 6.1.2 Chiffrement au repos

**Base de données** : ⚠️ **À vérifier**
- PostgreSQL supporte le chiffrement au repos (Transparent Data Encryption)
- **Action** : Vérifier si activé sur le serveur de production

**Fichiers** : ⚠️ **À vérifier**
- Justificatifs de solidarité (`solidarity_proof_url`)
- Photos témoignages (`photo_url`)

**Recommandation** : Chiffrer les fichiers sensibles ou utiliser un stockage cloud chiffré (AWS S3 avec KMS, etc.).

#### 6.1.3 Hachage des mots de passe

**Algorithme** : ✅ **bcrypt** (excellent choix)

**Fichier** : `/server/utils/hash.ts`
```typescript
import bcrypt from 'bcrypt'
const SALT_ROUNDS = 10  // ✅ Bon niveau (2^10 = 1024 itérations)

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
```

**✅ Sécurisé** :
- bcrypt résiste aux attaques par force brute
- 10 rounds = bon compromis performance/sécurité
- Salage automatique

**Recommandation** : Passer à 12 rounds pour une sécurité renforcée (en 2025).

#### 6.1.4 Authentification et sessions

**JWT** : ✅ **Implémenté**

**Fichier** : `/server/utils/jwt.ts`
```typescript
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-me'
const JWT_EXPIRES_IN = '7d'  // 7 jours

setCookie(event, 'admin_token', token, {
  httpOnly: true,          // ✅ Protection XSS
  secure: production,      // ✅ HTTPS uniquement en prod
  sameSite: 'lax',        // ✅ Protection CSRF
  maxAge: 7 * 24 * 60 * 60, // 7 jours
  path: '/'
})
```

**✅ Sécurisé** :
- `httpOnly: true` : empêche JavaScript d'accéder au cookie (protection XSS)
- `secure: true` : cookie transmis uniquement en HTTPS
- `sameSite: 'lax'` : protection contre CSRF

**⚠️ ATTENTION** :
```typescript
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-me'
```

**Risque** : Si `JWT_SECRET` n'est pas défini, une clé par défaut faible est utilisée.

**Solution** : Forcer l'erreur si `JWT_SECRET` absent :
```typescript
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in environment variables')
}
const JWT_SECRET = process.env.JWT_SECRET
```

#### 6.1.5 Protection contre les injections SQL

**ORM** : ✅ **Drizzle ORM**
- Requêtes paramétrées automatiques
- Protection contre SQL injection

**Exemple** :
```typescript
// ✅ SÉCURISÉ
await db.select().from(members).where(eq(members.email, userEmail))

// ❌ DANGEREUX (à éviter)
await db.execute(sql`SELECT * FROM members WHERE email = '${userEmail}'`)
```

#### 6.1.6 Protection contre XSS

**Frontend** : ✅ **Vue.js / Nuxt**
- Échappement automatique des variables
- `v-html` non utilisé (sauf si nécessaire)

**Validation** : ⚠️ **À renforcer**
- Valider les entrées utilisateur (témoignages, messages)
- Limiter les caractères autorisés

#### 6.1.7 Limitation de débit (Rate limiting)

**Actuel** : ❌ **Non implémenté**

**Risque** : Attaques par force brute, spam de formulaires.

**Solution** : Implémenter rate limiting avec `nuxt-rate-limit` ou middleware personnalisé.

**Exemple** :
```typescript
// server/middleware/rate-limit.ts
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requêtes max
})
```

#### 6.1.8 Logs d'accès et d'audit

**Actuel** : ⚠️ **Partiel**
- Logs serveur (Nuxt/Nitro)
- Pas de logs métier (qui a accédé à quoi ?)

**Recommandation** :
- Logger les accès administrateurs (qui consulte quelles données)
- Logger les modifications (qui modifie quoi, quand)
- Anonymiser les logs après 6 mois (supprimer IP)

**Exemple** :
```typescript
// server/utils/audit.ts
export async function logAdminAction(userId: string, action: string, details: any) {
  await db.insert(auditLogs).values({
    userId,
    action,
    details: JSON.stringify(details),
    timestamp: new Date(),
    ip_address: getClientIP(event)  // Anonymiser après 6 mois
  })
}
```

### 6.2 Mesures organisationnelles

#### 6.2.1 Accès restreint

**Admins** : ✅ Authentification par JWT
**Membres bureau** : Définir clairement qui a accès à quoi

**Recommandation** :
- Principe du moindre privilège (chacun accède uniquement à ce dont il a besoin)
- Rôles différenciés (admin, modérateur, trésorier, etc.)

#### 6.2.2 Politique de mots de passe

**Actuel** : ⚠️ **Non documenté**

**Recommandation** :
- Minimum 12 caractères
- Mélange majuscules, minuscules, chiffres, symboles
- Pas de mots du dictionnaire
- Changement annuel
- Utiliser un gestionnaire de mots de passe (Bitwarden, KeePass)

#### 6.2.3 Sauvegardes

**Actuel** : ⚠️ **Non documenté**

**Recommandation RGPD** :
- Sauvegardes régulières (quotidiennes)
- Chiffrement des sauvegardes
- Stockage sécurisé (hors site)
- Test de restauration régulier

#### 6.2.4 Formation et sensibilisation

**Actuel** : ❌ **Non implémenté**

**Recommandation** :
- Former les admins au RGPD
- Sensibiliser au phishing
- Procédures de sécurité documentées

---

### 6.3 Tableau récapitulatif sécurité

| Mesure | Statut | Priorité | Conforme RGPD |
|--------|--------|----------|---------------|
| HTTPS (TLS) | ✅ OK | - | ✅ Oui |
| Chiffrement BDD au repos | ⚠️ À vérifier | 🟠 Élevée | ⚠️ Variable |
| Hachage mots de passe (bcrypt) | ✅ OK | - | ✅ Oui |
| JWT sécurisé | ✅ OK | - | ✅ Oui |
| Protection SQL injection | ✅ OK (ORM) | - | ✅ Oui |
| Protection XSS | ✅ OK (Vue) | - | ✅ Oui |
| Rate limiting | ❌ Absent | 🟡 Moyenne | ⚠️ Recommandé |
| Logs d'audit admin | ⚠️ Partiel | 🟠 Élevée | ⚠️ Recommandé |
| Sauvegardes chiffrées | ⚠️ Non documenté | 🔴 Critique | ✅ Obligatoire |
| Politique mots de passe | ❌ Absent | 🟡 Moyenne | ⚠️ Recommandé |

---

## 7. Transferts de données

**Principe** : Les transferts de données hors UE sont strictement encadrés (Chapitre V RGPD).

### 7.1 Hébergement et infrastructure

#### 7.1.1 Hébergement web

**Actuel** : ⚠️ **Non documenté dans le code**

**Mentions légales** : "Hébergeur à compléter"

**Recommandations** :
- ✅ **OVH France** : serveurs en France, conforme RGPD
- ✅ **Scaleway** : français, serveurs UE
- ✅ **Hetzner** : allemand, serveurs UE
- ⚠️ **AWS Europe** : acceptable si région UE (eu-west-3 Paris)
- ❌ **US-based hosts** : nécessite clauses contractuelles types (CCT)

**Action** : Documenter l'hébergeur actuel dans les mentions légales.

#### 7.1.2 Base de données PostgreSQL

**Localisation** : ⚠️ **À confirmer**

**Politique de confidentialité** : "Serveurs hébergés en France"

**Action** : Vérifier que la base est bien hébergée en France/UE.

### 7.2 Services tiers (sous-traitants)

#### 7.2.1 Gmail SMTP (Google)

**Utilisation** : Envoi d'emails transactionnels

**Fichier** : `.env.example`
```env
GMAIL_USER=assoligne21@gmail.com
GMAIL_APP_PASSWORD=
EMAIL_FROM=ADUL21 <assoligne21@gmail.com>
```

**Localisation serveurs** : ⚠️ **États-Unis** (Google LLC)

**Conformité RGPD** :
- ✅ Google a signé les **Clauses Contractuelles Types (CCT)** de l'UE
- ✅ Décision d'adéquation partielle UE-USA (Data Privacy Framework 2023)
- ⚠️ Surveillance US (FISA, CLOUD Act) : risque résiduel

**Recommandations** :
1. **Court terme** : Acceptable avec CCT Google
2. **Long terme** : Migrer vers un fournisseur email UE :
   - **Brevo** (ex-Sendinblue) : français, serveurs UE
   - **Mailjet** : français, serveurs UE
   - **OVH Mail** : français, serveurs France

**Données transférées** :
- Adresses email destinataires
- Contenu des emails (confirmations, notifications)
- Métadonnées (date, sujet)

**Volume** : ~1000-5000 emails/mois estimé

#### 7.2.2 Plausible Analytics

**Utilisation** : Statistiques de fréquentation

**Fichier** : `nuxt.config.ts`
```typescript
script: [
  {
    defer: true,
    'data-domain': 'adul21.fr',
    src: 'https://plausible.io/js/script.js'
  }
]
```

**Localisation serveurs** : ✅ **Union Européenne** (Allemagne)

**Conformité RGPD** :
- ✅ **100% conforme RGPD**
- ✅ Pas de cookies
- ✅ Pas d'adresse IP collectée
- ✅ Données anonymes
- ✅ Pas de consentement requis (CNIL)

**✅ Aucun problème.**

#### 7.2.3 Stripe (paiements)

**Utilisation** : Paiements adhésions et dons (futur)

**Fichier** : `.env.example`
```env
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

**Localisation** : ⚠️ **États-Unis** (Stripe Inc.)

**Conformité RGPD** :
- ✅ Stripe a signé les **Clauses Contractuelles Types**
- ✅ Certifié **PCI DSS** (sécurité cartes bancaires)
- ✅ Décision d'adéquation UE-USA (Data Privacy Framework)

**Données transférées** :
- Nom, prénom
- Email
- Montant transaction
- Numéro carte (hashé côté Stripe, jamais stocké par ADUL21)

**Recommandations** :
- ✅ **Acceptable** : Stripe est le standard de facto, très sécurisé
- Alternative UE : **GoCardless** (UK, mais moins complet)

#### 7.2.4 Résumé des transferts

| Service | Pays | Transfert hors UE | Garanties | Conforme |
|---------|------|-------------------|-----------|----------|
| **Hébergement web** | France (à confirmer) | ❌ Non | - | ✅ Oui |
| **PostgreSQL** | France (à confirmer) | ❌ Non | - | ✅ Oui |
| **Gmail SMTP** | USA | ✅ Oui | CCT Google | ⚠️ Acceptable |
| **Plausible Analytics** | Allemagne (UE) | ❌ Non | - | ✅ Oui |
| **Stripe** | USA | ✅ Oui | CCT Stripe + PCI DSS | ⚠️ Acceptable |

**Actions** :
1. Documenter tous les sous-traitants dans un **registre des sous-traitants**
2. Signer des **DPA (Data Processing Agreements)** avec chaque sous-traitant
3. Informer les utilisateurs des transferts hors UE (✅ déjà fait dans politique de confidentialité)

---

## 8. Cookies et tracking

**Principe** : Les cookies nécessitent un consentement (ePrivacy + RGPD).

### 8.1 Cookies utilisés

#### 8.1.1 Cookies fonctionnels (exemptés de consentement)

| Cookie | Nom | Durée | Finalité | Consentement requis |
|--------|-----|-------|----------|---------------------|
| **Session admin** | `admin_token` | 7 jours | Authentification administrateurs | ❌ Non (strictement nécessaire) |

**Propriétés** :
```typescript
httpOnly: true,   // ✅ Protection XSS
secure: true,     // ✅ HTTPS only
sameSite: 'lax'   // ✅ Protection CSRF
```

**Article 82 Loi Informatique et Libertés** : Les cookies strictement nécessaires à la fourniture d'un service demandé sont **exemptés de consentement**.

#### 8.1.2 Cookies analytics

**Plausible Analytics** : ✅ **N'utilise AUCUN cookie**

**Avantages** :
- Pas de banner cookies nécessaire
- Conforme RGPD sans consentement
- Recommandé par la CNIL

### 8.2 Banner de consentement cookies

**Actuel** : ❌ **Aucun banner**

**Analyse** :
- ✅ Plausible n'utilise pas de cookies → pas de consentement requis
- ✅ Cookie `admin_token` strictement nécessaire → exempté

**Conclusion** : **PAS de banner cookies nécessaire** pour ADUL21 ! ✅

**Recommandation** : Ajouter une mention dans la politique de confidentialité :
```
Ce site n'utilise PAS de cookies publicitaires ou de tracking.
Le seul cookie déposé est un cookie de session technique, strictement nécessaire
à l'authentification des administrateurs (exempté de consentement selon l'article 82
de la loi Informatique et Libertés).
```

---

## 9. Documentation RGPD

### 9.1 Politique de confidentialité

**Fichier** : `/pages/politique-confidentialite.vue`

**✅ Très complète** : 693 lignes, 10 sections

**Contenu** :
1. ✅ Responsable du traitement
2. ✅ Données collectées (détaillées par formulaire)
3. ✅ Finalités du traitement
4. ✅ Destinataires (sous-traitants)
5. ✅ Durée de conservation (tableau)
6. ✅ Sécurité des données (6 mesures listées)
7. ✅ Droits des personnes (8 droits expliqués)
8. ✅ Réclamation CNIL
9. ✅ Modifications de la politique
10. ✅ Contact RGPD

**Points forts** :
- Langage clair et accessible
- Structurée avec icônes et couleurs
- Exemples concrets
- Liens vers CNIL

**Points à améliorer** :
- ⚠️ Date de mise à jour générée dynamiquement → figer une vraie date
- ⚠️ Ajouter version (actuellement "Version 1.0")
- ⚠️ Préciser l'hébergeur (actuellement vide)

### 9.2 Mentions légales

**Fichier** : `/pages/mentions-legales.vue`

**✅ Complète** : 362 lignes, 10 sections

**Contenu** :
1. ✅ Éditeur du site
2. ✅ Directeur de publication
3. ⚠️ Hébergement (informations à compléter)
4. ✅ Propriété intellectuelle
5. ✅ Protection des données personnelles (renvoie vers politique)
6. ✅ Cookies et mesure d'audience (Plausible)
7. ✅ Liens hypertextes
8. ✅ Limitation de responsabilité
9. ✅ Droit applicable
10. ✅ Crédits

**Points à compléter** :
- ⚠️ Adresse du siège social
- ⚠️ Numéro SIRET
- ⚠️ Nom et coordonnées de l'hébergeur

### 9.3 Registre des traitements (Article 30 RGPD)

**Actuel** : ❌ **Non créé**

**Obligatoire** : Oui, pour toutes les organisations (même petites associations).

**Contenu requis** :
- Nom du traitement
- Finalités
- Catégories de personnes concernées
- Catégories de données
- Destinataires
- Transferts hors UE
- Durée de conservation
- Mesures de sécurité

**Solution** : Créer `/docs/registre-traitements-rgpd.md` ou utiliser un tableur.

**Exemple de structure** :

| Traitement | Finalité | Données | Base légale | Durée | Destinataires |
|-----------|----------|---------|-------------|-------|---------------|
| Témoignages | Publication témoignages impacts ligne 21 | Nom, prénom, email, témoignage | Consentement | Jusqu'à retrait | ADUL21, hébergeur |
| Adhésions | Gestion membres association | Nom, prénom, email, adresse, cotisation | Contrat | Durée adhésion + 3 ans | ADUL21, hébergeur |
| Pré-adhésions | Base mobilisation avant création asso | Nom, prénom, email, téléphone | Consentement | 2 ans | ADUL21, hébergeur, Gmail |
| Dons | Gestion dons et reçus fiscaux | Nom, prénom, email, montant | Obligation légale | 10 ans | ADUL21, hébergeur |
| Newsletter | Envoi actualités mobilisation | Email | Consentement | Jusqu'à désinscription | ADUL21, Gmail |
| Contact | Réponse demandes d'information | Nom, email, message | Consentement | 1 an | ADUL21, Gmail |
| Incidents | Collecte incidents transports | Email, description incident | Consentement | 3 ans | ADUL21 |
| Downloads | Statistiques téléchargements | IP, user agent | Intérêt légitime | 6 mois | ADUL21 |
| Admin | Authentification administrateurs | Email, mot de passe hashé | Intérêt légitime | Durée mandat | ADUL21 |

### 9.4 Analyse d'impact (PIA - Privacy Impact Assessment)

**Obligatoire si** (Article 35 RGPD) :
- Traitement à grande échelle de données sensibles
- Surveillance systématique à grande échelle
- Profilage avec effets juridiques

**Pour ADUL21** : ❌ **Non obligatoire** (pas de données sensibles à grande échelle, pas de profilage)

**⚠️ ATTENTION** :
- `solidarity_proof_url` (justificatifs RSA, AAH) = données **potentiellement sensibles**
- Si collecte à grande échelle (>1000 justificatifs) → PIA recommandée

**Recommandation** : Réaliser une PIA si plus de 500 adhérents avec justificatifs sociaux.

---

## 10. DPO et contact

### 10.1 Délégué à la Protection des Données (DPO)

**Obligation de désigner un DPO** (Article 37 RGPD) si :
1. Autorité publique (sauf juridictions)
2. Traitement à grande échelle de données sensibles
3. Surveillance systématique à grande échelle

**Pour ADUL21** : ❌ **Non obligatoire**
- Association loi 1901 (pas autorité publique)
- Pas de traitement à grande échelle
- Pas de surveillance systématique

**Recommandation** : Désigner un **référent RGPD** (membre du bureau) même si pas obligatoire.

**Rôle du référent RGPD** :
- Point de contact pour questions RGPD
- Veille à la conformité
- Traite les demandes d'exercice de droits
- Interface avec CNIL si besoin

### 10.2 Contact pour exercice des droits

**Actuel** : ✅ **Clairement indiqué**

**Email** : assoligne21@gmail.com
**Objet** : "Exercice de mes droits RGPD" ou "Données personnelles"

**Délai de réponse** : ✅ 1 mois (conforme Article 12.3)

**Recommandation** : Créer une adresse email dédiée `rgpd@adul21.fr` pour faciliter le tri.

---

## 11. Violations de données

**Obligation** (Article 33 RGPD) : Notification CNIL sous **72 heures** en cas de violation de données.

### 11.1 Procédure en cas de violation

**Actuel** : ❌ **Non documentée**

**Recommandation** : Créer une procédure écrite.

**Exemple de procédure** :

1. **Détection** (1h)
   - Qui détecte : admin, alerte serveur, signalement utilisateur
   - Vérifier la nature de la violation

2. **Confinement** (2h)
   - Isoler le système compromis
   - Changer mots de passe
   - Bloquer accès si nécessaire

3. **Évaluation** (6h)
   - Quelles données sont concernées ?
   - Combien de personnes ?
   - Quel risque pour les droits et libertés ?

4. **Notification CNIL** (72h)
   - Si risque pour les droits : notification obligatoire
   - Formulaire : https://www.cnil.fr/fr/notifier-une-violation-de-donnees-personnelles
   - Contenu : nature, catégories, nombre de personnes, conséquences, mesures prises

5. **Notification personnes concernées** (72h)
   - Si risque élevé : informer directement les personnes
   - Email personnalisé + recommandations (changer MDP, surveiller comptes)

6. **Correction** (1 semaine)
   - Corriger la faille
   - Renforcer la sécurité
   - Documenter l'incident

7. **Documentation** (permanent)
   - Tenir un registre des violations (même si pas notifiées CNIL)

### 11.2 Exemples de violations

| Scénario | Gravité | Notification CNIL | Notification personnes |
|----------|---------|-------------------|----------------------|
| Fuite 10 emails | 🟡 Faible | ❌ Non | ❌ Non |
| Fuite 500 emails + noms | 🟠 Moyenne | ✅ Oui | ❌ Non (si risque faible) |
| Fuite base complète (noms, adresses, téléphones) | 🔴 Élevée | ✅ Oui | ✅ Oui |
| Fuite mots de passe non hashés | 🔴 Critique | ✅ Oui | ✅ Oui |
| Fuite justificatifs sociaux | 🔴 Critique | ✅ Oui | ✅ Oui |
| Ransomware chiffrant la BDD | 🔴 Critique | ✅ Oui | ✅ Oui |

### 11.3 Registre des violations

**Obligatoire** (Article 33.5) : Documenter TOUTES les violations, même non notifiées.

**Contenu** :
- Date et heure
- Nature de la violation
- Données concernées
- Nombre de personnes
- Conséquences probables
- Mesures prises
- Notification CNIL (oui/non)
- Notification personnes (oui/non)

**Format** : Tableur ou document `/docs/registre-violations.md`

---

## 12. Évaluation de conformité

### 12.1 Grille d'évaluation RGPD

| Exigence RGPD | Statut | Priorité | Notes |
|---------------|--------|----------|-------|
| **1. Bases légales** | | | |
| Bases légales identifiées | ✅ Oui | - | Consentement, contrat, obligation légale |
| Consentements valides (non pré-cochés) | ⚠️ Partiel | 🔴 CRITIQUE | 3 cases pré-cochées à corriger |
| Information claire avant collecte | ✅ Oui | - | Politique de confidentialité complète |
| **2. Droits des personnes** | | | |
| Droit d'accès | ❌ Non | 🔴 CRITIQUE | Procédure email uniquement |
| Droit de rectification | ⚠️ Partiel | 🟠 Élevée | Possible via admin uniquement |
| Droit à l'effacement | ❌ Non | 🔴 CRITIQUE | Pas implémenté |
| Droit à la portabilité | ❌ Non | 🟡 Moyenne | Pas implémenté |
| Droit d'opposition | ⚠️ Partiel | 🟠 Élevée | Newsletter OK, autres non |
| Retrait consentement | ⚠️ Partiel | 🔴 CRITIQUE | Pas de lien désinscription |
| Information sur droits | ✅ Oui | - | Détaillés dans politique |
| Délai réponse 1 mois | ✅ Oui | - | Documenté |
| **3. Durée de conservation** | | | |
| Durées définies | ✅ Oui | - | Tableau dans politique |
| Purge automatique | ❌ Non | 🟠 Élevée | Pas de cron job |
| **4. Sécurité** | | | |
| HTTPS | ✅ Oui | - | TLS actif |
| Chiffrement BDD | ⚠️ À vérifier | 🟠 Élevée | Dépend hébergeur |
| Hachage mots de passe | ✅ Oui | - | bcrypt 10 rounds |
| JWT sécurisé | ✅ Oui | - | httpOnly, secure, sameSite |
| Protection injections SQL | ✅ Oui | - | ORM Drizzle |
| Rate limiting | ❌ Non | 🟡 Moyenne | Force brute possible |
| Logs d'audit | ⚠️ Partiel | 🟠 Élevée | Pas de logs métier |
| Sauvegardes | ⚠️ Non documenté | 🔴 CRITIQUE | À vérifier |
| **5. Transferts données** | | | |
| Inventaire sous-traitants | ⚠️ Partiel | 🟠 Élevée | Documenter dans registre |
| Garanties transferts hors UE | ✅ Oui | - | CCT Google, Stripe |
| Information transferts | ✅ Oui | - | Dans politique |
| **6. Documentation** | | | |
| Politique de confidentialité | ✅ Oui | - | Très complète |
| Mentions légales | ⚠️ Partiel | 🟠 Élevée | Hébergeur à compléter |
| Registre des traitements | ❌ Non | 🔴 CRITIQUE | Obligatoire |
| Procédure violations | ❌ Non | 🟠 Élevée | À créer |
| **7. Cookies** | | | |
| Banner cookies | ✅ N/A | - | Pas nécessaire (Plausible sans cookies) |
| Cookies strictement nécessaires uniquement | ✅ Oui | - | Session admin uniquement |

### 12.2 Score de conformité RGPD

**Méthodologie** :
- ✅ Oui = 1 point
- ⚠️ Partiel = 0.5 point
- ❌ Non = 0 point

**Calcul** :
- Points obtenus : **15.5** / 30
- **Score de conformité : 52%** ⚠️

**Interprétation** :
- 0-30% : ⚠️ Non conforme (risque élevé)
- 30-60% : ⚠️ Partiellement conforme (travail nécessaire)
- 60-80% : ✅ Largement conforme (amélioration continue)
- 80-100% : ✅ Pleinement conforme (excellent)

**Verdict** : ADUL21 est **partiellement conforme** au RGPD. Des efforts significatifs sont nécessaires, mais les bases sont solides (politique de confidentialité, sécurité technique).

---

## 13. Recommandations et plan d'action

### 13.1 Actions CRITIQUES (à faire immédiatement)

| Action | Priorité | Impact | Difficulté | Délai |
|--------|----------|--------|------------|-------|
| **1. Corriger consentements pré-cochés** | 🔴 CRITIQUE | Élevé | Faible | 1 jour |
| **2. Créer registre des traitements** | 🔴 CRITIQUE | Élevé | Moyenne | 1 semaine |
| **3. Implémenter droit d'accès** | 🔴 CRITIQUE | Élevé | Moyenne | 2 semaines |
| **4. Implémenter droit à l'effacement** | 🔴 CRITIQUE | Élevé | Moyenne | 2 semaines |
| **5. Vérifier sauvegardes** | 🔴 CRITIQUE | Élevé | Faible | 1 jour |
| **6. Ajouter lien désinscription newsletter** | 🔴 CRITIQUE | Moyen | Faible | 1 jour |

#### Détail Action 1 : Corriger consentements pré-cochés

**Fichiers à modifier** :

**1. `/pages/temoignages/nouveau.vue`**
```vue
// AVANT (ligne 592)
accepts_site_publication: true,  // ❌ PRÉ-COCHÉ

// APRÈS
accepts_site_publication: false,  // ✅ NON pré-coché
```

**2. `/pages/rejoindre/soutien.vue`**
```vue
// AVANT (lignes 351, 352, 358, 359)
wantsToBecomeMember: true,         // ❌ PRÉ-COCHÉ
acceptsContactWhenCreated: true,   // ❌ PRÉ-COCHÉ
acceptsAgInvitation: true          // ❌ PRÉ-COCHÉ

// APRÈS
wantsToBecomeMember: false,        // ✅ NON pré-coché
acceptsContactWhenCreated: false,  // ✅ NON pré-coché
acceptsAgInvitation: false         // ✅ NON pré-coché
```

**Impact** : Conformité RGPD immédiate sur les consentements.

---

#### Détail Action 2 : Créer registre des traitements

**Format** : Utiliser le tableau proposé en section 9.3.

**Emplacement** : `/docs/registre-traitements-rgpd.md`

**Contenu** : 9 traitements identifiés.

**Mise à jour** : Réviser tous les 6 mois ou lors de nouveaux traitements.

---

#### Détail Action 3 : Implémenter droit d'accès

**Créer** : `server/api/gdpr/access.post.ts`

**Fonctionnement** :
1. Utilisateur envoie email via formulaire `/mes-droits-rgpd`
2. Vérification identité (email de confirmation + pièce d'identité)
3. Export données au format JSON
4. Envoi par email sécurisé (chiffré si possible)

**Délai** : 1 mois maximum.

---

#### Détail Action 4 : Implémenter droit à l'effacement

**Créer** : `server/api/gdpr/delete.post.ts`

**Règles** :
- ✅ Supprimer : témoignages (si retrait consentement), pré-adhésions (si non converti), newsletter
- ❌ Conserver : membres (3 ans), dons (10 ans)

**Processus** :
1. Demande via formulaire
2. Vérification identité
3. Évaluation manuelle (admin)
4. Suppression ou anonymisation
5. Confirmation par email

---

#### Détail Action 5 : Vérifier sauvegardes

**Actions** :
1. Confirmer fréquence sauvegardes (quotidiennes recommandées)
2. Vérifier chiffrement sauvegardes
3. Tester restauration (1x/trimestre)
4. Documenter procédure

---

#### Détail Action 6 : Lien désinscription newsletter

**Modifier tous les templates emails** : Ajouter en pied de page :
```html
<p style="font-size: 12px; color: #666;">
  Vous recevez cet email car vous êtes inscrit à la newsletter ADUL21.
  <a href="https://adul21.fr/desabonnement?email={{email}}&token={{token}}">
    Se désabonner
  </a>
</p>
```

**Créer** : `/pages/desabonnement.vue` + `server/api/newsletter/unsubscribe.post.ts`

---

### 13.2 Actions ÉLEVÉES (à faire sous 1 mois)

| Action | Priorité | Impact | Difficulté | Délai |
|--------|----------|--------|------------|-------|
| **7. Compléter mentions légales** | 🟠 Élevée | Moyen | Faible | 1 jour |
| **8. Implémenter purge automatique** | 🟠 Élevée | Moyen | Moyenne | 1 semaine |
| **9. Créer logs d'audit admin** | 🟠 Élevée | Moyen | Moyenne | 1 semaine |
| **10. Vérifier chiffrement BDD** | 🟠 Élevée | Élevé | Faible | 1 jour |
| **11. Documenter sous-traitants + DPA** | 🟠 Élevée | Moyen | Faible | 3 jours |
| **12. Implémenter droit de rectification** | 🟠 Élevée | Moyen | Moyenne | 1 semaine |
| **13. Créer procédure violations** | 🟠 Élevée | Élevé | Faible | 2 jours |

---

### 13.3 Actions MOYENNES (à faire sous 3 mois)

| Action | Priorité | Impact | Difficulté | Délai |
|--------|----------|--------|------------|-------|
| **14. Implémenter rate limiting** | 🟡 Moyenne | Moyen | Moyenne | 1 semaine |
| **15. Implémenter portabilité données** | 🟡 Moyenne | Faible | Moyenne | 1 semaine |
| **16. Créer formulaire exercice droits** | 🟡 Moyenne | Moyen | Moyenne | 1 semaine |
| **17. Former admins au RGPD** | 🟡 Moyenne | Moyen | Faible | 1 jour |
| **18. Politique de mots de passe** | 🟡 Moyenne | Moyen | Faible | 1 jour |
| **19. Migrer vers email EU (optionnel)** | 🟡 Moyenne | Faible | Élevée | 1 mois |

---

### 13.4 Actions FAIBLES (amélioration continue)

| Action | Priorité | Impact | Difficulté | Délai |
|--------|----------|--------|------------|-------|
| **20. Augmenter bcrypt à 12 rounds** | 🟢 Faible | Faible | Faible | 1 heure |
| **21. Anonymiser logs IP** | 🟢 Faible | Faible | Moyenne | 1 jour |
| **22. PIA si >500 adhérents** | 🟢 Faible | Moyen | Élevée | 1 mois |
| **23. Audit RGPD annuel** | 🟢 Faible | Moyen | Faible | 1 jour/an |

---

### 13.5 Roadmap de conformité RGPD

**Phase 1 : Urgence (1 semaine)**
- ✅ Corriger consentements pré-cochés
- ✅ Vérifier sauvegardes
- ✅ Ajouter lien désinscription
- ✅ Compléter mentions légales

**Phase 2 : Fondations (1 mois)**
- ✅ Créer registre des traitements
- ✅ Implémenter droit d'accès
- ✅ Implémenter droit à l'effacement
- ✅ Créer procédure violations
- ✅ Vérifier chiffrement BDD
- ✅ Documenter sous-traitants

**Phase 3 : Consolidation (3 mois)**
- ✅ Purge automatique
- ✅ Logs d'audit
- ✅ Droit de rectification
- ✅ Rate limiting
- ✅ Formulaire exercice droits
- ✅ Formation admins

**Phase 4 : Excellence (6 mois)**
- ✅ Portabilité données
- ✅ Politique mots de passe
- ✅ Anonymisation logs
- ✅ Migration email EU (optionnel)
- ✅ PIA si nécessaire

---

## 14. Ressources et références

### 14.1 Textes de loi

- **RGPD** : https://www.cnil.fr/fr/reglement-europeen-protection-donnees
- **Loi Informatique et Libertés** : https://www.cnil.fr/fr/la-loi-informatique-et-libertes
- **ePrivacy (cookies)** : https://www.cnil.fr/fr/cookies-et-autres-traceurs

### 14.2 Guides CNIL

- **Guide de la conformité RGPD** : https://www.cnil.fr/fr/principes-cles/guide-de-la-securite-des-donnees-personnelles
- **Registre des traitements** : https://www.cnil.fr/fr/RGDP-le-registre-des-activites-de-traitement
- **Violations de données** : https://www.cnil.fr/fr/violations-de-donnees-personnelles
- **RGPD pour les petites structures** : https://www.cnil.fr/fr/rgpd-passer-a-laction

### 14.3 Outils pratiques

- **Générateur politique de confidentialité** : https://www.cnil.fr/fr/modele/politique-de-confidentialite
- **Registre de traitement (modèle)** : https://www.cnil.fr/sites/default/files/atoms/files/registre-rgpd-basique.xlsx
- **Check-list conformité RGPD** : https://www.cnil.fr/fr/rgpd-exemples-de-traitements-de-donnees-personnelles

### 14.4 Contact CNIL

- **Site web** : https://www.cnil.fr
- **Téléphone** : 01 53 73 22 22
- **Formulaire réclamation** : https://www.cnil.fr/fr/plaintes
- **Notification violation** : https://www.cnil.fr/fr/notifier-une-violation-de-donnees-personnelles

---

## Conclusion

### État actuel

ADUL21 présente une **conformité RGPD de 52%** (partiellement conforme). Le projet dispose de **bases solides** :
- ✅ Politique de confidentialité très complète
- ✅ Sécurité technique robuste (HTTPS, bcrypt, JWT, ORM)
- ✅ Analytics respectueux de la vie privée (Plausible)
- ✅ Bases légales identifiées

Cependant, des **manquements critiques** doivent être corrigés rapidement :
- 🔴 Consentements pré-cochés (non conformes RGPD)
- 🔴 Registre des traitements absent (obligatoire)
- 🔴 Droits d'accès et d'effacement non implémentés
- 🔴 Pas de lien de désinscription newsletter

### Priorités

**Semaine 1** : Corriger les consentements pré-cochés + vérifier sauvegardes + ajouter désinscription newsletter.

**Mois 1** : Créer registre traitements + implémenter droits d'accès et effacement + documenter sous-traitants.

**Mois 3** : Purge automatique + logs audit + rate limiting + formation admins.

### Objectif

Atteindre **80% de conformité RGPD** d'ici 3 mois, avec un risque juridique et réputationnel maîtrisé.

---

**Document généré le 17 octobre 2025**
**Auteur** : Analyse automatisée RGPD - ADUL21
**Version** : 1.0
**Prochaine révision** : Janvier 2026 (ou lors de changements majeurs)

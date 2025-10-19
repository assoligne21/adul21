# Release v1.3.0 - Corrections Admin & Formulaires

**Date**: 19 octobre 2025

## 🐛 Corrections critiques

### Formulaire de soutien
- **Fix**: Correction erreur 500 lors de la soumission du formulaire de soutien sans numéro de téléphone
  - Problème: La base de données en production avait une contrainte `NOT NULL` sur le champ `phone` alors que le schéma Drizzle le définissait comme nullable
  - Solution: Utilisation de chaîne vide (`''`) au lieu de `null` pour les champs téléphone optionnels
  - Impact: Le formulaire `/rejoindre/soutien` fonctionne maintenant correctement même sans téléphone
  - Commit: `781acc9`

### Interface admin
- **Fix**: Correction du modal de création d'utilisateur admin qui affichait une popup vide
  - Problème: Le composant `UModal` de Nuxt UI nécessite une structure spécifique avec `UCard`
  - Solution: Ajout de `UCard` avec slot `#header` et remplacement des inputs HTML par les composants Nuxt UI
  - Impact: La création et modification d'utilisateurs admin fonctionne maintenant correctement
  - Commit: `f7df455`

- **Fix**: Ajout du lien "Utilisateurs" dans la navigation admin
  - Problème: La page de gestion des utilisateurs admin existait mais n'était pas accessible via le menu
  - Solution: Ajout du lien dans le sidebar desktop et mobile avec l'icône `heroicons:user-group`
  - Impact: Accès direct à `/admin/utilisateurs` depuis la navigation
  - Commit: `6fe3873`

## 🧪 Améliorations des tests

### Tests de contraintes de schéma
- **Nouveau**: Ajout de tests pour vérifier les contraintes de la base de données
  - Fichier: `tests/integration/database/schema-constraints.test.ts`
  - But: Détecter les écarts entre le schéma Drizzle et les contraintes réelles en production
  - Couverture: Tables `pre_members`, `members`, `testimonies` - vérification que les chaînes vides sont acceptées pour les champs `phone`
  - Commit: `6eb7f47`

## 🔄 Refactoring

### Validation téléphone
- **Avant cette release**: Plusieurs validations différentes pour le champ téléphone (refactoring commit `bdcd594` de la session précédente)
  - Création de `/server/validation/fields.ts` avec helpers partagés
  - `optionalPhoneField`: pour formulaires où téléphone est optionnel
  - `requiredPhoneField`: pour formulaires où téléphone est obligatoire
  - Uniformisation dans tous les formulaires (contact, témoignages, pré-membres, adhésions)

## 📝 Détails techniques

### Problème de divergence schéma/production
Le bug du formulaire de soutien révèle un problème plus large:

**Environnement de test**:
- Schéma Drizzle: `phone: varchar('phone', { length: 20 })` (nullable)
- Tests: Passaient car la DB de test accepte NULL ✅

**Environnement de production**:
- Contrainte DB: `phone NOT NULL` (ajoutée manuellement ou par ancienne migration)
- Runtime: Rejetait NULL → erreur 500 ❌

**Solution long terme**: Les nouveaux tests de contraintes schéma détecteront automatiquement ce type d'écart à l'avenir.

## 📦 Fichiers modifiés

- `server/api/pre-members.post.ts` - Fix téléphone vide
- `pages/admin/utilisateurs/index.vue` - Fix modal utilisateurs
- `layouts/admin.vue` - Ajout lien navigation
- `tests/integration/database/schema-constraints.test.ts` - Nouveau fichier de tests

## 🚀 Migration

Aucune migration nécessaire. Les changements sont rétrocompatibles.

## ✅ Tests

Tous les tests d'intégration existants passent. Les nouveaux tests de contraintes schéma sont ajoutés.

---

**Commits inclus dans cette release**:
- `f7df455` - fix: correction modal création utilisateur admin
- `6eb7f47` - test: ajout tests contraintes schéma base de données
- `781acc9` - fix: utiliser chaîne vide au lieu de null pour téléphone vide
- `6fe3873` - fix: ajout du lien Utilisateurs dans la navigation admin

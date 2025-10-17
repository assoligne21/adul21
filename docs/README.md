# Documentation Technique ADUL21

> Documentation complète du site web de l'Association de Défense des Usagers de la Ligne 21

**Version** : 1.0.0
**Date** : 17 octobre 2025
**Statut** : Production

---

## 📋 Table des matières

1. [Architecture](./01-architecture.md) - Structure du projet, stack technique, patterns
2. [Base de données](./02-database.md) - Schéma PostgreSQL, 11 tables, relations
3. [API Endpoints](./03-api-endpoints.md) - 40+ endpoints REST documentés
4. [Frontend](./04-frontend.md) - Pages, composants Vue, formulaires
5. [Sécurité](./05-security.md) - Authentification JWT, validation, protection
6. [Emails](./06-emails.md) - Système transactionnel Gmail SMTP
7. [Configuration](./07-configuration.md) - Nuxt, Docker, Coolify, déploiement
8. [Performance](./08-performance.md) - Optimisations, Core Web Vitals, caching
9. [UX & Accessibilité](./09-ux-accessibilite.md) - Parcours utilisateur, WCAG
10. [Tests & Qualité](./10-tests-qualite.md) - Coverage, TypeScript, linting
11. [SEO](./11-seo.md) - Référencement, meta tags, structured data
12. [RGPD](./12-rgpd.md) - Conformité RGPD, données personnelles, consentements

---

## 🎯 Résumé exécutif

### Vue d'ensemble du projet

**ADUL21** est un site web associatif de défense des usagers de la ligne de bus 21 (Ledenon-Cabrières-Saint-Gervasy → Nîmes). Le site permet aux citoyens de :
- Soumettre des témoignages sur les problèmes de transport
- Adhérer à l'association ou apporter leur soutien
- S'informer sur les revendications et arguments juridiques
- Recevoir une newsletter et participer aux actions

### Stack technique

- **Framework** : Nuxt 4.1.3 + Vue 3 + TypeScript
- **Base de données** : PostgreSQL via Drizzle ORM
- **UI** : Nuxt UI + Tailwind CSS v4
- **Authentification** : JWT + Bcrypt
- **Emails** : Gmail SMTP via Nodemailer
- **Déploiement** : Docker + Coolify (OVH)
- **Analytics** : Plausible (sans cookies, RGPD-friendly)

### Chiffres clés

| Métrique | Valeur |
|----------|--------|
| **Pages** | 23 (13 publiques + 10 admin) |
| **Composants** | 10+ réutilisables |
| **Endpoints API** | 40+ (REST) |
| **Tables DB** | 11 (testimonies, members, news, etc.) |
| **Lignes de code API** | ~1150 (server/) |
| **Dependencies** | 38 production + 8 dev |
| **Bundle size** | ~50-70 KB (gzipped) |

---

## 📊 Évaluation globale

### Scores par domaine

| Domaine | Score | Statut | Priorité |
|---------|-------|--------|----------|
| **Architecture** | 8.5/10 | 🟢 Excellent | - |
| **Base de données** | 7/10 | 🟡 Bon | Index manquants |
| **API** | 7/10 | 🟡 Bon | Sécuriser routes |
| **Frontend** | 8/10 | 🟢 Très bon | - |
| **Sécurité** | 4.5/10 | 🔴 Critique | Routes publiques |
| **Emails** | 7/10 | 🟡 Bon | Consolidation |
| **Configuration** | 8/10 | 🟢 Très bon | - |
| **Performance** | 8.1/10 | 🟢 Très bon | Index DB |
| **UX/A11y** | 6.5/10 | 🟡 Moyen | WCAG AA 65% |
| **Tests/Qualité** | 2/10 | 🔴 Critique | 0% coverage |
| **SEO** | 7.5/10 | 🟡 Bon | Sitemap manquant |
| **RGPD** | 5.2/10 | 🟡 Partiel | Consentements |

**Score global moyen** : **6.8/10** 🟡

---

## 🚨 Actions critiques à mener (Semaine 1)

### 1. Sécurité (P0 - URGENT)

**Problème** : Routes de modification/suppression publiques sans authentification
```typescript
// ❌ CRITIQUE - N'importe qui peut supprimer des données
/api/members/[id].delete.ts      // SANS requireAuth()
/api/members/[id].patch.ts       // SANS requireAuth()
/api/testimonies/[id].delete.ts  // SANS requireAuth()
/api/testimonies/[id].patch.ts   // SANS requireAuth()
```

**Solution** : Ajouter `requireAuth()` dans chaque endpoint :
```typescript
export default defineEventHandler(async (event) => {
  await requireAuth(event) // ✅ Ajouter cette ligne
  // ... rest of code
})
```

**Impact** : 🔴 Critique - Données exposées à la suppression malveillante

### 2. Sécurité (P0 - XSS)

**Problème** : Aucune sanitization des inputs utilisateur
- `testimony_text`, `concrete_example`, `message` peuvent contenir du JS malveillant

**Solution** : Installer et utiliser DOMPurify
```bash
npm install isomorphic-dompurify
```

### 3. RGPD (P0)

**Problème** : 3 consentements pré-cochés (non conformes)
- `/pages/temoignages/nouveau.vue` : `accepts_site_publication: true`
- `/pages/rejoindre/soutien.vue` : 2 cases pré-cochées

**Solution** : Mettre tous les consentements à `false` par défaut

### 4. Base de données (P1)

**Problème** : Aucun index sur les tables
- Performance dégradée sur les requêtes WHERE et JOIN

**Solution** : Ajouter des index sur colonnes fréquemment requêtées
```sql
CREATE INDEX idx_testimonies_moderation_status ON testimonies(moderation_status);
CREATE INDEX idx_testimonies_published ON testimonies(is_published);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
```

**Impact** : +200-500% performance sur les requêtes

---

## 🎯 Roadmap qualité (3 mois)

### Mois 1 - Fondations

**Semaine 1** :
- ✅ Corriger vulnérabilités sécurité critiques
- ✅ Corriger consentements RGPD pré-cochés
- ✅ Ajouter index PostgreSQL

**Semaine 2-4** :
- Configuration ESLint + Prettier
- Premiers tests unitaires (coverage 40%)
- Élimination des types `any` (73 occurrences)

### Mois 2 - Consolidation

- Tests API complets (coverage 70%)
- Intégration Sentry (monitoring erreurs)
- Logger structuré
- Droit d'accès RGPD (API)
- Sitemap.xml + Schema.org

### Mois 3 - Excellence

- Tests E2E Playwright
- Coverage 80%
- Conformité WCAG AA 100%
- Conformité RGPD 80%
- Documentation JSDoc complète

**Objectif** : Passer de **6.8/10** à **8.5/10** en 3 mois

---

## 📚 Comment utiliser cette documentation

### Pour les développeurs

1. **Onboarding nouveau dev** :
   - Lire [Architecture](./01-architecture.md)
   - Lire [Configuration](./07-configuration.md)
   - Lire [Base de données](./02-database.md)

2. **Développement frontend** :
   - [Frontend](./04-frontend.md) - Composants et pages
   - [UX & Accessibilité](./09-ux-accessibilite.md) - Guidelines

3. **Développement backend** :
   - [API Endpoints](./03-api-endpoints.md) - Routes disponibles
   - [Base de données](./02-database.md) - Schéma et relations
   - [Sécurité](./05-security.md) - Best practices

4. **Debugging & maintenance** :
   - [Configuration](./07-configuration.md) - Variables, Docker, Coolify
   - [Emails](./06-emails.md) - Troubleshooting SMTP
   - [Performance](./08-performance.md) - Optimisations

### Pour les product owners / chefs de projet

1. **Conformité & risques** :
   - [RGPD](./12-rgpd.md) - Conformité 52%, plan d'action
   - [Sécurité](./05-security.md) - Vulnérabilités critiques

2. **Amélioration du produit** :
   - [UX & Accessibilité](./09-ux-accessibilite.md) - Points de friction
   - [SEO](./11-seo.md) - Recommandations référencement
   - [Performance](./08-performance.md) - Core Web Vitals

3. **Qualité technique** :
   - [Tests & Qualité](./10-tests-qualite.md) - Roadmap qualité
   - Résumé exécutif (ci-dessus) - Scores globaux

### Pour les admins système

1. **Déploiement** :
   - [Configuration](./07-configuration.md) - Docker, Coolify, variables env
   - [Base de données](./02-database.md) - Migrations, backup

2. **Monitoring** :
   - [Performance](./08-performance.md) - Métriques à surveiller
   - [Sécurité](./05-security.md) - Logs, alertes

---

## 🔍 Points d'attention particuliers

### 🔴 Critiques (à corriger immédiatement)

1. **Routes de modification publiques** - Sécurité
2. **Aucune sanitization XSS** - Sécurité
3. **0% de tests** - Qualité
4. **Consentements pré-cochés** - RGPD
5. **Aucun index DB** - Performance

### 🟡 Importants (1 mois)

6. **Sitemap.xml manquant** - SEO
7. **Droits RGPD non implémentés** - RGPD
8. **Conformité WCAG AA partielle (65%)** - Accessibilité
9. **Pas de monitoring (Sentry)** - Qualité
10. **73 types `any`** - Type safety

### 🟢 Améliorations (3 mois)

11. Tests E2E - Qualité
12. Schema.org structured data - SEO
13. PWA / Service Worker - Performance
14. Self-hosted fonts - Performance
15. Blog actualités régulier - SEO

---

## 🛠️ Outils recommandés

### Développement
- **IDE** : VSCode avec extensions (Volar, ESLint, Tailwind IntelliSense)
- **Database** : Drizzle Studio (`npm run db:studio`)
- **API testing** : Thunder Client / Postman
- **Git** : Conventional Commits

### Qualité
- **Tests** : Vitest + Playwright (à installer)
- **Linting** : ESLint + Prettier (à configurer)
- **Type checking** : `vue-tsc` (déjà installé)

### Production
- **Monitoring** : Sentry (à installer)
- **Analytics** : Plausible (✅ installé)
- **Logs** : Winston / Pino (à installer)
- **Uptime** : UptimeRobot / Better Uptime

---

## 📞 Support & Contact

### Documentation officielle
- **Nuxt** : https://nuxt.com/docs
- **Drizzle ORM** : https://orm.drizzle.team/docs
- **Nuxt UI** : https://ui.nuxt.com
- **Tailwind CSS** : https://tailwindcss.com

### Projet ADUL21
- **Email** : assoligne21@gmail.com
- **Site** : https://adul21.fr
- **GitHub** : https://github.com/smiollis/adul21

---

## 📝 Contributeurs

Cette documentation a été générée automatiquement par **12 agents spécialisés** via Claude Code :

1. **Architecture Agent** - Structure et patterns
2. **Database Agent** - Schéma PostgreSQL
3. **API Agent** - Endpoints REST
4. **Frontend Agent** - Vue/Nuxt components
5. **Security Agent** - JWT, validation, protection
6. **Email Agent** - Gmail SMTP, templates
7. **Config Agent** - Nuxt, Docker, Coolify
8. **Performance Agent** - Optimisations, Web Vitals
9. **UX Agent** - Parcours utilisateur, WCAG
10. **Quality Agent** - Tests, TypeScript, linting
11. **SEO Agent** - Référencement, meta tags
12. **RGPD Agent** - Conformité, données personnelles

**Méthodologie** : Analyse automatisée de 86 fichiers TypeScript/Vue, 11 tables PostgreSQL, 40+ endpoints API.

---

## 📅 Historique des versions

| Version | Date | Changements |
|---------|------|-------------|
| 1.0.0 | 17 octobre 2025 | Documentation initiale complète |

---

## 📜 Licence

© 2025 ADUL21 - Tous droits réservés

Cette documentation est destinée à un usage interne et aux contributeurs du projet ADUL21.

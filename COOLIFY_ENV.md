# Variables d'environnement pour Coolify

## 🔴 OBLIGATOIRES

### PostgreSQL (Base de données)
```bash
POSTGRES_PASSWORD=VotreMotDePasseSecurise123!
```
> ⚠️ **Choisissez un mot de passe fort** : minimum 16 caractères avec lettres, chiffres et symboles

### Gmail SMTP (Envoi d'emails)
```bash
GMAIL_USER=assoligne21@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```
> 📖 **Configuration Gmail** : Suivez le guide `GMAIL_SMTP_GUIDE.md` pour obtenir le mot de passe d'application

### Sécurité
```bash
JWT_SECRET=VotreCleSecreteAleatoire64Caracteres
```
> 🔐 **Générer une clé aléatoire** : `openssl rand -base64 48`

---

## 🟢 OPTIONNELLES (avec valeurs par défaut)

### Général
```bash
SITE_URL=https://adul21.fr
```
> Par défaut : `https://adul21.fr`

### PostgreSQL (optionnel si vous gardez les défauts)
```bash
POSTGRES_DB=adul21
POSTGRES_USER=adul21
```
> Par défaut : `adul21` pour les deux

### Email
```bash
EMAIL_FROM=ADUL21 <assoligne21@gmail.com>
```
> Par défaut : `ADUL21 <assoligne21@gmail.com>`

### Analytics
```bash
PLAUSIBLE_DOMAIN=adul21.fr
```
> Par défaut : `adul21.fr`

### Statut de l'association
```bash
ASSOCIATION_CREATED=false
```
> Par défaut : `false`
> - `false` = Phase 1 (pré-adhésion gratuite)
> - `true` = Phase 2 (adhésions payantes)

---

## 📋 Liste complète à copier dans Coolify

```bash
# ========================================
# OBLIGATOIRES - À REMPLIR
# ========================================

# PostgreSQL
POSTGRES_PASSWORD=

# Gmail SMTP
GMAIL_USER=assoligne21@gmail.com
GMAIL_APP_PASSWORD=

# Sécurité
JWT_SECRET=


# ========================================
# OPTIONNELLES - Valeurs par défaut OK
# ========================================

# Général
SITE_URL=https://adul21.fr

# PostgreSQL (optionnel)
POSTGRES_DB=adul21
POSTGRES_USER=adul21

# Email
EMAIL_FROM=ADUL21 <assoligne21@gmail.com>

# Analytics
PLAUSIBLE_DOMAIN=adul21.fr

# Association status
ASSOCIATION_CREATED=false
```

---

## 🚀 Ordre de configuration dans Coolify

1. **Copiez toutes les variables** dans Coolify → Settings → Environment Variables
2. **Remplissez les 3 obligatoires** :
   - `POSTGRES_PASSWORD`
   - `GMAIL_APP_PASSWORD`
   - `JWT_SECRET`
3. **Ajustez les optionnelles** si nécessaire
4. **Sauvegardez** et **relancez le déploiement**

---

## 🔍 Vérification après déploiement

✅ **PostgreSQL** : Le container `adul21-postgres` démarre et est healthy
✅ **Web** : Le container `adul21-website` démarre après PostgreSQL
✅ **Base de données** : Le schéma SQL est automatiquement initialisé
✅ **Emails** : Testez avec le formulaire de contact

---

## 📝 Notes importantes

- **POSTGRES_PASSWORD** : N'utilisez JAMAIS un mot de passe simple en production
- **GMAIL_APP_PASSWORD** : Ce n'est PAS le mot de passe de votre compte Gmail, mais un "mot de passe d'application" (voir guide)
- **JWT_SECRET** : Doit être une chaîne aléatoire longue (minimum 32 caractères)
- **ASSOCIATION_CREATED** : Changez en `true` uniquement après obtention du récépissé de préfecture

---

## 🆘 En cas de problème

### Le build échoue ?
- Vérifiez que `SITE_URL` est défini
- Consultez les logs de build dans Coolify

### PostgreSQL ne démarre pas ?
- Vérifiez que `POSTGRES_PASSWORD` est bien rempli
- Consultez les logs du container postgres

### Pas d'emails envoyés ?
- Vérifiez `GMAIL_USER` et `GMAIL_APP_PASSWORD`
- Consultez le guide `GMAIL_SMTP_GUIDE.md`
- Vérifiez les logs du container web

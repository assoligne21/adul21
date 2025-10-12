# Guide de Déploiement - ADUL21 Website

## 📦 Prérequis

- Compte GitHub avec accès au repository
- Serveur OVH avec Coolify installé
- Accès aux services externes (Supabase, Stripe, Resend)

## 🔐 Configuration GitHub

### 1. Rendre le repository accessible

Le repository peut rester **public** ou être **privé**. Si privé, Coolify aura besoin d'un accès.

#### Option A : Repository Public (Recommandé pour démarrer)
✅ Aucune configuration supplémentaire nécessaire

#### Option B : Repository Privé

**Méthode 1 : Deploy Key (Recommandée)**

1. Sur votre serveur Coolify, générez une clé SSH :
```bash
ssh-keygen -t ed25519 -C "coolify@adul21"  -f ~/.ssh/coolify_adul21
```

2. Copiez la clé publique :
```bash
cat ~/.ssh/coolify_adul21.pub
```

3. Sur GitHub :
   - Allez dans `Settings` > `Deploy keys` > `Add deploy key`
   - Titre : `Coolify ADUL21`
   - Collez la clé publique
   - ✅ Cochez "Allow write access" (si vous voulez que Coolify puisse push)
   - Cliquez sur `Add key`

**Méthode 2 : Personal Access Token (PAT)**

1. Sur GitHub :
   - `Settings` > `Developer settings` > `Personal access tokens` > `Tokens (classic)`
   - `Generate new token (classic)`
   - Scopes requis :
     - ✅ `repo` (accès complet au repository)
   - Générez et copiez le token (vous ne pourrez plus le voir après !)

2. Dans Coolify, utilisez l'URL avec le token :
```
https://<TOKEN>@github.com/smiollis/adul21.git
```

**Méthode 3 : GitHub App (Plus sécurisé)**

Coolify peut utiliser une GitHub App. Consultez la documentation Coolify pour cette méthode avancée.

## 🚀 Configuration Coolify

### 1. Créer un nouveau projet

1. Connectez-vous à votre interface Coolify
2. Cliquez sur `+ New Resource` > `Application`
3. Sélectionnez `GitHub` comme source

### 2. Configurer le repository

**Si repository public :**
```
Repository URL: https://github.com/smiollis/adul21.git
Branch: main
```

**Si repository privé avec Deploy Key :**
```
Repository URL: git@github.com:smiollis/adul21.git
Branch: main
Deploy Key: (sélectionner la clé SSH créée)
```

### 3. Configuration du build

**Type**: `Dockerfile`
**Dockerfile Path**: `./Dockerfile`
**Port**: `3000`

### 4. Variables d'environnement

Dans Coolify, ajoutez toutes les variables d'environnement :

```env
# Général
NODE_ENV=production
SITE_URL=https://adul21.fr

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1...

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=ADUL21 <assoligne21@gmail.com>

# Auth
JWT_SECRET=<générer_un_secret_aléatoire>

# Analytics
PLAUSIBLE_DOMAIN=adul21.fr
```

**Générer JWT_SECRET** :
```bash
openssl rand -base64 32
```

### 5. Configuration du domaine

1. Dans Coolify, allez dans `Domains`
2. Ajoutez le domaine : `adul21.fr`
3. Coolify générera automatiquement un certificat SSL Let's Encrypt

### 6. DNS Configuration

Pointez votre domaine vers le serveur Coolify :

**Chez votre registrar (OVH) :**
```
Type  | Nom | Valeur              | TTL
------|-----|---------------------|-----
A     | @   | <IP_SERVEUR_COOLIFY>| 300
A     | www | <IP_SERVEUR_COOLIFY>| 300
```

## 🔄 Déploiement

### Déploiement automatique (Recommandé)

1. Dans Coolify, activez `Auto Deploy`
2. Chaque push sur `main` déclenchera automatiquement un déploiement

### Déploiement manuel

1. Dans Coolify, cliquez sur `Deploy`
2. Le build commence
3. Une fois terminé, l'application sera accessible sur votre domaine

## 🔍 Vérification

Après le déploiement, vérifiez :

✅ Site accessible sur https://adul21.fr
✅ SSL actif (cadenas vert)
✅ Pas d'erreurs dans les logs Coolify
✅ Connexion Supabase fonctionnelle
✅ Formulaires opérationnels

## 📊 Webhooks Stripe

Une fois déployé, configurez le webhook Stripe :

1. Dans le Dashboard Stripe :
   - `Developers` > `Webhooks` > `Add endpoint`
   - URL : `https://adul21.fr/api/payments/webhook`
   - Events à écouter :
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

2. Copiez le `Signing secret` (whsec_...)
3. Ajoutez-le dans Coolify : `STRIPE_WEBHOOK_SECRET`

## 🐛 Troubleshooting

### Build échoue

```bash
# Vérifier les logs dans Coolify
# Problèmes courants :
# - Variables d'environnement manquantes
# - Erreur de dépendances npm
# - Problème de mémoire (augmenter la RAM du conteneur)
```

### Application ne démarre pas

```bash
# Vérifier que le port 3000 est bien exposé
# Vérifier les logs de l'application dans Coolify
# Vérifier que toutes les variables d'env sont définies
```

### Problème de connexion Supabase

```bash
# Vérifier SUPABASE_URL et SUPABASE_KEY
# Vérifier les policies RLS dans Supabase
# Tester avec curl :
curl https://adul21.fr/api/health
```

## 📝 Notes

- **Sauvegardez vos variables d'environnement** dans un gestionnaire de mots de passe
- **Activez les logs** dans Coolify pour faciliter le debugging
- **Configurez des alertes** pour être notifié en cas de problème
- **Testez toujours** dans un environnement de staging avant la production

## 🔒 Sécurité

- ✅ Toutes les variables sensibles sont dans des variables d'environnement
- ✅ Le `.env` n'est jamais commité (dans `.gitignore`)
- ✅ SSL/TLS automatique via Let's Encrypt
- ✅ Row Level Security activé sur Supabase
- ✅ Rate limiting sur les API endpoints

## 📞 Support

En cas de problème :
1. Consultez les logs Coolify
2. Vérifiez la documentation : https://coolify.io/docs
3. Contactez le développeur du projet

---

✅ **Le site est maintenant déployé et accessible !**

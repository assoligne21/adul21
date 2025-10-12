# 🔐 Guide d'Accès GitHub pour Coolify

## Étape 1 : Pousser le code sur GitHub

Actuellement, vous avez 3 commits locaux qui doivent être poussés sur GitHub.

### Option A : Utiliser GitHub CLI (Recommandé)

```bash
# Si gh n'est pas installé :
# curl -sS https://webi.sh/gh | sh

# S'authentifier
gh auth login

# Pousser les commits
git push origin main
```

### Option B : Utiliser HTTPS avec un Personal Access Token

1. **Créer un Personal Access Token (PAT)** :
   - Allez sur https://github.com/settings/tokens
   - `Generate new token (classic)`
   - Scopes : ✅ `repo` (accès complet)
   - Générez et **copiez le token immédiatement**

2. **Pousser avec le token** :
```bash
# Format: https://<TOKEN>@github.com/smiollis/adul21.git
git remote set-url origin https://<VOTRE_TOKEN>@github.com/smiollis/adul21.git
git push origin main
```

3. **Sécuriser** (après le push) :
```bash
# Revenir à l'URL normale
git remote set-url origin https://github.com/smiollis/adul21.git
```

### Option C : Utiliser SSH (Si vous avez une clé SSH configurée)

```bash
git remote set-url origin git@github.com:smiollis/adul21.git
git push origin main
```

## Étape 2 : Autoriser Coolify à accéder au repository

### 🔹 Méthode 1 : Repository Public (Plus Simple)

**Avantages** : Aucune configuration d'accès nécessaire
**Inconvénients** : Le code est visible publiquement

1. Sur GitHub, allez dans `Settings` > `General`
2. Scrollez jusqu'à "Danger Zone"
3. Cliquez sur `Change visibility` > `Make public`
4. Confirmez

✅ **Coolify pourra cloner le repository directement**

---

### 🔹 Méthode 2 : Deploy Key (Repository Privé - Recommandé)

**Avantages** : Sécurisé, accès en lecture seule au repository
**Inconvénients** : Nécessite une configuration

#### Sur votre serveur Coolify :

```bash
# Connexion SSH au serveur
ssh user@votre-serveur-coolify

# Générer une clé SSH dédiée
ssh-keygen -t ed25519 -C "coolify-adul21" -f ~/.ssh/coolify_adul21

# Afficher la clé publique
cat ~/.ssh/coolify_adul21.pub
```

**Copiez toute la sortie** (commence par `ssh-ed25519`)

#### Sur GitHub :

1. Allez dans le repository : https://github.com/smiollis/adul21
2. `Settings` > `Deploy keys` > `Add deploy key`
3. **Title** : `Coolify ADUL21`
4. **Key** : Collez la clé publique copiée
5. ☐ **Allow write access** : Laissez décoché (lecture seule suffit)
6. Cliquez sur `Add key`

#### Dans Coolify :

1. Créez une nouvelle application
2. Source : `Git Repository`
3. Repository URL : `git@github.com:smiollis/adul21.git`
4. Authentication : `SSH Key`
5. Sélectionnez ou ajoutez la clé privée (`~/.ssh/coolify_adul21`)

---

### 🔹 Méthode 3 : Personal Access Token (Alternative)

**Avantages** : Simple, fonctionne pour plusieurs repositories
**Inconvénients** : Accès plus large que nécessaire

#### Créer le token :

1. GitHub > `Settings` > `Developer settings`
2. `Personal access tokens` > `Tokens (classic)`
3. `Generate new token (classic)`
4. **Note** : `Coolify ADUL21`
5. **Expiration** : `No expiration` (ou 1 an)
6. **Scopes** :
   - ✅ `repo` (Full control of private repositories)
7. `Generate token`
8. **COPIEZ LE TOKEN MAINTENANT** (vous ne pourrez plus le voir !)

#### Dans Coolify :

1. Repository URL : `https://github.com/smiollis/adul21.git`
2. Authentication : `Personal Access Token`
3. Token : Collez votre token GitHub

---

### 🔹 Méthode 4 : GitHub App (Avancé)

Pour les organisations avec plusieurs repositories. Consultez la documentation Coolify.

---

## Étape 3 : Vérifier l'accès

### Test 1 : Clone manuel depuis le serveur

```bash
# Sur votre serveur Coolify

# Test avec Deploy Key
GIT_SSH_COMMAND="ssh -i ~/.ssh/coolify_adul21" git clone git@github.com:smiollis/adul21.git test-clone

# OU test avec PAT
git clone https://<TOKEN>@github.com/smiollis/adul21.git test-clone

# Si ça fonctionne :
rm -rf test-clone
```

### Test 2 : Dans Coolify

1. Essayez de créer/configurer l'application
2. Coolify devrait pouvoir :
   - ✅ Lister les branches
   - ✅ Cloner le repository
   - ✅ Lire le Dockerfile

---

## 🚨 Troubleshooting

### Erreur : "Permission denied (publickey)"

**Cause** : La clé SSH n'est pas correcte

**Solution** :
```bash
# Vérifier que la clé est bien ajoutée
ssh-add ~/.ssh/coolify_adul21

# Tester la connexion GitHub
ssh -T -i ~/.ssh/coolify_adul21 git@github.com
# Devrait afficher : "Hi smiollis/adul21! You've successfully authenticated..."
```

### Erreur : "Repository not found"

**Cause** : Token invalide ou permissions insuffisantes

**Solution** :
- Vérifiez que le token a le scope `repo`
- Régénérez un nouveau token si nécessaire

### Erreur : "Could not read from remote repository"

**Cause** : URL incorrecte ou pas d'accès

**Solution** :
- Repository privé : Utilisez Deploy Key ou PAT
- Repository public : Utilisez l'URL HTTPS simple

---

## 📝 Checklist Finale

Avant de déployer sur Coolify :

- [ ] Code poussé sur GitHub (`git push origin main`)
- [ ] Repository accessible (public OU deploy key configurée)
- [ ] Coolify peut cloner le repository (testé)
- [ ] Variables d'environnement prêtes (cf. `.env.example`)
- [ ] Domaine DNS pointé vers le serveur Coolify

---

## 🎯 Résumé : Quelle méthode choisir ?

| Situation | Méthode Recommandée |
|-----------|---------------------|
| Site open-source, pas de données sensibles dans le code | **Repository Public** |
| Site privé, un seul repository | **Deploy Key** |
| Site privé, plusieurs repositories | **Personal Access Token** |
| Organisation avec équipe | **GitHub App** |

---

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifiez les logs Coolify
2. Testez le clone manuellement depuis le serveur
3. Vérifiez que la clé/token n'a pas expiré
4. Consultez : https://coolify.io/docs/knowledge-base/git/github

---

**Une fois l'accès configuré, vous êtes prêt pour le déploiement !** 🚀

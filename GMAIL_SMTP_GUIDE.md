# Guide de configuration Gmail SMTP pour ADUL21

Ce guide vous explique comment configurer l'envoi d'emails via Gmail SMTP pour le site ADUL21.

## Table des matières

1. [Pourquoi Gmail SMTP ?](#pourquoi-gmail-smtp)
2. [Prérequis](#prérequis)
3. [Configuration du compte Gmail](#configuration-du-compte-gmail)
4. [Configuration de l'application](#configuration-de-lapplication)
5. [Test de la configuration](#test-de-la-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Limites et alternatives](#limites-et-alternatives)

---

## Pourquoi Gmail SMTP ?

Gmail SMTP est une solution simple et gratuite pour l'envoi d'emails transactionnels :

- ✅ **Gratuit** jusqu'à 500 emails/jour (largement suffisant pour démarrer)
- ✅ **Fiable** : infrastructure Google
- ✅ **Simple** : pas besoin de service tiers
- ✅ **Sécurisé** : authentification App Password
- ✅ **Livraison optimale** : bonne délivrabilité (pas de spam)

---

## Prérequis

- Un compte Gmail : `assoligne21@gmail.com`
- Accès aux paramètres de sécurité du compte
- Activer l'authentification à deux facteurs (2FA)

---

## Configuration du compte Gmail

### Étape 1 : Activer l'authentification à deux facteurs (2FA)

L'authentification à deux facteurs est **obligatoire** pour utiliser les App Passwords.

1. Connectez-vous à votre compte Gmail : https://mail.google.com
2. Allez dans **Paramètres du compte Google** → **Sécurité**
   - URL directe : https://myaccount.google.com/security
3. Dans la section **"Comment vous connecter à Google"**, cliquez sur **"Validation en deux étapes"**
4. Suivez les instructions pour activer la 2FA :
   - Choisissez la méthode : SMS, appel vocal ou application d'authentification
   - Validez votre numéro de téléphone
5. Une fois activée, vous verrez **"Validation en deux étapes : Activée"**

### Étape 2 : Créer un mot de passe d'application (App Password)

Les App Passwords permettent aux applications tierces d'accéder à votre compte Gmail de manière sécurisée.

1. Retournez dans **Sécurité** : https://myaccount.google.com/security
2. Dans la section **"Comment vous connecter à Google"**, cliquez sur **"Mots de passe des applications"**
   - URL directe : https://myaccount.google.com/apppasswords
   - Si vous ne voyez pas cette option, vérifiez que la 2FA est bien activée
3. Sélectionnez l'application : **"Autre (nom personnalisé)"**
4. Entrez un nom descriptif : `ADUL21 Website`
5. Cliquez sur **"Générer"**
6. **IMPORTANT** : Copiez le mot de passe de 16 caractères généré
   - Format : `xxxx xxxx xxxx xxxx` (avec espaces)
   - Vous ne pourrez plus le revoir, conservez-le en sécurité
   - Ne partagez jamais ce mot de passe

---

## Configuration de l'application

### Étape 1 : Créer le fichier .env

Si vous n'avez pas encore de fichier `.env`, copiez le fichier `.env.example` :

```bash
cp .env.example .env
```

### Étape 2 : Remplir les variables d'environnement

Ouvrez le fichier `.env` et remplissez les variables Gmail :

```env
# Email (Gmail SMTP)
GMAIL_USER=assoligne21@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=ADUL21 <assoligne21@gmail.com>
```

**Détails des variables :**

- `GMAIL_USER` : Votre adresse email Gmail complète
- `GMAIL_APP_PASSWORD` : Le mot de passe d'application généré à l'étape 2 (16 caractères avec espaces)
- `EMAIL_FROM` : Le nom et l'adresse qui apparaîtront comme expéditeur

### Étape 3 : Configuration pour la production (Coolify)

Dans Coolify, ajoutez les variables d'environnement :

1. Allez dans votre projet → **Environment Variables**
2. Ajoutez les variables suivantes :
   ```
   GMAIL_USER=assoligne21@gmail.com
   GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
   EMAIL_FROM=ADUL21 <assoligne21@gmail.com>
   ```
3. **Important** : Ne committez JAMAIS le fichier `.env` dans Git !

---

## Test de la configuration

### Test en développement local

1. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Testez l'envoi d'email en soumettant un formulaire (contact ou témoignage)

3. Vérifiez les logs du serveur :
   - En cas de succès : `Email sent successfully: <message-id>`
   - En cas d'erreur : Un message d'erreur détaillé apparaîtra

### Test via l'API directement

Créez un fichier de test `test-email.ts` :

```typescript
// server/api/test-email.ts
export default defineEventHandler(async (event) => {
  try {
    await sendEmail({
      to: 'votre-email-test@example.com',
      subject: 'Test ADUL21 - Gmail SMTP',
      html: '<h1>Test réussi !</h1><p>L\'envoi d\'email via Gmail SMTP fonctionne.</p>',
      text: 'Test réussi ! L\'envoi d\'email via Gmail SMTP fonctionne.'
    })

    return { success: true, message: 'Email envoyé avec succès' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})
```

Testez via :
```bash
curl http://localhost:3000/api/test-email
```

---

## Troubleshooting

### Erreur : "Invalid login: 535-5.7.8 Username and Password not accepted"

**Causes possibles :**
- Le mot de passe d'application est incorrect
- La 2FA n'est pas activée sur le compte
- Les espaces dans le mot de passe n'ont pas été retirés

**Solutions :**
1. Vérifiez que la 2FA est bien activée
2. Régénérez un nouveau mot de passe d'application
3. Copiez le mot de passe **sans les espaces** : `xxxxxxxxxxxxxxxx`

### Erreur : "Connection timeout"

**Causes possibles :**
- Le port 587 est bloqué par un firewall
- Problème de connexion réseau

**Solutions :**
1. Vérifiez que le port 587 est ouvert
2. Essayez avec le port 465 (SSL) en modifiant `server/utils/mailer.ts` :
   ```typescript
   port: 465,
   secure: true, // true pour le port 465
   ```

### Erreur : "Daily sending quota exceeded"

**Cause :** Vous avez dépassé la limite de 500 emails/jour.

**Solutions :**
1. Attendez 24h pour que le quota se réinitialise
2. Migrez vers un service professionnel (voir section Limites et alternatives)

### Erreur : "self signed certificate in certificate chain"

**Cause :** Problème de certificat SSL.

**Solution :** Ajoutez cette option temporairement (déconseillé en production) :
```typescript
tls: {
  rejectUnauthorized: false // À utiliser UNIQUEMENT pour débugger
}
```

### Les emails arrivent dans les spams

**Causes possibles :**
- Le domaine n'a pas de configuration SPF/DKIM
- Le contenu de l'email est suspect (trop de liens, mots-clés spam)

**Solutions :**
1. Configurez les enregistrements DNS pour votre domaine (voir ci-dessous)
2. Évitez les mots-clés spam dans les sujets
3. Ajoutez un lien de désinscription
4. Demandez aux destinataires de marquer les emails comme "Non spam"

---

## Configuration DNS pour améliorer la délivrabilité

Pour éviter que vos emails arrivent en spam, configurez ces enregistrements DNS :

### 1. SPF (Sender Policy Framework)

Ajoutez un enregistrement TXT à votre domaine `adul21.fr` :

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

### 2. DKIM (DomainKeys Identified Mail)

Pour activer DKIM, vous devrez utiliser Google Workspace (payant) ou un service d'email transactionnel.

### 3. DMARC (Domain-based Message Authentication)

Ajoutez un enregistrement TXT :

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:assoligne21@gmail.com
```

---

## Limites et alternatives

### Limites de Gmail SMTP

- ⚠️ **500 emails/jour maximum** (compte Gmail gratuit)
- ⚠️ **Pas de statistiques** (taux d'ouverture, clics, etc.)
- ⚠️ **Pas de gestion de rebonds** (bounces)
- ⚠️ **Risque de blocage** si envois suspects détectés

### Quand migrer vers une alternative ?

Envisagez de migrer vers un service professionnel si :
- Vous dépassez régulièrement 400 emails/jour
- Vous avez besoin de statistiques détaillées
- Vous voulez améliorer la délivrabilité (SPF/DKIM automatique)
- Vous avez besoin d'emails transactionnels critiques (réinitialisations de mot de passe, etc.)

### Alternatives recommandées

#### 1. **Resend** (Recommandé)
- ✅ **Gratuit** : 3 000 emails/mois
- ✅ **Simple** : API moderne et facile
- ✅ **Statistiques** : suivi des emails
- ✅ **Bonne délivrabilité**
- 💰 **Prix** : $20/mois pour 50 000 emails
- 🔗 https://resend.com

#### 2. **Brevo (ex-Sendinblue)** (Français)
- ✅ **Gratuit** : 300 emails/jour
- ✅ **Interface en français**
- ✅ **RGPD-compliant** (serveurs UE)
- ✅ **Statistiques complètes**
- 💰 **Prix** : €25/mois pour 20 000 emails
- 🔗 https://www.brevo.com

#### 3. **Mailgun**
- ✅ **Gratuit** : 5 000 emails/mois (3 premiers mois)
- ✅ **Puissant** : API avancée
- ✅ **Bonne délivrabilité**
- 💰 **Prix** : $35/mois pour 50 000 emails
- 🔗 https://www.mailgun.com

#### 4. **Amazon SES**
- ✅ **Très bon marché** : $0.10 pour 1 000 emails
- ⚠️ **Complexe** : configuration AWS
- ✅ **Scalable**
- 🔗 https://aws.amazon.com/ses/

### Migration future

Le code de l'application est préparé pour faciliter la migration. Il suffira de :
1. Remplacer `server/utils/mailer.ts` avec le client du nouveau service
2. Mettre à jour les variables d'environnement
3. Redéployer l'application

---

## Checklist de configuration

Avant de mettre en production, vérifiez :

- [ ] La 2FA est activée sur le compte Gmail
- [ ] Un mot de passe d'application a été généré
- [ ] Les variables d'environnement sont configurées dans `.env`
- [ ] Les variables sont ajoutées dans Coolify
- [ ] Un email de test a été envoyé avec succès
- [ ] Les enregistrements DNS (SPF) sont configurés
- [ ] Le fichier `.env` est dans `.gitignore`

---

## Support

En cas de problème :

1. Vérifiez les logs du serveur Nuxt
2. Consultez la section [Troubleshooting](#troubleshooting)
3. Vérifiez la documentation officielle de Nodemailer : https://nodemailer.com
4. Vérifiez les paramètres de sécurité Gmail : https://myaccount.google.com/security

---

## Sécurité

⚠️ **Rappels importants :**

- Ne committez JAMAIS le fichier `.env`
- Ne partagez JAMAIS le mot de passe d'application
- Régénérez le mot de passe d'application si compromis
- Utilisez des variables d'environnement sécurisées en production
- Limitez l'accès aux paramètres Coolify aux administrateurs uniquement

---

**Dernière mise à jour :** 2025-10-12

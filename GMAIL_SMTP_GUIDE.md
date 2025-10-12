# Guide de configuration Gmail SMTP pour ADUL21

Ce guide explique comment configurer Gmail SMTP pour envoyer des emails transactionnels depuis le site ADUL21.

## Prérequis

- Compte Gmail : `assoligne21@gmail.com`
- Accès aux paramètres du compte Gmail

## Étape 1 : Activer la validation en deux étapes (2FA)

Pour pouvoir générer un mot de passe d'application, vous devez d'abord activer la validation en deux étapes sur votre compte Gmail.

1. **Accédez aux paramètres de sécurité Google** :
   - Allez sur https://myaccount.google.com/security
   - Connectez-vous avec `assoligne21@gmail.com`

2. **Activez la validation en deux étapes** :
   - Dans la section "Comment vous connecter à Google"
   - Cliquez sur "Validation en deux étapes"
   - Suivez les instructions pour activer la 2FA
   - Vous pouvez utiliser :
     - SMS
     - Application Google Authenticator
     - Clé de sécurité physique

## Étape 2 : Générer un mot de passe d'application

Une fois la 2FA activée, vous pouvez générer un mot de passe d'application spécifique pour le site ADUL21.

1. **Accédez aux mots de passe d'application** :
   - Sur la page de sécurité : https://myaccount.google.com/security
   - Cherchez "Mots de passe d'application" (peut être dans "Validation en deux étapes")
   - Ou accédez directement à : https://myaccount.google.com/apppasswords

2. **Créez un nouveau mot de passe d'application** :
   - Cliquez sur "Générer un mot de passe"
   - Nom de l'application : `ADUL21 Website`
   - Appareil : `Serveur Coolify`
   - Cliquez sur "Générer"

3. **Copiez le mot de passe** :
   - Un mot de passe de 16 caractères sera généré (format : `xxxx xxxx xxxx xxxx`)
   - **IMPORTANT** : Copiez-le immédiatement, vous ne pourrez plus le revoir
   - Ce mot de passe ne contient pas d'espaces quand vous le copiez

## Étape 3 : Configuration du fichier .env

1. **Sur votre serveur Coolify**, éditez le fichier `.env` :

```bash
# Gmail SMTP Configuration
GMAIL_USER=assoligne21@gmail.com
GMAIL_APP_PASSWORD=votre_mot_de_passe_application_16_caracteres
EMAIL_FROM=ADUL21 <assoligne21@gmail.com>
```

2. **Remplacez** `votre_mot_de_passe_application_16_caracteres` par le mot de passe généré à l'étape 2.

3. **Redémarrez l'application** Coolify pour prendre en compte les nouvelles variables d'environnement.

## Étape 4 : Tester l'envoi d'emails

### Test depuis l'interface web

1. Allez sur : https://adul21.fr/temoignages/nouveau
2. Remplissez et soumettez un témoignage de test
3. Vérifiez que vous recevez l'email de confirmation

### Test depuis le serveur (optionnel)

Vous pouvez tester l'envoi d'email directement depuis le serveur :

```bash
# Connectez-vous au serveur
ssh user@votre-serveur

# Accédez au répertoire du projet
cd /path/to/adul21-website

# Créez un script de test
cat > test-email.mjs << 'EOF'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

const info = await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: 'votre-email-de-test@example.com',
  subject: 'Test SMTP ADUL21',
  html: '<h1>Test envoi email</h1><p>Si vous recevez ce mail, la configuration SMTP fonctionne !</p>'
})

console.log('Email envoyé :', info.messageId)
EOF

# Exécutez le test
node test-email.mjs

# Supprimez le script de test
rm test-email.mjs
```

## Configuration SMTP détaillée

Le site utilise les paramètres SMTP suivants :

```javascript
{
  host: 'smtp.gmail.com',
  port: 465,           // Port SSL
  secure: true,        // Utilise SSL/TLS
  auth: {
    user: 'assoligne21@gmail.com',
    pass: 'mot_de_passe_application'
  }
}
```

### Alternatives (si le port 465 est bloqué)

Si le port 465 est bloqué sur votre serveur, vous pouvez utiliser le port 587 avec STARTTLS :

```javascript
{
  host: 'smtp.gmail.com',
  port: 587,           // Port TLS
  secure: false,       // false pour STARTTLS
  auth: {
    user: 'assoligne21@gmail.com',
    pass: 'mot_de_passe_application'
  }
}
```

Pour activer cette alternative, modifiez le fichier `server/utils/email.ts` :

```typescript
transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,           // Changez de 465 à 587
  secure: false,       // Changez de true à false
  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPassword
  }
})
```

## Limites de Gmail SMTP

Gmail impose certaines limites pour éviter le spam :

- **500 emails par jour** maximum
- **500 destinataires par jour** maximum
- Les emails sont limités à **99 destinataires par email**
- Délai entre les emails : aucun (mais évitez d'envoyer trop rapidement)

Pour le site ADUL21, ces limites sont largement suffisantes car les emails sont :
- Emails de confirmation de témoignage (1 email par soumission)
- Emails de confirmation d'adhésion (quelques par jour max)
- Emails de contact (quelques par jour max)

Si vous dépassez ces limites, Gmail bloquera temporairement l'envoi pendant 24h.

## Sécurité et bonnes pratiques

### Protection du mot de passe d'application

- ✅ **NE JAMAIS** commiter le fichier `.env` dans Git
- ✅ Le fichier `.gitignore` contient déjà `.env`
- ✅ Stockez le mot de passe de manière sécurisée (gestionnaire de mots de passe)
- ✅ Sur Coolify, les variables d'environnement sont chiffrées

### Rotation du mot de passe

Pour changer le mot de passe d'application :

1. Allez sur https://myaccount.google.com/apppasswords
2. Supprimez l'ancien mot de passe "ADUL21 Website"
3. Générez-en un nouveau
4. Mettez à jour la variable `GMAIL_APP_PASSWORD` dans Coolify
5. Redémarrez l'application

### Surveillance des emails envoyés

Vous pouvez surveiller les emails envoyés depuis Gmail :

1. Allez dans Gmail : https://mail.google.com
2. Cliquez sur "Envoyés" dans la barre latérale
3. Tous les emails envoyés via SMTP apparaîtront ici

## Dépannage

### Erreur : "Invalid login: 535-5.7.8 Username and Password not accepted"

**Causes possibles** :
- La validation en deux étapes n'est pas activée
- Le mot de passe d'application est incorrect
- Vous utilisez le mot de passe du compte au lieu du mot de passe d'application

**Solutions** :
1. Vérifiez que la 2FA est bien activée
2. Régénérez un nouveau mot de passe d'application
3. Copiez-collez le mot de passe sans espaces

### Erreur : "Error: connect ETIMEDOUT"

**Causes possibles** :
- Le port 465 ou 587 est bloqué par le firewall
- Le serveur ne peut pas joindre smtp.gmail.com

**Solutions** :
1. Vérifiez que les ports SMTP sont ouverts :
   ```bash
   telnet smtp.gmail.com 465
   telnet smtp.gmail.com 587
   ```
2. Contactez votre hébergeur (OVH) pour débloquer les ports SMTP
3. Essayez l'alternative port 587 (voir section ci-dessus)

### Erreur : "Error: self signed certificate in certificate chain"

**Cause** : Problème de certificat SSL

**Solution** :
Ajoutez `tls: { rejectUnauthorized: false }` dans la configuration (non recommandé en production) :

```typescript
transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.gmailUser,
    pass: config.gmailAppPassword
  },
  tls: {
    rejectUnauthorized: false
  }
})
```

### Les emails arrivent dans les spams

**Solutions** :
1. **Configurez SPF** pour votre domaine `adul21.fr`
   - Ajoutez un enregistrement TXT DNS :
   ```
   v=spf1 include:_spf.google.com ~all
   ```

2. **Configurez DKIM** (signature des emails)
   - Contactez Google Workspace si vous avez un compte professionnel
   - Pour un compte Gmail gratuit, DKIM est automatique

3. **Configurez DMARC** pour améliorer la délivrabilité
   - Ajoutez un enregistrement TXT DNS `_dmarc.adul21.fr` :
   ```
   v=DMARC1; p=none; rua=mailto:assoligne21@gmail.com
   ```

4. **Utilisez un domaine personnalisé pour l'expéditeur**
   - Au lieu de `assoligne21@gmail.com`
   - Utilisez `noreply@adul21.fr` (nécessite Google Workspace payant)

### Gmail bloque l'envoi : "Daily user sending quota exceeded"

**Cause** : Vous avez envoyé plus de 500 emails en 24h

**Solutions** :
1. Attendez 24h pour que la limite soit réinitialisée
2. Passez à Google Workspace (quota augmenté à 2000 emails/jour)
3. Utilisez un service d'emailing dédié (Resend, SendGrid, Mailgun)

## Alternatives à Gmail SMTP

Si Gmail SMTP ne convient plus à vos besoins, voici des alternatives :

### 1. **Resend** (recommandé pour usage intensif)
- 3000 emails gratuits par mois
- Excellente délivrabilité
- API simple
- Prix : 20$/mois pour 50k emails
- Site : https://resend.com

### 2. **SendGrid**
- 100 emails gratuits par jour
- Bonne délivrabilité
- Beaucoup de fonctionnalités
- Prix : à partir de 15$/mois
- Site : https://sendgrid.com

### 3. **Mailgun**
- 5000 emails gratuits le premier mois
- Puis 0.80$ par 1000 emails
- Bonne documentation
- Site : https://www.mailgun.com

### 4. **Amazon SES**
- 62 000 emails gratuits par mois si hébergé sur AWS
- Sinon : 0.10$ par 1000 emails
- Excellente scalabilité
- Site : https://aws.amazon.com/ses

## Support

Pour toute question sur la configuration SMTP :

- **Email** : assoligne21@gmail.com
- **Documentation Nodemailer** : https://nodemailer.com
- **Documentation Gmail SMTP** : https://support.google.com/mail/answer/7126229

---

**Dernière mise à jour** : 2025-10-12
**Version** : 1.0

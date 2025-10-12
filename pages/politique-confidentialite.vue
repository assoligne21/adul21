<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
      <div class="container-custom">
        <NuxtLink
          to="/"
          class="inline-flex items-center text-primary-100 hover:text-white mb-6 transition-colors"
        >
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
          Retour à l'accueil
        </NuxtLink>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Politique de confidentialité</h1>
        <p class="text-xl text-primary-100 max-w-3xl">
          Comment nous collectons, utilisons et protégeons vos données personnelles
        </p>
      </div>
    </section>

    <!-- Introduction RGPD -->
    <section class="py-12 bg-white">
      <div class="container-custom max-w-4xl">
        <div class="bg-primary-50 border-l-4 border-primary-600 p-6">
          <div class="flex items-start">
            <Icon name="heroicons:shield-check" class="w-8 h-8 text-primary-600 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h2 class="text-xl font-bold text-gray-900 mb-3">Votre vie privée est notre priorité</h2>
              <p class="text-gray-700 mb-2">
                L'ADUL21 s'engage à protéger vos données personnelles conformément au <strong>Règlement Général sur la Protection des Données (RGPD)</strong> et à la loi Informatique et Libertés du 6 janvier 1978 modifiée.
              </p>
              <p class="text-gray-700">
                Cette politique de confidentialité vous explique de manière transparente quelles données nous collectons, pourquoi nous les collectons, comment nous les utilisons et quels sont vos droits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Politique de confidentialité content -->
    <section class="py-8 bg-gray-50">
      <div class="container-custom max-w-4xl">
        <div class="space-y-8">
          <!-- 1. Responsable du traitement -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:building-office" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Responsable du traitement des données</h2>
              </div>
            </div>

            <div class="text-gray-700 space-y-3">
              <p>
                Le responsable du traitement de vos données personnelles est :
              </p>
              <div class="bg-gray-50 rounded-lg p-6">
                <p><strong>Association de Défense des Usagers de la Ligne 21 (ADUL21)</strong></p>
                <p>Association loi 1901</p>
                <p class="mt-3">
                  <strong>Contact pour vos données personnelles :</strong><br />
                  Email : <a href="mailto:assoligne21@gmail.com" class="text-primary-600 hover:text-primary-700 underline">assoligne21@gmail.com</a><br />
                  Objet : "Données personnelles"
                </p>
              </div>
            </div>
          </article>

          <!-- 2. Données collectées -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:clipboard-document-list" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Données personnelles collectées</h2>
              </div>
            </div>

            <div class="space-y-6 text-gray-700">
              <p>
                Nous collectons uniquement les données strictement nécessaires à la réalisation de nos missions associatives. Les données collectées varient selon votre utilisation du site :
              </p>

              <!-- Témoignages -->
              <div class="bg-blue-50 border-l-4 border-blue-600 p-6">
                <h3 class="font-bold text-gray-900 mb-3 flex items-center">
                  <Icon name="heroicons:document-text" class="w-5 h-5 text-blue-600 mr-2" />
                  Formulaire de témoignage
                </h3>
                <p class="mb-2 text-sm"><strong>Données collectées :</strong></p>
                <ul class="text-sm space-y-1 mb-3">
                  <li>• Civilité, prénom, nom</li>
                  <li>• Commune de résidence</li>
                  <li>• Email</li>
                  <li>• Téléphone (optionnel)</li>
                  <li>• Catégorie d'usager (lycéen, parent, senior, etc.)</li>
                  <li>• Contenu du témoignage</li>
                </ul>
                <p class="text-sm"><strong>Finalité :</strong> Recueillir et publier des témoignages sur l'impact de la suppression de la ligne 21. Les témoignages peuvent être publiés de manière anonymisée ou avec votre accord explicite.</p>
                <p class="text-sm mt-2"><strong>Base légale :</strong> Consentement (article 6.1.a du RGPD)</p>
              </div>

              <!-- Adhésion -->
              <div class="bg-green-50 border-l-4 border-green-600 p-6">
                <h3 class="font-bold text-gray-900 mb-3 flex items-center">
                  <Icon name="heroicons:user-plus" class="w-5 h-5 text-green-600 mr-2" />
                  Formulaire d'adhésion
                </h3>
                <p class="mb-2 text-sm"><strong>Données collectées :</strong></p>
                <ul class="text-sm space-y-1 mb-3">
                  <li>• Civilité, prénom, nom</li>
                  <li>• Adresse postale complète</li>
                  <li>• Email</li>
                  <li>• Téléphone</li>
                  <li>• Date de naissance</li>
                  <li>• Montant et date de cotisation</li>
                </ul>
                <p class="text-sm"><strong>Finalité :</strong> Gestion des adhésions, envoi d'informations sur les activités de l'association, convocations aux assemblées générales.</p>
                <p class="text-sm mt-2"><strong>Base légale :</strong> Exécution d'un contrat (adhésion à l'association - article 6.1.b du RGPD)</p>
              </div>

              <!-- Contact -->
              <div class="bg-purple-50 border-l-4 border-purple-600 p-6">
                <h3 class="font-bold text-gray-900 mb-3 flex items-center">
                  <Icon name="heroicons:envelope" class="w-5 h-5 text-purple-600 mr-2" />
                  Formulaire de contact
                </h3>
                <p class="mb-2 text-sm"><strong>Données collectées :</strong></p>
                <ul class="text-sm space-y-1 mb-3">
                  <li>• Civilité, prénom, nom</li>
                  <li>• Email</li>
                  <li>• Téléphone (optionnel)</li>
                  <li>• Sujet et contenu du message</li>
                </ul>
                <p class="text-sm"><strong>Finalité :</strong> Répondre à vos demandes d'information, questions ou sollicitations.</p>
                <p class="text-sm mt-2"><strong>Base légale :</strong> Consentement (article 6.1.a du RGPD)</p>
              </div>

              <!-- Dons -->
              <div class="bg-orange-50 border-l-4 border-orange-600 p-6">
                <h3 class="font-bold text-gray-900 mb-3 flex items-center">
                  <Icon name="heroicons:heart" class="w-5 h-5 text-orange-600 mr-2" />
                  Formulaire de don
                </h3>
                <p class="mb-2 text-sm"><strong>Données collectées :</strong></p>
                <ul class="text-sm space-y-1 mb-3">
                  <li>• Civilité, prénom, nom</li>
                  <li>• Adresse postale (pour l'envoi du reçu fiscal)</li>
                  <li>• Email</li>
                  <li>• Montant et date du don</li>
                </ul>
                <p class="text-sm"><strong>Finalité :</strong> Gestion des dons, émission des reçus fiscaux, envoi de remerciements.</p>
                <p class="text-sm mt-2"><strong>Base légale :</strong> Obligation légale (émission de reçus fiscaux - article 6.1.c du RGPD) et consentement</p>
              </div>

              <!-- Navigation -->
              <div class="bg-gray-100 border-l-4 border-gray-600 p-6">
                <h3 class="font-bold text-gray-900 mb-3 flex items-center">
                  <Icon name="heroicons:computer-desktop" class="w-5 h-5 text-gray-600 mr-2" />
                  Données de navigation
                </h3>
                <p class="text-sm mb-3">
                  Nous utilisons <strong>Plausible Analytics</strong>, une solution d'analyse web respectueuse de la vie privée qui <strong>ne collecte AUCUNE donnée personnelle</strong>.
                </p>
                <p class="text-sm mb-2"><strong>Données collectées (anonymes) :</strong></p>
                <ul class="text-sm space-y-1 mb-3">
                  <li>• Pages visitées</li>
                  <li>• Provenance géographique générale (pays/région)</li>
                  <li>• Type d'appareil (mobile, desktop, tablette)</li>
                  <li>• Navigateur utilisé</li>
                </ul>
                <p class="text-sm">
                  <strong>Important :</strong> Plausible n'utilise pas de cookies, ne collecte pas d'adresse IP, et ne permet pas de vous identifier individuellement. Ces statistiques sont entièrement anonymes et conformes au RGPD.
                </p>
              </div>
            </div>
          </article>

          <!-- 3. Finalités et utilisation -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:eye" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">3. Finalités du traitement</h2>
              </div>
            </div>

            <div class="text-gray-700 space-y-4">
              <p>
                Vos données personnelles sont collectées et traitées <strong>uniquement</strong> pour les finalités suivantes :
              </p>
              <ul class="space-y-2 ml-6">
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Gestion de votre adhésion et de vos cotisations</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Publication de témoignages (avec votre consentement explicite)</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Réponse à vos demandes de contact</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Gestion des dons et émission de reçus fiscaux</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Communication sur les activités et actions de l'association</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Organisation d'événements et de réunions</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Respect de nos obligations légales et comptables</span>
                </li>
              </ul>

              <div class="bg-red-50 border-l-4 border-red-600 p-4 mt-6">
                <p class="text-sm font-bold text-gray-900 mb-2">
                  <Icon name="heroicons:no-symbol" class="w-5 h-5 text-red-600 inline mr-2" />
                  Ce que nous ne faisons PAS avec vos données :
                </p>
                <ul class="text-sm space-y-1">
                  <li>✗ Nous ne vendons jamais vos données</li>
                  <li>✗ Nous ne partageons pas vos données avec des partenaires commerciaux</li>
                  <li>✗ Nous n'envoyons pas de publicité</li>
                  <li>✗ Nous n'utilisons pas de profilage ou de ciblage publicitaire</li>
                </ul>
              </div>
            </div>
          </article>

          <!-- 4. Destinataires -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:user-group" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Destinataires de vos données</h2>
              </div>
            </div>

            <div class="text-gray-700 space-y-4">
              <p>
                Vos données personnelles sont traitées <strong>uniquement par les membres habilités de l'ADUL21</strong> (bureau de l'association) dans le cadre strict de leurs fonctions.
              </p>

              <h3 class="font-bold text-gray-900 mt-6 mb-3">Sous-traitants techniques</h3>
              <p>
                Pour le fonctionnement du site, nous faisons appel aux prestataires techniques suivants, qui agissent en qualité de sous-traitants au sens du RGPD :
              </p>

              <div class="space-y-4 mt-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="font-bold text-gray-900 mb-2">PostgreSQL (base de données)</h4>
                  <p class="text-sm mb-2">
                    <strong>Service :</strong> Hébergement et gestion de la base de données contenant vos informations (témoignages, adhésions, contacts, dons)
                  </p>
                  <p class="text-sm mb-2">
                    <strong>Localisation :</strong> Serveurs hébergés en France
                  </p>
                  <p class="text-sm">
                    <strong>Conformité RGPD :</strong> Base de données hébergée en France, conforme au RGPD
                  </p>
                </div>

                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="font-bold text-gray-900 mb-2">Gmail SMTP (envoi d'emails)</h4>
                  <p class="text-sm mb-2">
                    <strong>Service :</strong> Envoi des emails transactionnels (confirmations, reçus, notifications)
                  </p>
                  <p class="text-sm mb-2">
                    <strong>Fournisseur :</strong> Google LLC
                  </p>
                  <p class="text-sm">
                    <strong>Conformité RGPD :</strong> Google a signé les clauses contractuelles types de l'UE pour les transferts de données
                  </p>
                </div>

                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="font-bold text-gray-900 mb-2">Plausible Analytics (statistiques)</h4>
                  <p class="text-sm mb-2">
                    <strong>Service :</strong> Mesure d'audience du site (données 100% anonymes)
                  </p>
                  <p class="text-sm mb-2">
                    <strong>Localisation :</strong> Union Européenne (Allemagne)
                  </p>
                  <p class="text-sm">
                    <strong>Conformité RGPD :</strong> Plausible est conforme au RGPD et ne collecte aucune donnée personnelle
                  </p>
                </div>
              </div>

              <div class="bg-blue-50 border-l-4 border-blue-600 p-4 mt-6">
                <p class="text-sm text-gray-900">
                  <Icon name="heroicons:information-circle" class="w-5 h-5 text-blue-600 inline mr-2" />
                  <strong>Garantie de confidentialité :</strong> Tous nos sous-traitants sont soumis à des obligations contractuelles strictes de sécurité et de confidentialité. Ils ne peuvent utiliser vos données que pour les finalités définies par l'ADUL21.
                </p>
              </div>
            </div>
          </article>

          <!-- 5. Durée de conservation -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:clock" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">5. Durée de conservation des données</h2>
              </div>
            </div>

            <div class="text-gray-700 space-y-4">
              <p>
                Vos données sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :
              </p>

              <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="border border-gray-300 px-4 py-2 text-left">Type de données</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Durée de conservation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="border border-gray-300 px-4 py-2">Adhérents actifs</td>
                      <td class="border border-gray-300 px-4 py-2">Durée de l'adhésion + 1 an</td>
                    </tr>
                    <tr class="bg-gray-50">
                      <td class="border border-gray-300 px-4 py-2">Anciens adhérents</td>
                      <td class="border border-gray-300 px-4 py-2">3 ans après la fin de l'adhésion</td>
                    </tr>
                    <tr>
                      <td class="border border-gray-300 px-4 py-2">Témoignages publiés</td>
                      <td class="border border-gray-300 px-4 py-2">Jusqu'à retrait du consentement ou dissolution de l'association</td>
                    </tr>
                    <tr class="bg-gray-50">
                      <td class="border border-gray-300 px-4 py-2">Messages de contact</td>
                      <td class="border border-gray-300 px-4 py-2">1 an après la dernière interaction</td>
                    </tr>
                    <tr>
                      <td class="border border-gray-300 px-4 py-2">Données de dons</td>
                      <td class="border border-gray-300 px-4 py-2">10 ans (obligation légale fiscale et comptable)</td>
                    </tr>
                    <tr class="bg-gray-50">
                      <td class="border border-gray-300 px-4 py-2">Documents comptables</td>
                      <td class="border border-gray-300 px-4 py-2">10 ans (obligation légale)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p class="mt-4 text-sm">
                À l'issue de ces durées, vos données sont supprimées de manière sécurisée ou anonymisées de façon irréversible.
              </p>
            </div>
          </article>

          <!-- 6. Sécurité -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:lock-closed" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">6. Sécurité de vos données</h2>
              </div>
            </div>

            <div class="text-gray-700 space-y-4">
              <p>
                L'ADUL21 met en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre la destruction, la perte, l'altération, la divulgation non autorisée ou l'accès non autorisé.
              </p>

              <h3 class="font-bold text-gray-900 mt-6 mb-3">Mesures de sécurité mises en place :</h3>
              <ul class="space-y-2 ml-6">
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Chiffrement HTTPS :</strong> Toutes les communications entre votre navigateur et notre site sont chiffrées</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Base de données sécurisée :</strong> Accès restreint et chiffrement des données sensibles</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Authentification forte :</strong> Protection par mot de passe robuste pour les accès administrateurs</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Sauvegardes régulières :</strong> Copies de sécurité automatiques et chiffrées</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Accès limités :</strong> Seuls les membres habilités du bureau ont accès aux données</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Mises à jour de sécurité :</strong> Maintenance régulière du site et des systèmes</span>
                </li>
              </ul>

              <div class="bg-yellow-50 border-l-4 border-yellow-600 p-4 mt-6">
                <p class="text-sm text-gray-900">
                  <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-yellow-600 inline mr-2" />
                  <strong>En cas de violation de données :</strong> Conformément au RGPD, nous nous engageons à vous notifier dans les 72 heures toute violation de données susceptible de présenter un risque pour vos droits et libertés.
                </p>
              </div>
            </div>
          </article>

          <!-- 7. Vos droits -->
          <article class="card p-8 border-2 border-primary-200">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:hand-raised" class="w-6 h-6" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">7. Vos droits sur vos données</h2>
              </div>
            </div>

            <div class="text-gray-700 space-y-6">
              <p class="text-lg font-medium">
                Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
              </p>

              <!-- Droit d'accès -->
              <div class="bg-blue-50 rounded-lg p-6">
                <h3 class="font-bold text-gray-900 mb-2 flex items-center">
                  <Icon name="heroicons:eye" class="w-5 h-5 text-blue-600 mr-2" />
                  Droit d'accès (article 15 RGPD)
                </h3>
                <p class="text-sm">
                  Vous pouvez demander à accéder à l'ensemble de vos données personnelles que nous détenons et obtenir une copie de celles-ci.
                </p>
              </div>

              <!-- Droit de rectification -->
              <div class="bg-green-50 rounded-lg p-6">
                <h3 class="font-bold text-gray-900 mb-2 flex items-center">
                  <Icon name="heroicons:pencil-square" class="w-5 h-5 text-green-600 mr-2" />
                  Droit de rectification (article 16 RGPD)
                </h3>
                <p class="text-sm">
                  Vous pouvez demander la correction de vos données si elles sont inexactes ou incomplètes.
                </p>
              </div>

              <!-- Droit à l'effacement -->
              <div class="bg-red-50 rounded-lg p-6">
                <h3 class="font-bold text-gray-900 mb-2 flex items-center">
                  <Icon name="heroicons:trash" class="w-5 h-5 text-red-600 mr-2" />
                  Droit à l'effacement - "Droit à l'oubli" (article 17 RGPD)
                </h3>
                <p class="text-sm mb-2">
                  Vous pouvez demander la suppression de vos données personnelles dans les cas suivants :
                </p>
                <ul class="text-sm space-y-1 ml-4">
                  <li>• Vos données ne sont plus nécessaires aux finalités pour lesquelles elles ont été collectées</li>
                  <li>• Vous retirez votre consentement</li>
                  <li>• Vous vous opposez au traitement de vos données</li>
                  <li>• Vos données ont fait l'objet d'un traitement illicite</li>
                </ul>
                <p class="text-sm mt-2 italic">
                  <strong>Exception :</strong> Les données de dons sont conservées 10 ans pour obligation légale fiscale et ne peuvent être supprimées avant ce délai.
                </p>
              </div>

              <!-- Droit à la limitation -->
              <div class="bg-yellow-50 rounded-lg p-6">
                <h3 class="font-bold text-gray-900 mb-2 flex items-center">
                  <Icon name="heroicons:pause-circle" class="w-5 h-5 text-yellow-600 mr-2" />
                  Droit à la limitation du traitement (article 18 RGPD)
                </h3>
                <p class="text-sm">
                  Vous pouvez demander de geler temporairement l'utilisation de vos données (par exemple pendant la vérification de l'exactitude de vos données).
                </p>
              </div>

              <!-- Droit à la portabilité -->
              <div class="bg-purple-50 rounded-lg p-6">
                <h3 class="font-bold text-gray-900 mb-2 flex items-center">
                  <Icon name="heroicons:arrow-down-tray" class="w-5 h-5 text-purple-600 mr-2" />
                  Droit à la portabilité (article 20 RGPD)
                </h3>
                <p class="text-sm">
                  Vous pouvez récupérer vos données dans un format structuré et lisible par machine (CSV, JSON) pour les transmettre à un autre organisme.
                </p>
              </div>

              <!-- Droit d'opposition -->
              <div class="bg-orange-50 rounded-lg p-6">
                <h3 class="font-bold text-gray-900 mb-2 flex items-center">
                  <Icon name="heroicons:hand-raised" class="w-5 h-5 text-orange-600 mr-2" />
                  Droit d'opposition (article 21 RGPD)
                </h3>
                <p class="text-sm">
                  Vous pouvez vous opposer à tout moment au traitement de vos données pour des raisons tenant à votre situation particulière. Vous pouvez également vous opposer au démarchage commercial (nous n'en faisons pas).
                </p>
              </div>

              <!-- Droit de retirer son consentement -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="font-bold text-gray-900 mb-2 flex items-center">
                  <Icon name="heroicons:x-circle" class="w-5 h-5 text-gray-600 mr-2" />
                  Droit de retirer son consentement (article 7 RGPD)
                </h3>
                <p class="text-sm">
                  Lorsque le traitement est fondé sur votre consentement (témoignages, newsletter), vous pouvez retirer votre consentement à tout moment sans justification.
                </p>
              </div>

              <!-- Comment exercer vos droits -->
              <div class="bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 rounded-lg p-6 mt-8">
                <h3 class="font-bold text-gray-900 mb-4 text-lg flex items-center">
                  <Icon name="heroicons:envelope" class="w-6 h-6 text-primary-600 mr-2" />
                  Comment exercer vos droits ?
                </h3>
                <p class="text-sm mb-4">
                  Pour exercer l'un de ces droits, envoyez-nous un email à l'adresse suivante :
                </p>
                <div class="bg-white rounded-lg p-4 border border-primary-200">
                  <p class="font-bold text-primary-700 text-lg">
                    <a href="mailto:assoligne21@gmail.com" class="hover:text-primary-800">assoligne21@gmail.com</a>
                  </p>
                  <p class="text-sm text-gray-600 mt-2">Objet : "Exercice de mes droits RGPD"</p>
                </div>
                <p class="text-sm mt-4 mb-3">
                  <strong>Informations à fournir dans votre demande :</strong>
                </p>
                <ul class="text-sm space-y-1 ml-4">
                  <li>• Nom et prénom</li>
                  <li>• Adresse email utilisée sur le site</li>
                  <li>• Nature de la demande (accès, rectification, suppression, etc.)</li>
                  <li>• Copie d'une pièce d'identité (pour vérification)</li>
                </ul>
                <p class="text-sm mt-4 italic text-gray-600">
                  <Icon name="heroicons:clock" class="w-4 h-4 inline mr-1" />
                  Nous nous engageons à répondre à votre demande dans un délai maximum d'<strong>1 mois</strong> à compter de sa réception.
                </p>
              </div>
            </div>
          </article>

          <!-- 8. Réclamation CNIL -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:megaphone" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">8. Droit de réclamation auprès de la CNIL</h2>
              </div>
            </div>

            <div class="text-gray-700 space-y-4">
              <p>
                Si vous estimez que vos droits ne sont pas respectés ou que le traitement de vos données n'est pas conforme à la réglementation, vous avez le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente :
              </p>

              <div class="bg-gray-50 rounded-lg p-6">
                <p class="font-bold text-gray-900 mb-3">Commission Nationale de l'Informatique et des Libertés (CNIL)</p>
                <p class="mb-2"><strong>Adresse postale :</strong></p>
                <p class="mb-3">
                  CNIL<br />
                  3 Place de Fontenoy<br />
                  TSA 80715<br />
                  75334 PARIS CEDEX 07
                </p>
                <p class="mb-2"><strong>Téléphone :</strong> 01 53 73 22 22</p>
                <p class="mb-2">
                  <strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">www.cnil.fr</a>
                </p>
                <p>
                  <strong>Formulaire de réclamation en ligne :</strong> <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">www.cnil.fr/fr/plaintes</a>
                </p>
              </div>

              <p class="text-sm italic">
                Nous vous encourageons toutefois à nous contacter en priorité afin que nous puissions répondre à vos préoccupations de manière directe et rapide.
              </p>
            </div>
          </article>

          <!-- 9. Modifications -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:arrow-path" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">9. Modifications de la politique de confidentialité</h2>
              </div>
            </div>

            <div class="text-gray-700">
              <p class="mb-4">
                L'ADUL21 se réserve le droit de modifier cette politique de confidentialité à tout moment, notamment pour s'adapter aux évolutions législatives, réglementaires ou technologiques.
              </p>
              <p>
                Toute modification substantielle vous sera notifiée par email (pour les adhérents) ou par une annonce visible sur le site. La version en vigueur est toujours celle accessible sur cette page, avec indication de la date de dernière mise à jour.
              </p>
            </div>
          </article>

          <!-- 10. Contact -->
          <article class="card p-8 bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:envelope" class="w-6 h-6" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">10. Contact</h2>
              </div>
            </div>

            <div class="text-gray-700">
              <p class="mb-4">
                Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles, vous pouvez nous contacter :
              </p>
              <div class="bg-white rounded-lg p-6 border border-primary-200">
                <p class="mb-3"><strong>Par email :</strong></p>
                <p class="text-primary-700 font-bold text-lg mb-4">
                  <a href="mailto:assoligne21@gmail.com" class="hover:text-primary-800">assoligne21@gmail.com</a>
                </p>
                <p class="text-sm text-gray-600 mb-4">
                  Nous nous engageons à vous répondre dans les meilleurs délais.
                </p>
                <NuxtLink to="/contact" class="btn-primary inline-flex items-center">
                  <Icon name="heroicons:paper-airplane" class="w-5 h-5 mr-2" />
                  Accéder au formulaire de contact
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <!-- Date de mise à jour -->
        <div class="mt-12 text-center bg-gray-50 rounded-xl p-6">
          <p class="text-sm text-gray-600">
            <Icon name="heroicons:calendar" class="w-4 h-4 inline mr-2" />
            <strong>Dernière mise à jour de cette politique de confidentialité :</strong> {{ lastUpdateDate }}
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Version 1.0
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Date de dernière mise à jour (format français)
const lastUpdateDate = new Date().toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

useHead({
  title: 'Politique de confidentialité',
  meta: [
    {
      name: 'description',
      content: 'Politique de confidentialité RGPD de l\'ADUL21 : protection de vos données personnelles, vos droits (accès, rectification, suppression, portabilité), cookies et mesure d\'audience.'
    },
    {
      name: 'keywords',
      content: 'RGPD, protection données, vie privée, confidentialité, droits RGPD, cookies, CNIL, données personnelles'
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Politique de confidentialité - ADUL21' },
    { property: 'og:description', content: 'Comment nous protégeons vos données personnelles conformément au RGPD.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

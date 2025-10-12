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
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Mentions légales</h1>
        <p class="text-xl text-primary-100 max-w-3xl">
          Informations légales relatives au site web de l'ADUL21
        </p>
      </div>
    </section>

    <!-- Mentions légales content -->
    <section class="py-16 bg-white">
      <div class="container-custom max-w-4xl">
        <div class="space-y-12">
          <!-- 1. Éditeur du site -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:building-office" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Éditeur du site</h2>
              </div>
            </div>

            <div class="space-y-3 text-gray-700">
              <p>
                Le site web <strong>adul21.fr</strong> est édité par :
              </p>
              <div class="bg-gray-50 rounded-lg p-6 space-y-2">
                <p><strong>Association de Défense des Usagers de la Ligne 21 (ADUL21)</strong></p>
                <p>Association loi 1901</p>
                <p>
                  <strong>Siège social :</strong><br />
                  [Adresse complète]<br />
                  [Code postal] [Ville]
                </p>
                <p>
                  <strong>SIRET :</strong> [Numéro SIRET à compléter]
                </p>
                <p>
                  <strong>Email :</strong> <a href="mailto:assoligne21@gmail.com" class="text-primary-600 hover:text-primary-700 underline">assoligne21@gmail.com</a>
                </p>
              </div>
              <p class="text-sm text-gray-600 italic mt-4">
                <Icon name="heroicons:information-circle" class="w-4 h-4 inline mr-1" />
                En tant qu'association loi 1901 à but non lucratif, l'ADUL21 n'est pas assujettie à l'immatriculation au Registre du Commerce et des Sociétés (RCS) ni à la TVA.
              </p>
            </div>
          </article>

          <!-- 2. Directeur de publication -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:user-circle" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Directeur de publication</h2>
              </div>
            </div>

            <div class="text-gray-700">
              <p>
                Le directeur de publication du site est le Président de l'association ADUL21, légalement responsable du contenu éditorial.
              </p>
              <p class="mt-3">
                <strong>Contact :</strong> <a href="mailto:assoligne21@gmail.com" class="text-primary-600 hover:text-primary-700 underline">assoligne21@gmail.com</a>
              </p>
            </div>
          </article>

          <!-- 3. Hébergement -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:server" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">3. Hébergement</h2>
              </div>
            </div>

            <div class="space-y-3 text-gray-700">
              <p>Le site est hébergé par :</p>
              <div class="bg-gray-50 rounded-lg p-6 space-y-2">
                <p><strong>[Nom de l'hébergeur]</strong></p>
                <p>
                  [Adresse complète de l'hébergeur]<br />
                  [Code postal] [Ville] - [Pays]
                </p>
                <p><strong>Téléphone :</strong> [Numéro de téléphone]</p>
                <p><strong>Site web :</strong> [URL de l'hébergeur]</p>
              </div>
            </div>
          </article>

          <!-- 4. Propriété intellectuelle -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:shield-check" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
              </div>
            </div>

            <div class="space-y-4 text-gray-700">
              <p>
                L'ensemble du contenu de ce site (structure, textes, images, graphismes, logo, icônes, sons, logiciels, bases de données) est la propriété exclusive de l'ADUL21, à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de l'ADUL21.
              </p>
              <p>
                Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
              </p>

              <div class="bg-primary-50 border-l-4 border-primary-600 p-4 mt-6">
                <h3 class="font-bold text-gray-900 mb-2">Usage autorisé</h3>
                <p class="text-sm">
                  Les contenus publiés sur ce site peuvent être partagés et cités à des fins d'information ou de militantisme associatif, à condition de mentionner clairement la source (ADUL21) et de ne pas en faire un usage commercial.
                </p>
              </div>
            </div>
          </article>

          <!-- 5. Données personnelles -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:lock-closed" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">5. Protection des données personnelles</h2>
              </div>
            </div>

            <div class="space-y-4 text-gray-700">
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de rectification, de suppression, de limitation et de portabilité des données vous concernant.
              </p>
              <p>
                Les données personnelles collectées via les formulaires du site (témoignages, adhésion, contact, dons) sont traitées exclusivement dans le cadre des activités de l'association et ne sont jamais transmises à des tiers.
              </p>
              <p>
                <strong>Responsable du traitement :</strong> ADUL21<br />
                <strong>Contact pour exercer vos droits :</strong> <a href="mailto:assoligne21@gmail.com" class="text-primary-600 hover:text-primary-700 underline">assoligne21@gmail.com</a>
              </p>
              <p>
                Pour plus d'informations sur la gestion de vos données personnelles, consultez notre
                <NuxtLink to="/politique-confidentialite" class="text-primary-600 hover:text-primary-700 underline font-medium">
                  politique de confidentialité
                </NuxtLink>.
              </p>

              <div class="bg-gray-50 rounded-lg p-4 mt-4">
                <p class="text-sm text-gray-900">
                  <Icon name="heroicons:information-circle" class="w-5 h-5 text-primary-600 inline mr-2" />
                  Vous pouvez également introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) si vous estimez que vos droits ne sont pas respectés : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">www.cnil.fr</a>
                </p>
              </div>
            </div>
          </article>

          <!-- 6. Cookies et traceurs -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:computer-desktop" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">6. Cookies et mesure d'audience</h2>
              </div>
            </div>

            <div class="space-y-4 text-gray-700">
              <p>
                <strong>Ce site n'utilise PAS de cookies publicitaires ou de tracking intrusif.</strong>
              </p>
              <p>
                Pour mesurer l'audience de notre site et améliorer l'expérience utilisateur, nous utilisons <strong>Plausible Analytics</strong>, une solution d'analyse web respectueuse de la vie privée et conforme au RGPD.
              </p>

              <div class="bg-green-50 border-l-4 border-green-600 p-6 space-y-3">
                <h3 class="font-bold text-gray-900">Pourquoi Plausible ?</h3>
                <ul class="space-y-2 text-sm">
                  <li class="flex items-start">
                    <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Sans cookies :</strong> aucun cookie n'est déposé sur votre navigateur</span>
                  </li>
                  <li class="flex items-start">
                    <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Anonyme :</strong> vos données personnelles ne sont pas collectées</span>
                  </li>
                  <li class="flex items-start">
                    <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Conforme RGPD :</strong> pas besoin de bandeau de consentement</span>
                  </li>
                  <li class="flex items-start">
                    <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Hébergement européen :</strong> vos données restent dans l'UE</span>
                  </li>
                  <li class="flex items-start">
                    <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Open source :</strong> code transparent et vérifiable</span>
                  </li>
                </ul>
              </div>

              <p class="text-sm">
                Les données collectées par Plausible sont limitées aux statistiques de fréquentation anonymes (pages visitées, provenance géographique générale, type d'appareil) et ne permettent en aucun cas de vous identifier personnellement.
              </p>
              <p class="text-sm">
                Pour en savoir plus sur Plausible Analytics : <a href="https://plausible.io/privacy-focused-web-analytics" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">plausible.io/privacy-focused-web-analytics</a>
              </p>
            </div>
          </article>

          <!-- 7. Liens hypertextes -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:link" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">7. Liens hypertextes</h2>
              </div>
            </div>

            <div class="space-y-4 text-gray-700">
              <p>
                Le site adul21.fr peut contenir des liens hypertextes vers d'autres sites présents sur le réseau Internet. L'ADUL21 n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur disponibilité ou leur politique de confidentialité.
              </p>
              <p>
                La création de liens hypertextes vers le site adul21.fr est libre et ne nécessite pas d'autorisation préalable, sous réserve que ces liens ne portent pas atteinte à l'image de l'association et qu'ils ne donnent pas une image trompeuse du site ou de ses objectifs.
              </p>
            </div>
          </article>

          <!-- 8. Limitation de responsabilité -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">8. Limitation de responsabilité</h2>
              </div>
            </div>

            <div class="space-y-4 text-gray-700">
              <p>
                L'ADUL21 s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu.
              </p>
              <p>
                Toutefois, l'ADUL21 ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site. En conséquence, l'ADUL21 décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site.
              </p>
              <p>
                L'ADUL21 ne pourra être tenue responsable des dommages directs ou indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder, notamment en cas d'interruption, de dysfonctionnement, de retard de transmission, de virus informatique, etc.
              </p>
            </div>
          </article>

          <!-- 9. Droit applicable -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:scale" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">9. Droit applicable et juridiction compétente</h2>
              </div>
            </div>

            <div class="text-gray-700">
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, le différend sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
              </p>
            </div>
          </article>

          <!-- 10. Crédits -->
          <article class="card p-8">
            <div class="flex items-start mb-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:heart" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">10. Crédits et remerciements</h2>
              </div>
            </div>

            <div class="space-y-3 text-gray-700">
              <p><strong>Conception et développement :</strong></p>
              <ul class="space-y-2 ml-6">
                <li>Site web développé avec Nuxt 3 (Vue.js)</li>
                <li>Design basé sur Tailwind CSS</li>
                <li>Icônes : Heroicons</li>
                <li>Analytics : Plausible Analytics</li>
              </ul>
              <p class="mt-4">
                <strong>Remerciements :</strong><br />
                Un grand merci à tous les bénévoles, adhérents et sympathisants qui contribuent au développement et à l'animation de ce site ainsi qu'à la défense de nos droits.
              </p>
            </div>
          </article>
        </div>

        <!-- Contact -->
        <div class="mt-12 text-center bg-gray-50 rounded-xl p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Questions concernant ces mentions légales ?</h2>
          <p class="text-gray-600 mb-6">
            Pour toute question relative aux mentions légales ou à l'utilisation du site, n'hésitez pas à nous contacter.
          </p>
          <NuxtLink to="/contact" class="btn-primary inline-flex items-center">
            <Icon name="heroicons:envelope" class="w-5 h-5 mr-2" />
            Nous contacter
          </NuxtLink>
        </div>

        <!-- Date de mise à jour -->
        <div class="mt-8 text-center text-sm text-gray-500">
          <p>Dernière mise à jour : {{ lastUpdateDate }}</p>
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
  title: 'Mentions légales',
  meta: [
    {
      name: 'description',
      content: 'Mentions légales du site ADUL21 : informations sur l\'éditeur, l\'hébergement, la propriété intellectuelle, la protection des données personnelles et les cookies.'
    },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Mentions légales - ADUL21' },
    { property: 'og:description', content: 'Informations légales relatives au site web de l\'ADUL21.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

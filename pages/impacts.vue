<script setup lang="ts">
useHead({
  title: 'Impacts chiffrés',
  meta: [
    {
      name: 'description',
      content: 'Découvrez l\'impact réel de la suppression de la ligne 21 directe : coûts, temps de trajet, pollution. Données chiffrées et comparatifs avant/après.'
    }
  ]
})

// Données Ledenon
const ledenonData = {
  distance: '9,2 km',
  distanceRoundTrip: '18,4 km',
  costPerDay: '~1,80€',
  time: '22 min',
  costPerMonth: '194€',
  costPerYear: '194€',
  co2PerDay: '4,8 kg',
  co2PerYear: '520 kg',
  timePerYear: '40 heures'
}

// Données Cabrières
const cabrieresData = {
  distance: '6 km',
  distanceRoundTrip: '12 km',
  costPerDay: '~1,20€',
  time: '14 min',
  costPerMonth: '130€',
  costPerYear: '130€',
  co2PerDay: '3,1 kg',
  co2PerYear: '335 kg',
  timePerYear: '25 heures'
}

// Impact global
const globalImpact = {
  residents: '700+',
  students: '120+',
  timeMultiplier: 'x2',
  extraCarTrips: '+80',
  co2PerYear: '+1.000 tonnes'
}

// Comparaison avant/après pour différents profils
const profiles = [
  {
    title: 'Lycéen Ledenon → Lycée Nîmes',
    before: {
      time: '35 min',
      changes: '0',
      cost: '0€ (carte jeune)',
      autonomy: 'Totale'
    },
    after: {
      time: '1h15 - 1h30',
      changes: '1-2',
      cost: 'Dépend des parents',
      autonomy: 'Perdue'
    }
  },
  {
    title: 'Parent Cabrières (3x/semaine)',
    before: {
      time: 'Non concerné',
      changes: 'Non concerné',
      cost: '0€',
      autonomy: 'Enfant autonome'
    },
    after: {
      time: '16 min A/R',
      changes: '0',
      cost: '15,60€/mois',
      autonomy: 'Doit conduire'
    }
  },
  {
    title: 'Senior PMR vers hôpital Nîmes',
    before: {
      time: '45 min',
      changes: '0',
      cost: '2€ (tarif réduit)',
      autonomy: 'Peut y aller seul'
    },
    after: {
      time: '1h30 - 2h',
      changes: '1-2',
      cost: 'Taxi 30€+ ou famille',
      autonomy: 'Dépendant'
    }
  }
]
</script>

<template>
  <UContainer class="py-16">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
        Impacts chiffrés
      </h1>
      <p class="text-xl text-muted max-w-3xl">
        La suppression de la ligne directe a des conséquences mesurables et dramatiques sur le quotidien des habitants. Voici les chiffres.
      </p>
    </div>

    <!-- Alerte Impact Écologique -->
    <UAlert
      icon="i-heroicons-exclamation-triangle"
      color="orange"
      variant="soft"
      title="Paradoxe écologique"
      description="Nîmes Métropole nous FORCE à utiliser la voiture alors que nous voulions prendre le bus !"
      class="mb-12"
    />

    <!-- Détours obligatoires -->
    <div class="mb-16">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Détours obligatoires imposés
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Ledenon -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                L
              </div>
              <div>
                <h3 class="text-xl font-bold">Ledenon → Marguerittes</h3>
                <p class="text-sm text-muted">Pour rejoindre une ligne de bus</p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
              <span class="text-muted">Distance (aller simple)</span>
              <span class="font-bold text-lg">{{ ledenonData.distance }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
              <span class="text-muted">Aller-retour quotidien</span>
              <span class="font-bold text-lg">{{ ledenonData.distanceRoundTrip }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
              <span class="text-muted">Coût carburant par jour</span>
              <span class="font-bold text-lg text-red-600">{{ ledenonData.costPerDay }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
              <span class="text-muted">Temps perdu par jour</span>
              <span class="font-bold text-lg">{{ ledenonData.time }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
              <span class="text-muted">CO2 émis par jour</span>
              <span class="font-bold text-lg text-orange-600">{{ ledenonData.co2PerDay }}</span>
            </div>
          </div>

          <template #footer>
            <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 space-y-2">
              <p class="font-bold text-red-900 mb-2">Sur une année scolaire (36 semaines) :</p>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="font-semibold">Surcoût carburant :</span>
                  <span class="font-bold text-red-600">{{ ledenonData.costPerYear }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-semibold">CO2 supplémentaire :</span>
                  <span class="font-bold text-red-600">{{ ledenonData.co2PerYear }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-semibold">Temps perdu :</span>
                  <span class="font-bold text-red-600">{{ ledenonData.timePerYear }}</span>
                </div>
              </div>
            </div>
          </template>
        </UCard>

        <!-- Cabrières -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
              <div>
                <h3 class="text-xl font-bold">Cabrières → Marguerittes</h3>
                <p class="text-sm text-muted">Pour rejoindre une ligne de bus</p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
              <span class="text-muted">Distance (aller simple)</span>
              <span class="font-bold text-lg">{{ cabrieresData.distance }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
              <span class="text-muted">Aller-retour quotidien</span>
              <span class="font-bold text-lg">{{ cabrieresData.distanceRoundTrip }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
              <span class="text-muted">Coût carburant par jour</span>
              <span class="font-bold text-lg text-red-600">{{ cabrieresData.costPerDay }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
              <span class="text-muted">Temps perdu par jour</span>
              <span class="font-bold text-lg">{{ cabrieresData.time }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-800">
              <span class="text-muted">CO2 émis par jour</span>
              <span class="font-bold text-lg text-orange-600">{{ cabrieresData.co2PerDay }}</span>
            </div>
          </div>

          <template #footer>
            <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 space-y-2">
              <p class="font-bold text-orange-900 mb-2">Sur une année scolaire (36 semaines) :</p>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="font-semibold">Surcoût carburant :</span>
                  <span class="font-bold text-orange-600">{{ cabrieresData.costPerYear }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-semibold">CO2 supplémentaire :</span>
                  <span class="font-bold text-orange-600">{{ cabrieresData.co2PerYear }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-semibold">Temps perdu :</span>
                  <span class="font-bold text-orange-600">{{ cabrieresData.timePerYear }}</span>
                </div>
              </div>
            </div>
          </template>
        </UCard>
      </div>

      <UAlert
        icon="i-heroicons-information-circle"
        color="primary"
        variant="subtle"
        class="mt-6"
        description="Sans compter : usure véhicule, risque d'accident, stress, impact sur l'environnement, impossibilité pour ceux qui n'ont pas de voiture."
      />
    </div>

    <!-- Comparaisons avant/après par profil -->
    <div class="mb-16">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Impact par profil d'usager
      </h2>

      <div class="space-y-6">
        <UCard
          v-for="(profile, index) in profiles"
          :key="index"
        >
          <template #header>
            <h3 class="text-lg font-bold">{{ profile.title }}</h3>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Avant -->
            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-4">
                <Icon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600" />
                <span class="font-bold text-green-700 dark:text-green-400">AVANT (avec ligne directe)</span>
              </div>
              <div class="space-y-3">
                <div>
                  <span class="text-sm text-muted block">Temps de trajet</span>
                  <span class="font-semibold">{{ profile.before.time }}</span>
                </div>
                <div>
                  <span class="text-sm text-muted block">Correspondances</span>
                  <span class="font-semibold">{{ profile.before.changes }}</span>
                </div>
                <div>
                  <span class="text-sm text-muted block">Coût</span>
                  <span class="font-semibold">{{ profile.before.cost }}</span>
                </div>
                <div>
                  <span class="text-sm text-muted block">Autonomie</span>
                  <span class="font-semibold">{{ profile.before.autonomy }}</span>
                </div>
              </div>
            </div>

            <!-- Après -->
            <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-4">
                <Icon name="i-heroicons-x-circle" class="w-6 h-6 text-red-600" />
                <span class="font-bold text-red-700 dark:text-red-400">APRÈS (sans ligne directe)</span>
              </div>
              <div class="space-y-3">
                <div>
                  <span class="text-sm text-muted block">Temps de trajet</span>
                  <span class="font-semibold">{{ profile.after.time }}</span>
                </div>
                <div>
                  <span class="text-sm text-muted block">Correspondances</span>
                  <span class="font-semibold">{{ profile.after.changes }}</span>
                </div>
                <div>
                  <span class="text-sm text-muted block">Coût</span>
                  <span class="font-semibold">{{ profile.after.cost }}</span>
                </div>
                <div>
                  <span class="text-sm text-muted block">Autonomie</span>
                  <span class="font-semibold">{{ profile.after.autonomy }}</span>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Impact global -->
    <div class="mb-16">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Impact global sur le territoire
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
        <UCard class="text-center">
          <div class="text-4xl font-black text-primary-600 mb-2">{{ globalImpact.residents }}</div>
          <div class="text-sm text-muted font-semibold">Habitants concernés</div>
        </UCard>

        <UCard class="text-center">
          <div class="text-4xl font-black text-primary-600 mb-2">{{ globalImpact.students }}</div>
          <div class="text-sm text-muted font-semibold">Lycéens impactés</div>
        </UCard>

        <UCard class="text-center">
          <div class="text-4xl font-black text-orange-600 mb-2">{{ globalImpact.timeMultiplier }}</div>
          <div class="text-sm text-muted font-semibold">Temps de trajet</div>
        </UCard>

        <UCard class="text-center">
          <div class="text-4xl font-black text-red-600 mb-2">{{ globalImpact.extraCarTrips }}</div>
          <div class="text-sm text-muted font-semibold">Trajets voiture/jour</div>
        </UCard>

        <UCard class="text-center">
          <div class="text-4xl font-black text-red-700 mb-2">{{ globalImpact.co2PerYear }}</div>
          <div class="text-sm text-muted font-semibold">CO2/an</div>
        </UCard>
      </div>

      <UAlert
        icon="i-heroicons-fire"
        color="red"
        variant="solid"
        class="mt-8"
        title="+1.000 tonnes de CO2 par an"
        description="L'équivalent de 500 allers-retours Paris-New York ! Nîmes Métropole force les citoyens à polluer."
      />
    </div>

    <!-- CTA -->
    <div class="text-center bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-8">
      <h2 class="text-2xl font-bold mb-4">Ces chiffres vous parlent ?</h2>
      <p class="text-muted mb-6 max-w-2xl mx-auto">
        Partagez votre expérience concrète pour appuyer notre argumentation auprès des élus.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <UButton
          to="/temoignages/nouveau"
          size="xl"
          icon="i-heroicons-document-text"
          label="Témoigner"
        />
        <UButton
          to="/rejoindre/adherer"
          size="xl"
          color="white"
          icon="i-heroicons-user-plus"
          label="Adhérer"
          class="!border-4 !border-primary-600 !shadow-lg hover:!shadow-xl hover:!scale-105 !transition-all !duration-300"
        />
      </div>
    </div>
  </UContainer>
</template>

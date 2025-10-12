<template>
  <div>
    <!-- Hero Section -->
    <HomeHeroBanner />

    <!-- Key Facts -->
    <HomeKeyFacts />

    <!-- Did You Know - Infographies -->
    <HomeDidYouKnow />

    <!-- Latest News Preview -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Dernières actualités
            </h2>
            <p class="text-gray-600">Suivez l'avancement de notre mobilisation</p>
          </div>
          <NuxtLink
            to="/actualites"
            class="hidden md:inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
          >
            Voir toutes les actualités
            <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-1" />
          </NuxtLink>
        </div>

        <!-- News Grid (placeholder - will be populated with real data) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="card hover:shadow-xl transition-shadow">
            <div class="h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-xl"></div>
            <div class="p-6">
              <div class="text-sm text-gray-500 mb-2">Il y a {{ i }} jour{{ i > 1 ? 's' : '' }}</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                Actualité à venir
              </h3>
              <p class="text-gray-600 mb-4">
                Les actualités apparaîtront ici dès qu'elles seront publiées par l'équipe.
              </p>
              <NuxtLink
                to="/actualites"
                class="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                Lire plus
                <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="mt-8 text-center md:hidden">
          <NuxtLink
            to="/actualites"
            class="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
          >
            Voir toutes les actualités
            <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-1" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Rejoignez la mobilisation
        </h2>
        <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Ensemble, nous pouvons faire entendre notre voix et rétablir une mobilité équitable pour tous.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/temoignages/nouveau"
            class="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
          >
            <Icon name="heroicons:document-text" class="w-5 h-5 mr-2" />
            Partager mon témoignage
          </NuxtLink>
          <NuxtLink
            to="/rejoindre/adherer"
            class="inline-flex items-center justify-center px-8 py-4 bg-primary-700 text-white font-semibold rounded-lg hover:bg-primary-800 transition-all border-2 border-white/20"
          >
            <Icon name="heroicons:user-plus" class="w-5 h-5 mr-2" />
            Adhérer à l'association
          </NuxtLink>
          <NuxtLink
            to="/rejoindre/donner"
            class="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-lg hover:bg-white/10 transition-all border-2 border-white/30"
          >
            <Icon name="heroicons:heart" class="w-5 h-5 mr-2" />
            Faire un don
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Testimonies Preview -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ils témoignent
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Les habitants racontent l'impact de la suppression de la ligne directe sur leur quotidien
          </p>
        </div>

        <!-- Testimonies Grid (placeholder - will be populated with real data) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div v-for="i in 2" :key="i" class="card p-6">
            <div class="flex items-start mb-4">
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:user" class="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <div class="font-bold text-gray-900">Témoignage {{ i }}</div>
                <div class="text-sm text-gray-500">{{ i === 1 ? 'Ledenon' : 'Cabrières' }} • {{ i === 1 ? 'Parent' : 'Lycéen' }}</div>
              </div>
            </div>
            <p class="text-gray-700 italic">
              "Les témoignages des habitants apparaîtront ici pour illustrer concrètement l'impact de la suppression de la ligne directe..."
            </p>
          </div>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/temoignages"
            class="btn-primary inline-flex items-center"
          >
            Voir tous les témoignages
            <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-2" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO
useHead({
  title: 'Accueil',
  meta: [
    {
      name: 'description',
      content: 'ADUL21 - Association de défense des usagers de la ligne 21 Ledenon-Nîmes. Rétablissons la liaison directe entre Ledenon, Cabrières, Saint-Gervasy et la gare SNCF de Nîmes.'
    },
    { property: 'og:title', content: 'ADUL21 - Rétablissons la ligne 21 directe vers Nîmes' },
    { property: 'og:description', content: 'Mobilisation pour défendre le droit à la mobilité des habitants de Ledenon, Cabrières et Saint-Gervasy.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

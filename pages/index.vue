<template>
  <div>
    <!-- Hero Section -->
    <HomeHeroBanner />

    <!-- Key Facts -->
    <HomeKeyFacts />

    <!-- Did You Know - Infographies -->
    <HomeDidYouKnow />

    <!-- Latest News Preview -->
    <!-- <HomeLatestNews /> -->

    <!-- Call to Action -->
    <HomeCallToAction />

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

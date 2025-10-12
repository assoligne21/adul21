<template>
  <section class="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>
    </div>

    <div class="container-custom py-16 md:py-24 relative z-10">
      <div class="max-w-4xl">
        <!-- Badge -->
        <div class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <Icon name="heroicons:megaphone" class="w-5 h-5" />
          <span class="text-sm font-medium">Mobilisation en cours</span>
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Rétablissons la ligne 21 directe vers Nîmes
        </h1>

        <!-- Subtitle -->
        <p class="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl">
          Les habitants de Ledenon, Cabrières et Saint-Gervasy se mobilisent pour défendre leur droit à la mobilité.
        </p>

        <!-- Key Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div class="text-3xl font-bold">700+</div>
            <div class="text-primary-100 text-sm">Habitants concernés</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div class="text-3xl font-bold">120+</div>
            <div class="text-primary-100 text-sm">Lycéens impactés</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div class="text-3xl font-bold">x2.5</div>
            <div class="text-primary-100 text-sm">Temps de trajet multiplié</div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink
            to="/temoignages/nouveau"
            class="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
          >
            <Icon name="heroicons:document-text" class="w-5 h-5 mr-2" />
            Témoigner
          </NuxtLink>
          <NuxtLink
            to="/rejoindre/adherer"
            class="inline-flex items-center justify-center px-8 py-4 bg-primary-700 text-white font-semibold rounded-lg hover:bg-primary-800 transition-all border-2 border-white/20"
          >
            <Icon name="heroicons:user-plus" class="w-5 h-5 mr-2" />
            Nous rejoindre
          </NuxtLink>
          <NuxtLink
            to="/revendications"
            class="inline-flex items-center justify-center px-8 py-4 text-white font-semibold rounded-lg hover:bg-white/10 transition-all border-2 border-white/30"
          >
            En savoir plus
            <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-2" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Wave Separator -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-12 md:h-20">
        <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
      </svg>
    </div>
  </section>
</template>

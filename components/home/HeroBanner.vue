<template>
  <section class="relative bg-gradient-to-br from-blue-900 via-blue-600 to-blue-900 text-white overflow-hidden min-h-[90vh] flex items-center">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjEiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwSjMydjRoLTR2Mmg0djRoMlY2aDRWNGgtNHpNNiAzNHYtNEg0djRIMHYyaDR2NGgydi00aDR2LTJING3pNiA0VjBINHY0SDB2Mmg0djRoMlY2aDRWNEg2eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
    </div>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-600/90 to-blue-900/95"></div>

    <!-- Content -->
    <UContainer class="relative z-10 py-16">
      <div class="max-w-5xl mx-auto text-center space-y-12">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <img src="/logo-adul21.svg" alt="ADUL21" class="h-32 md:h-40 w-auto" />
        </div>

        <!-- Bus Line Visualization -->
        <div class="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base font-semibold px-4">
          <span class="text-blue-200">LEDENON</span>
          <div class="h-1 w-12 bg-white rounded animate-pulse"></div>
          <span class="text-blue-200">CABRIÈRES</span>
          <div class="h-1 w-12 bg-white rounded animate-pulse"></div>
          <span class="text-blue-200">SAINT-GERVASY</span>

          <!-- Broken line with cross -->
          <div class="relative flex items-center gap-1">
            <div class="h-1 w-8 bg-white rounded"></div>
            <div class="relative w-8 h-8 flex items-center justify-center">
              <div class="absolute w-6 h-1 bg-red-500 rounded rotate-45"></div>
              <div class="absolute w-6 h-1 bg-red-500 rounded -rotate-45"></div>
            </div>
            <div class="h-1 w-8 bg-white rounded"></div>
          </div>

          <div class="flex items-center gap-2">
            <Icon name="heroicons:map-pin" class="w-5 h-5" />
            <span class="font-bold">GARE DE NÎMES</span>
          </div>
        </div>

        <!-- Title -->
        <div class="space-y-4">
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
            NOTRE LIGNE DIRECTE
            <span class="block text-yellow-400 mt-2">
              A ÉTÉ SUPPRIMÉE
            </span>
          </h1>

          <p class="text-xl md:text-2xl text-blue-100 font-semibold max-w-3xl mx-auto">
            Nous exigeons son rétablissement immédiat
          </p>
        </div>

        <!-- CTA Buttons - Enhanced visibility -->
        <div class="flex flex-wrap justify-center gap-6 pt-6">
          <UButton
            to="/temoignages/nouveau"
            color="red"
            size="xl"
            icon="i-heroicons-document-text"
            label="Témoigner"
            class="shadow-2xl hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 text-lg px-10 py-6 font-bold uppercase tracking-wide"
            :ui="{ rounded: 'rounded-xl' }"
          />
          <UButton
            to="/rejoindre/adherer"
            color="white"
            size="xl"
            icon="i-heroicons-user-plus"
            label="Adhérer"
            class="shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300 text-lg px-10 py-6 font-bold uppercase tracking-wide"
            :ui="{ rounded: 'rounded-xl' }"
          />
          <UButton
            to="/revendications"
            variant="outline"
            color="white"
            size="xl"
            trailing-icon="i-heroicons-arrow-right"
            label="Nos revendications"
            class="hover:bg-white/10 hover:scale-105 transition-all duration-300 text-lg px-8 py-6 font-semibold border-2"
            :ui="{ rounded: 'rounded-xl' }"
          />
        </div>

        <!-- Stats - Masqués temporairement
        <div class="grid grid-cols-3 gap-8 pt-12 border-t border-white/20 max-w-2xl mx-auto">
          <div>
            <div class="text-3xl md:text-4xl font-black text-yellow-400">347+</div>
            <div class="text-sm text-blue-200 font-medium">Citoyens mobilisés</div>
          </div>
          <div>
            <div class="text-3xl md:text-4xl font-black text-yellow-400">1247+</div>
            <div class="text-sm text-blue-200 font-medium">Signatures</div>
          </div>
          <div>
            <div class="text-3xl md:text-4xl font-black text-yellow-400">87+</div>
            <div class="text-sm text-blue-200 font-medium">Témoignages</div>
          </div>
        </div>
        -->
      </div>
    </UContainer>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <Icon name="heroicons:chevron-down" class="w-8 h-8 text-white/70" />
    </div>
  </section>
</template>

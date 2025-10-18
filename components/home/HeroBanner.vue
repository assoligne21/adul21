<template>
  <section class="relative bg-gradient-to-br from-blue-900 via-blue-600 to-blue-900 text-white overflow-hidden min-h-[95vh] flex items-start">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjEiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwSjMydjRoLTR2Mmg0djRoMlY2aDRWNGgtNHpNNiAzNHYtNEg0djRIMHYyaDR2NGgydi00aDR2LTJING3pNiA0VjBINHY0SDB2Mmg0djRoMlY2aDRWNEg2eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
    </div>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-600/90 to-blue-900/95"></div>

    <!-- Content -->
    <UContainer class="relative z-10 pt-0 pb-16">
      <div class="max-w-5xl mx-auto text-center space-y-12">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <img src="/logo-adul21-hero.svg" alt="ADUL21" class="h-32 md:h-40 w-auto" />
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
            <div class="relative w-8 h-8 flex items-center justify-center animate-shake">
              <div class="absolute w-6 h-1 bg-red-500 rounded rotate-45"></div>
              <div class="absolute w-6 h-1 bg-red-500 rounded -rotate-45"></div>
            </div>
            <div class="h-1 w-8 bg-white rounded"></div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Flèche triangulaire comme dans le concept -->
            <svg width="16" height="20" viewBox="0 0 16 20" fill="white" class="flex-shrink-0">
              <path d="M0 4 L0 16 L16 10 Z" />
            </svg>
            <Icon name="heroicons:map-pin" class="w-6 h-6" />
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

        <!-- CTA Buttons - MAXIMUM visibility comme dans le concept -->
        <div class="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 pt-8 px-4">
          <UButton
            to="/temoignages/nouveau"
            color="red"
            size="xl"
            icon="i-heroicons-document-text"
            label="Témoigner"
            class="!text-base sm:!text-lg md:!text-xl !px-6 sm:!px-10 md:!px-14 !py-4 sm:!py-6 md:!py-8 !font-black !uppercase !tracking-wider shadow-[0_15px_50px_rgba(239,68,68,0.6)] hover:shadow-[0_20px_60px_rgba(239,68,68,0.8)] hover:scale-105 md:hover:scale-110 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 border-2 md:border-4 border-red-600 w-full sm:w-auto"
            :ui="{
              rounded: 'rounded-2xl',
              icon: { size: { xl: 'h-5 sm:h-6 md:h-7 w-5 sm:w-6 md:w-7' } }
            }"
          />
          <UButton
            to="/rejoindre/adherer"
            color="white"
            size="xl"
            icon="i-heroicons-user-plus"
            label="Adhérer"
            class="!text-base sm:!text-lg md:!text-xl !px-6 sm:!px-10 md:!px-14 !py-4 sm:!py-6 md:!py-8 !font-black !uppercase !tracking-wider shadow-[0_15px_50px_rgba(255,255,255,0.5)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.7)] hover:scale-105 md:hover:scale-110 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 !bg-white !text-blue-900 border-2 md:border-4 border-white w-full sm:w-auto"
            :ui="{
              rounded: 'rounded-2xl',
              icon: { size: { xl: 'h-5 sm:h-6 md:h-7 w-5 sm:w-6 md:w-7' } }
            }"
          />
          <UButton
            to="/revendications"
            variant="outline"
            color="white"
            size="xl"
            trailing-icon="i-heroicons-arrow-right"
            label="Nos revendications"
            class="!text-base sm:!text-lg md:!text-xl !px-6 sm:!px-10 md:!px-12 !py-4 sm:!py-6 md:!py-8 !font-bold !uppercase !tracking-wider hover:bg-white/20 hover:scale-105 md:hover:scale-110 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-300 border-2 md:border-4 border-white shadow-[0_10px_40px_rgba(255,255,255,0.3)] w-full sm:w-auto"
            :ui="{
              rounded: 'rounded-2xl',
              icon: { size: { xl: 'h-5 sm:h-6 md:h-7 w-5 sm:w-6 md:w-7' } }
            }"
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
    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
      <Icon name="heroicons:chevron-down" class="w-8 h-8 text-white/70" />
    </div>
  </section>
</template>

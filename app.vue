<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#171717' : 'white')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'fr'
  },
  titleTemplate: (title) => title ? `${title} - ADUL21` : 'ADUL21 - Association de Défense des Usagers de la Ligne 21'
})

useSeoMeta({
  description: 'Association de défense des usagers de la ligne 21 Ledenon-Nîmes. Mobilisation pour rétablir la liaison directe.',
  ogTitle: 'ADUL21 - Rétablissons la ligne 21 directe vers Nîmes',
  ogDescription: 'Mobilisation pour défendre le droit à la mobilité des habitants de Ledenon, Cabrières et Saint-Gervasy.',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div>
    <AppSkipLinks />
    <LayoutAppHeader />

    <main id="main-content" tabindex="-1">
      <NuxtPage />
    </main>

    <LayoutAppFooter />
  </div>
</template>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Skip to content link for accessibility -->
    <a href="#main-content" class="skip-to-content">
      Aller au contenu principal
    </a>

    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main id="main-content" class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// SEO par défaut (peut être surchargé par les pages)
useHead({
  titleTemplate: (title) => title ? `${title} - ADUL21` : 'ADUL21 - Association de Défense des Usagers de la Ligne 21',
})
</script>

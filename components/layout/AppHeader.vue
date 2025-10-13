<script setup lang="ts">
const items = [{
  label: 'Revendications',
  to: '/revendications'
}, {
  label: 'Arguments',
  to: '/arguments-juridiques'
}, {
  label: 'Témoignages',
  to: '/temoignages'
}, {
  label: 'Actualités',
  to: '/actualites'
}, {
  label: 'Contact',
  to: '/contact'
}]
</script>

<template>
  <UHeader class="relative z-50">
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-3">
        <img src="/logo-adul21.svg" alt="ADUL21" class="h-10 w-auto" />
      </NuxtLink>
    </template>

    <template #right>
      <UNavigationMenu
        :items="items"
        variant="link"
        class="hidden lg:flex"
      />

      <UButton
        to="/rejoindre/adherer"
        label="Adhérer"
        color="primary"
        class="hidden lg:inline-flex"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
      <div class="mt-4 space-y-2">
        <UButton
          to="/rejoindre/adherer"
          label="Adhérer"
          color="primary"
          block
        />
        <UButton
          to="/rejoindre/donner"
          label="Faire un don"
          variant="outline"
          block
        />
      </div>
    </template>
  </UHeader>
</template>

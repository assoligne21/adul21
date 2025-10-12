<script setup lang="ts">
const links = [{
  label: 'Témoigner',
  to: '/temoignages/nouveau',
  icon: 'i-heroicons-document-text',
  color: 'red' as const,
  size: 'xl' as const
}, {
  label: 'Adhérer à l\'association',
  to: '/rejoindre/adherer',
  icon: 'i-heroicons-user-plus',
  color: 'primary' as const,
  size: 'xl' as const
}, {
  label: 'Faire un don',
  to: '/rejoindre/soutien',
  icon: 'i-heroicons-heart',
  variant: 'outline' as const,
  color: 'primary' as const,
  size: 'xl' as const
}]
</script>

<template>
  <UPageCTA
    title="Rejoignez la mobilisation"
    description="Ensemble, nous pouvons faire entendre notre voix et rétablir une mobilité équitable pour tous."
    :links="links"
    class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900"
    :ui="{
      title: 'text-white',
      description: 'text-primary-100',
      links: 'flex flex-col sm:flex-row gap-4 justify-center mt-8'
    }"
  >
    <template #title>
      <span class="text-3xl md:text-4xl lg:text-5xl font-black">
        Rejoignez la mobilisation
      </span>
    </template>

    <template #description>
      <p class="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
        Ensemble, nous pouvons faire entendre notre voix et rétablir une mobilité équitable pour tous.
      </p>
    </template>
  </UPageCTA>
</template>

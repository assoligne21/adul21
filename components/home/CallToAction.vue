<script setup lang="ts">
const links = [{
  label: 'Témoigner',
  to: '/temoignages/nouveau',
  icon: 'i-heroicons-document-text',
  color: 'red' as const,
  size: 'xl' as const,
  class: '!text-xl !px-12 !py-6 !font-black !uppercase !tracking-wider shadow-[0_15px_50px_rgba(239,68,68,0.6)] hover:shadow-[0_20px_60px_rgba(239,68,68,0.8)] hover:scale-110 hover:-translate-y-2 transition-all duration-300 border-4 border-white !rounded-2xl !text-white [&_svg]:!text-white'
}, {
  label: 'Adhérer à l\'association',
  to: '/rejoindre/adherer',
  icon: 'i-heroicons-user-plus',
  color: 'primary' as const,
  size: 'xl' as const,
  class: '!text-lg !px-10 !py-5 !font-bold hover:scale-105 hover:-translate-y-1 transition-all duration-300 !rounded-xl'
}, {
  label: 'Faire un don',
  to: '/rejoindre/soutien',
  icon: 'i-heroicons-heart',
  variant: 'outline' as const,
  color: 'primary' as const,
  size: 'xl' as const,
  class: '!text-lg !px-10 !py-5 !font-bold hover:scale-105 hover:-translate-y-1 transition-all duration-300 !rounded-xl !bg-white !text-primary-600 [&_svg]:!text-primary-600 hover:!bg-gray-50'
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

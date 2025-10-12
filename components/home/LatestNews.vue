<script setup lang="ts">
// TODO: Replace with real data from API/database
const news = ref([
  {
    id: 1,
    title: 'Actualité à venir',
    description: 'Les actualités apparaîtront ici dès qu\'elles seront publiées par l\'équipe.',
    date: '2025-10-11',
    image: null
  },
  {
    id: 2,
    title: 'Actualité à venir',
    description: 'Les actualités apparaîtront ici dès qu\'elles seront publiées par l\'équipe.',
    date: '2025-10-10',
    image: null
  },
  {
    id: 3,
    title: 'Actualité à venir',
    description: 'Les actualités apparaîtront ici dès qu\'elles seront publiées par l\'équipe.',
    date: '2025-10-09',
    image: null
  }
])

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Aujourd\'hui'
  if (diffDays === 1) return 'Hier'
  return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
}
</script>

<template>
  <UContainer class="py-16">
    <div class="flex items-center justify-between mb-12">
      <div>
        <h2 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
          Dernières actualités
        </h2>
        <p class="text-xl text-muted">Suivez l'avancement de notre mobilisation</p>
      </div>
      <UButton
        to="/actualites"
        label="Voir toutes les actualités"
        trailing-icon="i-heroicons-arrow-right"
        variant="link"
        class="hidden md:inline-flex"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UPageCard
        v-for="article in news"
        :key="article.id"
        :title="article.title"
        :description="article.description"
        class="hover:shadow-lg transition-shadow"
        :ui="{
          header: { padding: '' },
          body: { padding: 'p-6' }
        }"
      >
        <template #header>
          <div
            class="h-48 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50"
            :class="article.image ? 'bg-cover bg-center' : ''"
            :style="article.image ? `background-image: url('${article.image}')` : ''"
          />
        </template>

        <template #title>
          <div class="space-y-2">
            <p class="text-sm text-muted">
              {{ formatDate(article.date) }}
            </p>
            <h3 class="text-xl font-bold">
              {{ article.title }}
            </h3>
          </div>
        </template>

        <template #footer>
          <UButton
            to="/actualites"
            label="Lire plus"
            trailing-icon="i-heroicons-arrow-right"
            variant="link"
            size="sm"
            class="px-0"
          />
        </template>
      </UPageCard>
    </div>

    <div class="mt-8 text-center md:hidden">
      <UButton
        to="/actualites"
        label="Voir toutes les actualités"
        trailing-icon="i-heroicons-arrow-right"
        variant="link"
      />
    </div>
  </UContainer>
</template>

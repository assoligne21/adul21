<script setup lang="ts">
useHead({
  title: 'Actualités',
  meta: [
    {
      name: 'description',
      content: 'Suivez l\'actualité de notre mobilisation pour le rétablissement de la ligne 21 directe. Actions, réunions, avancées juridiques.'
    }
  ]
})

// TODO: Replace with real data from API/database
const news = ref([
  {
    id: 1,
    slug: 'actualite-exemple-1',
    title: 'Première actualité de l\'association',
    excerpt: 'Les actualités de l\'association apparaîtront ici dès qu\'elles seront publiées par l\'équipe. En attendant, vous pouvez consulter nos revendications et témoigner.',
    content: '',
    coverImage: null,
    publishedAt: '2025-10-11',
    category: 'Actions',
    author: 'ADUL21'
  },
  {
    id: 2,
    slug: 'actualite-exemple-2',
    title: 'Deuxième actualité à venir',
    excerpt: 'Les actualités de l\'association apparaîtront ici dès qu\'elles seront publiées par l\'équipe. En attendant, vous pouvez consulter nos revendications et témoigner.',
    content: '',
    coverImage: null,
    publishedAt: '2025-10-10',
    category: 'Réunions',
    author: 'ADUL21'
  },
  {
    id: 3,
    slug: 'actualite-exemple-3',
    title: 'Troisième actualité à venir',
    excerpt: 'Les actualités de l\'association apparaîtront ici dès qu\'elles seront publiées par l\'équipe. En attendant, vous pouvez consulter nos revendications et témoigner.',
    content: '',
    coverImage: null,
    publishedAt: '2025-10-09',
    category: 'Juridique',
    author: 'ADUL21'
  }
])

const categories = computed(() => {
  const cats = new Set(news.value.map(n => n.category))
  return ['Toutes', ...Array.from(cats)]
})

const selectedCategory = ref('Toutes')

const filteredNews = computed(() => {
  if (selectedCategory.value === 'Toutes') {
    return news.value
  }
  return news.value.filter(n => n.category === selectedCategory.value)
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
</script>

<template>
  <UContainer class="py-16">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
        Actualités
      </h1>
      <p class="text-xl text-muted max-w-3xl">
        Suivez l'avancement de notre mobilisation : actions, réunions, avancées juridiques et événements à venir.
      </p>
    </div>

    <!-- Filtres par catégorie -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-3">
        <UButton
          v-for="category in categories"
          :key="category"
          :label="category"
          :variant="selectedCategory === category ? 'solid' : 'outline'"
          :color="selectedCategory === category ? 'primary' : 'gray'"
          @click="selectedCategory = category"
        />
      </div>
    </div>

    <!-- Liste des actualités -->
    <div class="space-y-8 mb-12">
      <UPageCard
        v-for="article in filteredNews"
        :key="article.id"
        :title="article.title"
        :description="article.excerpt"
        class="hover:shadow-lg transition-shadow"
        :ui="{
          body: { padding: 'p-0' },
          header: { padding: '' }
        }"
      >
        <template #header>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div
              class="h-64 md:h-auto bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50"
              :class="article.coverImage ? 'bg-cover bg-center' : ''"
              :style="article.coverImage ? `background-image: url('${article.coverImage}')` : ''"
            />

            <div class="md:col-span-2 p-6">
              <div class="flex items-center gap-3 mb-4">
                <UBadge
                  :label="article.category"
                  color="primary"
                  variant="subtle"
                />
                <span class="text-sm text-muted">{{ formatDate(article.publishedAt) }}</span>
              </div>

              <h2 class="text-2xl font-bold mb-3">
                {{ article.title }}
              </h2>

              <p class="text-muted mb-6">
                {{ article.excerpt }}
              </p>

              <UButton
                :to="`/actualites/${article.slug}`"
                label="Lire l'article"
                trailing-icon="i-heroicons-arrow-right"
                variant="link"
                class="px-0"
              />
            </div>
          </div>
        </template>
      </UPageCard>
    </div>

    <!-- Empty state si aucune actualité -->
    <div v-if="filteredNews.length === 0" class="text-center py-16">
      <Icon name="i-heroicons-newspaper" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Aucune actualité dans cette catégorie
      </h3>
      <p class="text-muted mb-6">
        Revenez bientôt ou consultez toutes les actualités.
      </p>
      <UButton
        label="Voir toutes les actualités"
        @click="selectedCategory = 'Toutes'"
      />
    </div>

    <!-- CTA Newsletter -->
    <UCard class="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
      <div class="text-center">
        <Icon name="i-heroicons-bell" class="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h2 class="text-2xl font-bold mb-3">Restez informé de nos actions</h2>
        <p class="text-muted mb-6 max-w-2xl mx-auto">
          Inscrivez-vous à notre newsletter pour recevoir toutes nos actualités et ne manquer aucune action.
        </p>
        <UButton
          to="/#newsletter"
          icon="i-heroicons-envelope"
          label="S'inscrire à la newsletter"
          size="lg"
        />
      </div>
    </UCard>
  </UContainer>
</template>

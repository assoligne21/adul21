<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// TODO: Replace with real data from API/database
const article = ref({
  id: 1,
  slug: slug,
  title: 'Actualité à venir',
  content: `
    <p>Le contenu détaillé de l'actualité apparaîtra ici une fois publié par l'équipe de l'association.</p>

    <p>En attendant, vous pouvez :</p>
    <ul>
      <li>Consulter nos <a href="/revendications">revendications</a></li>
      <li>Lire nos <a href="/arguments-juridiques">arguments juridiques</a></li>
      <li>Découvrir les <a href="/impacts">impacts chiffrés</a></li>
      <li><a href="/temoignages/nouveau">Témoigner</a> de votre situation</li>
      <li><a href="/rejoindre/adherer">Adhérer</a> à l'association</li>
    </ul>
  `,
  excerpt: 'Les actualités de l\'association apparaîtront ici dès qu\'elles seront publiées par l\'équipe.',
  coverImage: null,
  publishedAt: '2025-10-11',
  category: 'Actions',
  author: 'ADUL21'
})

useHead({
  title: article.value.title,
  meta: [
    {
      name: 'description',
      content: article.value.excerpt
    }
  ]
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Navigation suggestions (autres articles)
const relatedArticles = ref([
  {
    id: 2,
    slug: 'actualite-2',
    title: 'Autre actualité à découvrir',
    excerpt: 'Description de l\'actualité...',
    category: 'Réunions'
  },
  {
    id: 3,
    slug: 'actualite-3',
    title: 'Encore une actualité',
    excerpt: 'Description de l\'actualité...',
    category: 'Juridique'
  }
])
</script>

<template>
  <div>
    <!-- Hero image -->
    <div
      v-if="article.coverImage"
      class="h-96 bg-gradient-to-br from-primary-900 via-primary-600 to-primary-900"
      :class="article.coverImage ? 'bg-cover bg-center' : ''"
      :style="article.coverImage ? `background-image: url('${article.coverImage}')` : ''"
    />

    <UContainer class="py-16">
      <div class="max-w-4xl mx-auto">
        <!-- Back button -->
        <UButton
          to="/actualites"
          icon="i-heroicons-arrow-left"
          label="Retour aux actualités"
          variant="ghost"
          color="gray"
          class="mb-8"
        />

        <!-- Article Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <UBadge
              :label="article.category"
              color="primary"
              variant="subtle"
            />
            <span class="text-sm text-muted">
              Publié le {{ formatDate(article.publishedAt) }}
            </span>
            <span class="text-sm text-muted">
              Par {{ article.author }}
            </span>
          </div>

          <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            {{ article.title }}
          </h1>

          <p class="text-xl text-muted">
            {{ article.excerpt }}
          </p>
        </div>

        <!-- Article Content -->
        <UCard class="mb-12">
          <div
            class="prose prose-lg dark:prose-invert max-w-none"
            v-html="article.content"
          />
        </UCard>

        <!-- Share buttons -->
        <div class="flex items-center gap-4 mb-12 pb-12 border-b border-gray-200 dark:border-gray-800">
          <span class="text-sm font-semibold text-muted">Partager :</span>
          <div class="flex gap-2">
            <UButton
              icon="i-simple-icons-facebook"
              color="gray"
              variant="ghost"
              aria-label="Partager sur Facebook"
            />
            <UButton
              icon="i-simple-icons-x"
              color="gray"
              variant="ghost"
              aria-label="Partager sur X"
            />
            <UButton
              icon="i-heroicons-link"
              color="gray"
              variant="ghost"
              aria-label="Copier le lien"
            />
          </div>
        </div>

        <!-- Related articles -->
        <div v-if="relatedArticles.length > 0">
          <h2 class="text-2xl font-bold mb-6">Articles similaires</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UCard
              v-for="related in relatedArticles"
              :key="related.id"
              class="hover:shadow-lg transition-shadow"
            >
              <div class="space-y-3">
                <UBadge
                  :label="related.category"
                  color="primary"
                  variant="subtle"
                  size="xs"
                />

                <h3 class="text-lg font-bold">
                  {{ related.title }}
                </h3>

                <p class="text-sm text-muted">
                  {{ related.excerpt }}
                </p>

                <UButton
                  :to="`/actualites/${related.slug}`"
                  label="Lire l'article"
                  trailing-icon="i-heroicons-arrow-right"
                  variant="link"
                  size="sm"
                  class="px-0"
                />
              </div>
            </UCard>
          </div>
        </div>

        <!-- CTA -->
        <UCard class="mt-12 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
          <div class="text-center">
            <h2 class="text-2xl font-bold mb-3">Agissez avec nous</h2>
            <p class="text-muted mb-6 max-w-2xl mx-auto">
              Rejoignez notre mobilisation pour rétablir la ligne 21 directe.
            </p>
            <div class="flex flex-wrap gap-4 justify-center">
              <UButton
                to="/temoignages/nouveau"
                icon="i-heroicons-document-text"
                label="Témoigner"
                size="lg"
              />
              <UButton
                to="/rejoindre/adherer"
                icon="i-heroicons-user-plus"
                label="Adhérer"
                color="white"
                size="lg"
              />
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.prose :deep(a) {
  @apply text-primary-600 hover:text-primary-700 underline;
}

.prose :deep(ul) {
  @apply list-disc list-inside space-y-2 my-4;
}

.prose :deep(ol) {
  @apply list-decimal list-inside space-y-2 my-4;
}

.prose :deep(p) {
  @apply mb-4;
}
</style>

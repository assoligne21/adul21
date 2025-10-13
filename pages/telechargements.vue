<script setup lang="ts">
useHead({
  title: 'Téléchargements',
  meta: [
    {
      name: 'description',
      content: 'Téléchargez nos modèles de courriers, guides pratiques et documents pour agir : courriers aux élus, recours, guide Défenseur des droits.'
    }
  ]
})

const documents = ref([
  {
    id: 1,
    title: 'Courrier au maire',
    description: 'Modèle de courrier à envoyer à votre maire pour lui faire part de votre situation.',
    category: 'Courrier type',
    icon: 'i-heroicons-document-text',
    formats: [
      { type: 'DOCX', url: '/CourrierMairie.docx', size: '18 Ko' }
    ],
    available: true
  },
  {
    id: 2,
    title: 'Courrier à Nîmes Métropole',
    description: 'Modèle de courrier officiel à adresser au président de Nîmes Métropole.',
    category: 'Courrier type',
    icon: 'i-heroicons-document-text',
    formats: [
      { type: 'DOCX', url: '/CourrierMetropole.docx', size: '15 Ko' }
    ],
    available: true
  },
  {
    id: 3,
    title: 'Recours gracieux',
    description: 'Modèle de recours gracieux pour contester la décision de suppression.',
    category: 'Recours',
    icon: 'i-heroicons-scale',
    formats: [],
    available: false
  },
  {
    id: 4,
    title: 'Guide Défenseur des droits',
    description: 'Comment saisir le Défenseur des droits pour faire valoir vos droits à la mobilité.',
    category: 'Guide pratique',
    icon: 'i-heroicons-book-open',
    formats: [],
    available: false
  },
  {
    id: 5,
    title: 'Signalement au Préfet',
    description: 'Modèle de signalement à envoyer au Préfet du Gard concernant le service public.',
    category: 'Courrier type',
    icon: 'i-heroicons-document-text',
    formats: [],
    available: false
  },
  {
    id: 6,
    title: 'Dossier argumentaire complet',
    description: 'Tous nos arguments juridiques, chiffres et témoignages réunis en un seul document.',
    category: 'Documentation',
    icon: 'i-heroicons-folder',
    formats: [],
    available: false
  }
])

const categories = computed(() => {
  const cats = new Set(documents.value.map(d => d.category))
  return ['Tous', ...Array.from(cats)]
})

const selectedCategory = ref('Tous')

const filteredDocuments = computed(() => {
  if (selectedCategory.value === 'Tous') {
    return documents.value
  }
  return documents.value.filter(d => d.category === selectedCategory.value)
})

function handleDownload(doc: any, format: any) {
  // Si l'URL est définie, créer un téléchargement
  if (format.url && format.url !== '#') {
    const link = document.createElement('a')
    link.href = format.url
    link.download = `${doc.title}.${format.type.toLowerCase()}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Track download (future API call)
  // await $fetch('/api/downloads/track', {
  //   method: 'POST',
  //   body: {
  //     file_name: `${doc.title}.${format.type.toLowerCase()}`,
  //     file_type: doc.category
  //   }
  // })
}
</script>

<template>
  <UContainer class="py-16">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
        Documents à télécharger
      </h1>
      <p class="text-xl text-muted max-w-3xl">
        Retrouvez ici tous les modèles de courriers, guides pratiques et documents pour vous aider dans vos démarches.
      </p>
    </div>

    <!-- Instructions -->
    <UAlert
      icon="i-heroicons-information-circle"
      color="primary"
      variant="soft"
      class="mb-8"
      title="Comment utiliser ces documents ?"
    >
      <template #description>
        <ol class="list-decimal list-inside space-y-2 mt-2">
          <li>Téléchargez le document qui correspond à votre situation</li>
          <li>Personnalisez-le avec vos informations (nom, adresse, situation)</li>
          <li>Envoyez-le par courrier recommandé avec accusé de réception</li>
          <li>Conservez une copie et l'accusé de réception</li>
        </ol>
      </template>
    </UAlert>

    <!-- Filtres -->
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

    <!-- Documents Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <UCard
        v-for="doc in filteredDocuments"
        :key="doc.id"
        class="hover:shadow-lg transition-shadow"
      >
        <template #header>
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon :name="doc.icon" class="w-6 h-6 text-primary-600" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-bold mb-1">{{ doc.title }}</h3>
              <UBadge
                :label="doc.category"
                color="primary"
                variant="subtle"
                size="xs"
              />
            </div>
          </div>
        </template>

        <p class="text-sm text-muted mb-4">
          {{ doc.description }}
        </p>

        <template #footer>
          <div class="space-y-3">
            <!-- Available documents -->
            <div v-if="doc.available" class="flex flex-wrap gap-2">
              <UButton
                v-for="format in doc.formats"
                :key="format.type"
                :label="`${format.type} (${format.size})`"
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                variant="outline"
                @click="handleDownload(doc, format)"
              />
            </div>

            <!-- Unavailable documents -->
            <div v-else class="text-center py-2">
              <UBadge
                label="En cours de rédaction"
                color="orange"
                variant="soft"
              />
            </div>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Aide supplémentaire -->
    <UCard class="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
      <div class="text-center">
        <Icon name="i-heroicons-question-mark-circle" class="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h2 class="text-2xl font-bold mb-3">Besoin d'aide pour vos démarches ?</h2>
        <p class="text-muted mb-6 max-w-2xl mx-auto">
          Notre équipe peut vous accompagner dans vos démarches administratives et vous conseiller sur la meilleure stratégie à adopter.
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <UButton
            to="/contact"
            icon="i-heroicons-envelope"
            label="Nous contacter"
            size="lg"
          />
          <UButton
            to="/arguments-juridiques"
            icon="i-heroicons-scale"
            label="Voir les arguments juridiques"
            color="white"
            size="lg"
          />
        </div>
      </div>
    </UCard>

    <!-- Note légale -->
    <UAlert
      icon="i-heroicons-shield-check"
      color="gray"
      variant="subtle"
      class="mt-8"
      title="Note importante"
      description="Ces modèles sont fournis à titre indicatif. Nous vous recommandons de les adapter à votre situation personnelle et de conserver tous les justificatifs de vos démarches."
    />
  </UContainer>
</template>

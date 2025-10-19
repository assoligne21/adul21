<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Témoignages</h1>
        <p class="text-xl text-primary-100 max-w-3xl">
          Les habitants racontent l'impact concret de la suppression de la ligne directe sur leur quotidien
        </p>
      </div>
    </section>

    <!-- Filters -->
    <section class="py-8 bg-white border-b">
      <div class="container-custom">
        <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div class="flex flex-col sm:flex-row gap-4 flex-1">
            <!-- City filter -->
            <div>
              <label for="city-filter" class="block text-sm font-medium text-gray-700 mb-1">
                Commune
              </label>
              <select
                id="city-filter"
                v-model="filters.city"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Toutes</option>
                <option value="Ledenon">Ledenon</option>
                <option value="Cabrières">Cabrières</option>
                <option value="Saint-Gervasy">Saint-Gervasy</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <!-- User type filter -->
            <div>
              <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">
                Type d'usager
              </label>
              <select
                id="type-filter"
                v-model="filters.userType"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tous</option>
                <option value="student">Lycéen</option>
                <option value="parent">Parent</option>
                <option value="worker">Actif</option>
                <option value="retired">Retraité</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>

          <!-- Add testimony button -->
          <NuxtLink
            to="/temoignages/nouveau"
            class="btn-primary inline-flex items-center"
          >
            <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
            Ajouter mon témoignage
          </NuxtLink>
        </div>

        <!-- Results count -->
        <div class="mt-4 text-sm text-gray-600">
          {{ filteredTestimonies.length }} témoignage{{ filteredTestimonies.length > 1 ? 's' : '' }}
        </div>
      </div>
    </section>

    <!-- Testimonies List -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-12">
          <Icon name="heroicons:arrow-path" class="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p class="text-gray-600">Chargement des témoignages...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Icon name="heroicons:exclamation-circle" class="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p class="text-red-800 font-semibold mb-2">Erreur de chargement</p>
          <p class="text-red-700 text-sm">{{ error }}</p>
          <button @click="fetchTestimonies" class="btn-primary mt-4">
            Réessayer
          </button>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredTestimonies.length === 0" class="text-center py-12">
          <Icon name="heroicons:document-text" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Aucun témoignage trouvé
          </h3>
          <p class="text-gray-600 mb-6">
            {{ filters.city || filters.userType ? 'Aucun témoignage ne correspond à vos filtres.' : 'Soyez le premier à témoigner !' }}
          </p>
          <NuxtLink to="/temoignages/nouveau" class="btn-primary inline-flex items-center">
            <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
            Ajouter mon témoignage
          </NuxtLink>
        </div>

        <!-- Testimonies grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="testimony in paginatedTestimonies"
            :key="testimony.id"
            class="card p-6 hover:shadow-xl transition-shadow cursor-pointer"
            @click="navigateTo(`/temoignages/${testimony.id}`)"
          >
            <!-- Author info -->
            <div class="flex items-start mb-4">
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:user" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-gray-900 truncate">
                  {{ getDisplayName(testimony) }}
                </div>
                <div class="text-sm text-gray-500 flex items-center gap-2">
                  <Icon name="heroicons:map-pin" class="w-4 h-4" />
                  {{ testimony.city }}
                  <span class="text-gray-300">•</span>
                  {{ getUserTypeLabel(testimony.user_type) }}
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  {{ formatDate(testimony.created_at) }}
                </div>
              </div>
            </div>

            <!-- Testimony preview -->
            <p class="text-gray-700 italic line-clamp-4 mb-4">
              "{{ testimony.testimony_text }}"
            </p>

            <!-- Stats -->
            <div class="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
              <div class="flex items-center gap-1">
                <Icon name="heroicons:eye" class="w-4 h-4" />
                {{ testimony.views_count }} vue{{ testimony.views_count > 1 ? 's' : '' }}
              </div>
              <div class="text-primary-600 font-semibold flex items-center gap-1">
                Lire plus
                <Icon name="heroicons:arrow-right" class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="heroicons:chevron-left" class="w-5 h-5" />
          </button>

          <div class="flex gap-2">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-4 py-2 rounded-lg font-medium',
                page === currentPage
                  ? 'bg-primary-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="heroicons:chevron-right" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-white">
      <div class="container-custom text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Votre témoignage compte
        </h2>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Chaque témoignage renforce notre mobilisation et constitue une preuve juridique de l'impact de cette décision
        </p>
        <NuxtLink to="/temoignages/nouveau" class="btn-primary inline-flex items-center">
          <Icon name="heroicons:document-text" class="w-5 h-5 mr-2" />
          Partager mon témoignage
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Testimony } from '~/types/database.types'

// State
const testimonies = ref<Testimony[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Filters
const filters = ref({
  city: '',
  userType: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 9

// Fetch testimonies on mount
const fetchTestimonies = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await $fetch('/api/testimonies')

    if (!response.success) {
      throw new Error('Impossible de charger les témoignages')
    }

    testimonies.value = response.data || []
  } catch (e: unknown) {
    console.error('Error fetching testimonies:', e)
    error.value = 'Impossible de charger les témoignages. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTestimonies()
})

// Computed
const filteredTestimonies = computed(() => {
  let result = testimonies.value

  if (filters.value.city) {
    result = result.filter(t => t.city === filters.value.city)
  }

  if (filters.value.userType) {
    result = result.filter(t => t.user_type === filters.value.userType)
  }

  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredTestimonies.value.length / itemsPerPage)
})

const paginatedTestimonies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTestimonies.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// Methods
const getDisplayName = (testimony: Testimony): string => {
  if (testimony.publication_preference === 'anonymous') {
    return 'Anonyme'
  } else if (testimony.publication_preference === 'initials') {
    const firstInitial = testimony.first_name.charAt(0).toUpperCase()
    const lastInitial = testimony.last_name ? testimony.last_name.charAt(0).toUpperCase() : ''
    return lastInitial ? `${firstInitial}. ${lastInitial}.` : `${firstInitial}.`
  } else {
    return testimony.last_name ? `${testimony.first_name} ${testimony.last_name.charAt(0)}.` : testimony.first_name
  }
}

const getUserTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    student: 'Lycéen',
    parent: 'Parent',
    worker: 'Actif',
    retired: 'Retraité',
    other: 'Autre'
  }
  return labels[type] || type
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'

  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Aujourd'hui"
  if (diffInDays === 1) return "Hier"
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaine${Math.floor(diffInDays / 7) > 1 ? 's' : ''}`

  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Watch filters to reset pagination
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

// SEO
useHead({
  title: 'Témoignages',
  meta: [
    {
      name: 'description',
      content: 'Découvrez les témoignages des habitants de Ledenon, Cabrières et Saint-Gervasy sur l\'impact concret de la suppression de la ligne 21 directe vers Nîmes.'
    }
  ]
})
</script>

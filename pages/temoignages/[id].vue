<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <Icon name="heroicons:arrow-path" class="w-12 h-12 text-primary-600 animate-spin" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Icon name="heroicons:exclamation-circle" class="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Témoignage introuvable</h1>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink to="/temoignages" class="btn-primary">
          Retour aux témoignages
        </NuxtLink>
      </div>
    </div>

    <!-- Testimony content -->
    <div v-else-if="testimony">
      <!-- Header -->
      <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div class="container-custom">
          <NuxtLink to="/temoignages" class="inline-flex items-center text-primary-100 hover:text-white mb-4">
            <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
            Retour aux témoignages
          </NuxtLink>
          <h1 class="text-3xl md:text-4xl font-bold">Témoignage</h1>
        </div>
      </section>

      <!-- Main content -->
      <section class="py-12 bg-gray-50">
        <div class="container-custom max-w-4xl">
          <div class="card p-8 md:p-12">
            <!-- Author info -->
            <div class="flex items-start mb-8 pb-8 border-b">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:user" class="w-8 h-8 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ getDisplayName(testimony) }}
                </h2>
                <div class="flex flex-wrap items-center gap-3 text-gray-600">
                  <div class="flex items-center gap-1">
                    <Icon name="heroicons:map-pin" class="w-5 h-5" />
                    {{ testimony.city }}
                  </div>
                  <span class="text-gray-300">•</span>
                  <div class="flex items-center gap-1">
                    <Icon name="heroicons:user-group" class="w-5 h-5" />
                    {{ getUserTypeLabel(testimony.user_type) }}
                  </div>
                  <span class="text-gray-300">•</span>
                  <div class="flex items-center gap-1">
                    <Icon name="heroicons:calendar" class="w-5 h-5" />
                    {{ formatDate(testimony.created_at) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Usage stats cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <!-- Before -->
              <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 class="text-lg font-bold text-green-900 mb-4 flex items-center">
                  <Icon name="heroicons:arrow-trending-up" class="w-5 h-5 mr-2" />
                  Avant la suppression
                </h3>
                <ul class="space-y-2 text-sm text-green-800">
                  <li><strong>Fréquence :</strong> {{ getFrequencyLabel(testimony.usage_before_frequency) }}</li>
                  <li><strong>Temps de trajet :</strong> {{ testimony.usage_before_time }} minutes</li>
                  <li><strong>Coût :</strong> {{ testimony.usage_before_cost }}€</li>
                  <li><strong>Destination :</strong> {{ testimony.usage_before_destination }}</li>
                </ul>
              </div>

              <!-- After -->
              <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 class="text-lg font-bold text-red-900 mb-4 flex items-center">
                  <Icon name="heroicons:arrow-trending-down" class="w-5 h-5 mr-2" />
                  Après la suppression
                </h3>
                <ul class="space-y-2 text-sm text-red-800">
                  <li><strong>Solution adoptée :</strong> {{ getSolutionLabel(testimony.usage_after_solution) }}</li>
                  <li v-if="testimony.usage_after_distance"><strong>Distance parcourue :</strong> {{ testimony.usage_after_distance }} km</li>
                  <li v-if="testimony.usage_after_cost"><strong>Surcoût :</strong> {{ testimony.usage_after_cost }}€</li>
                  <li v-if="testimony.usage_after_correspondences"><strong>Correspondances :</strong> {{ testimony.usage_after_correspondences }}</li>
                  <li v-if="testimony.usage_after_wait_time"><strong>Temps d'attente :</strong> {{ testimony.usage_after_wait_time }} min</li>
                </ul>
              </div>
            </div>

            <!-- Problems encountered -->
            <div v-if="hasProblems(testimony)" class="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
              <h3 class="text-lg font-bold text-orange-900 mb-4 flex items-center">
                <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 mr-2" />
                Difficultés rencontrées
              </h3>
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-orange-800">
                <li v-for="problem in getProblemsArray(testimony)" :key="problem" class="flex items-center">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 mr-2 text-orange-600" />
                  {{ getProblemLabel(problem) }}
                </li>
              </ul>
            </div>

            <!-- Main testimony -->
            <div class="mb-8">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Témoignage</h3>
              <blockquote class="text-lg text-gray-700 italic leading-relaxed pl-6 border-l-4 border-primary-600">
                "{{ testimony.testimony_text }}"
              </blockquote>
            </div>

            <!-- Concrete example -->
            <div v-if="testimony.concrete_example" class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 class="text-lg font-bold text-blue-900 mb-3 flex items-center">
                <Icon name="heroicons:light-bulb" class="w-5 h-5 mr-2" />
                Exemple concret
              </h3>
              <p class="text-blue-800">{{ testimony.concrete_example }}</p>
            </div>

            <!-- Views counter -->
            <div class="flex items-center justify-between pt-6 border-t text-sm text-gray-500">
              <div class="flex items-center gap-2">
                <Icon name="heroicons:eye" class="w-5 h-5" />
                {{ testimony.views_count }} vue{{ testimony.views_count > 1 ? 's' : '' }}
              </div>
              <div>
                Publié le {{ new Date(testimony.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) }}
              </div>
            </div>
          </div>

          <!-- Call to action -->
          <div class="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-8 text-center">
            <h3 class="text-2xl font-bold mb-4">Vous aussi, témoignez !</h3>
            <p class="text-primary-100 mb-6 max-w-2xl mx-auto">
              Chaque témoignage renforce notre mobilisation et constitue une preuve juridique de l'impact de cette décision
            </p>
            <NuxtLink to="/temoignages/nouveau" class="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-all">
              <Icon name="heroicons:document-text" class="w-5 h-5 mr-2" />
              Partager mon témoignage
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Testimony } from '~/types/database.types'

const route = useRoute()
const testimony = ref<Testimony | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Fetch testimony
const fetchTestimony = async () => {
  loading.value = true
  error.value = null

  try {
    const id = route.params.id as string

    // Get testimony via API
    const response = await $fetch(`/api/testimonies/${id}`)

    if (!response.success || !response.data) {
      throw new Error('Témoignage introuvable ou non publié')
    }

    testimony.value = response.data

    // Increment views count via API
    try {
      await $fetch(`/api/testimonies/${id}/increment-views`, { method: 'POST' })
    } catch (e) {
      // Silently fail - views count is not critical
      console.error('Failed to increment views:', e)
    }
  } catch (e: unknown) {
    console.error('Error fetching testimony:', e)
    error.value = e.message || 'Impossible de charger le témoignage'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTestimony()
})

// Helper functions
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

const getFrequencyLabel = (freq: string): string => {
  const labels: Record<string, string> = {
    daily: 'Quotidiennement',
    '2-3_per_week': '2-3 fois par semaine',
    weekly: 'Hebdomadairement',
    occasional: 'Occasionnellement'
  }
  return labels[freq] || freq
}

const getSolutionLabel = (solution: string): string => {
  const labels: Record<string, string> = {
    car: 'Voiture personnelle',
    correspondences: 'Bus avec correspondances',
    depends_on_someone: "Dépend de quelqu'un",
    stopped: 'A arrêté'
  }
  return labels[solution] || solution
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

const getProblemsArray = (testimony: Testimony): string[] => {
  return Array.isArray(testimony.problems) ? testimony.problems : []
}

const getProblemLabel = (problem: string): string => {
  const labels: Record<string, string> = {
    missed_correspondences: 'Correspondances ratées',
    delays: 'Retards fréquents',
    physical_difficulty: 'Difficulté physique',
    fear: 'Peur de rater les correspondances',
    extra_cost: 'Surcoût financier',
    inconvenience: 'Désagrément général',
    lost_time: 'Perte de temps',
    stress: 'Stress accru'
  }
  return labels[problem] || problem
}

const hasProblems = (testimony: Testimony): boolean => {
  return getProblemsArray(testimony).length > 0
}

// SEO
useHead({
  title: computed(() => testimony.value ? `Témoignage de ${getDisplayName(testimony.value)}` : 'Témoignage'),
  meta: computed(() => [
    {
      name: 'description',
      content: testimony.value && testimony.value.testimony_text
        ? testimony.value.testimony_text.substring(0, 160) + '...'
        : 'Découvrez les témoignages des habitants impactés par la suppression de la ligne 21.'
    }
  ])
})
</script>

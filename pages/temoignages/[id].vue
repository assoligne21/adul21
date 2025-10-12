<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Icon name="heroicons:arrow-path" class="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
        <p class="text-gray-600">Chargement du témoignage...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Icon name="heroicons:exclamation-circle" class="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Témoignage non trouvé</h1>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <NuxtLink to="/temoignages" class="btn-primary inline-flex items-center">
          <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
          Retour aux témoignages
        </NuxtLink>
      </div>
    </div>

    <!-- Testimony content -->
    <div v-else-if="testimony">
      <!-- Page Header -->
      <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div class="container-custom">
          <NuxtLink
            to="/temoignages"
            class="inline-flex items-center text-primary-100 hover:text-white mb-4 transition-colors"
          >
            <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
            Retour aux témoignages
          </NuxtLink>
          <h1 class="text-3xl md:text-4xl font-bold">Témoignage</h1>
        </div>
      </section>

      <!-- Testimony content -->
      <section class="py-16 bg-gray-50">
        <div class="container-custom max-w-4xl">
          <!-- Author card -->
          <div class="card p-8 mb-8">
            <div class="flex items-start">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <Icon name="heroicons:user" class="w-8 h-8 text-primary-600" />
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ getDisplayName(testimony) }}
                </h2>
                <div class="flex flex-wrap gap-3 text-sm text-gray-600">
                  <div class="flex items-center gap-1">
                    <Icon name="heroicons:map-pin" class="w-4 h-4" />
                    {{ testimony.city }}
                  </div>
                  <span class="text-gray-300">•</span>
                  <div class="flex items-center gap-1">
                    <Icon name="heroicons:user-circle" class="w-4 h-4" />
                    {{ getUserTypeLabel(testimony.user_type) }}
                  </div>
                  <span class="text-gray-300">•</span>
                  <div class="flex items-center gap-1">
                    <Icon name="heroicons:calendar" class="w-4 h-4" />
                    {{ formatDate(testimony.created_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main testimony -->
          <div class="card p-8 mb-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icon name="heroicons:chat-bubble-left-right" class="w-6 h-6 text-primary-600" />
              Son témoignage
            </h3>
            <div class="prose prose-lg max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ testimony.testimony_text }}</p>
            </div>

            <!-- Concrete example if provided -->
            <div v-if="testimony.concrete_example" class="mt-8 bg-primary-50 border-l-4 border-primary-600 p-6 rounded-r-lg">
              <h4 class="font-bold text-primary-900 mb-3 flex items-center gap-2">
                <Icon name="heroicons:light-bulb" class="w-5 h-5" />
                Exemple concret
              </h4>
              <p class="text-primary-900 whitespace-pre-wrap">{{ testimony.concrete_example }}</p>
            </div>
          </div>

          <!-- Usage comparison -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Before -->
            <div class="card p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-600" />
                Avant la suppression
              </h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Fréquence :</span>
                  <span class="font-semibold text-gray-900">{{ getFrequencyLabel(testimony.usage_before_frequency) }}</span>
                </div>
                <div v-if="testimony.usage_before_time" class="flex justify-between">
                  <span class="text-gray-600">Temps de trajet :</span>
                  <span class="font-semibold text-gray-900">{{ testimony.usage_before_time }} min</span>
                </div>
                <div v-if="testimony.usage_before_cost" class="flex justify-between">
                  <span class="text-gray-600">Coût :</span>
                  <span class="font-semibold text-gray-900">{{ testimony.usage_before_cost }}€</span>
                </div>
                <div v-if="testimony.usage_before_destination" class="pt-3 border-t">
                  <span class="text-gray-600">Destination :</span>
                  <p class="font-semibold text-gray-900 mt-1">{{ testimony.usage_before_destination }}</p>
                </div>
              </div>
            </div>

            <!-- After -->
            <div class="card p-6 border-2 border-red-200">
              <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="heroicons:x-circle" class="w-6 h-6 text-red-600" />
                Après la suppression
              </h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Solution :</span>
                  <span class="font-semibold text-gray-900">{{ getSolutionLabel(testimony.usage_after_solution) }}</span>
                </div>
                <div v-if="testimony.usage_after_distance" class="flex justify-between">
                  <span class="text-gray-600">Distance (voiture) :</span>
                  <span class="font-semibold text-gray-900">{{ testimony.usage_after_distance }} km</span>
                </div>
                <div v-if="testimony.usage_after_cost" class="flex justify-between">
                  <span class="text-gray-600">Coût mensuel :</span>
                  <span class="font-semibold text-red-600">{{ testimony.usage_after_cost }}€</span>
                </div>
                <div v-if="testimony.usage_after_num_correspondences" class="flex justify-between">
                  <span class="text-gray-600">Correspondances :</span>
                  <span class="font-semibold text-gray-900">{{ testimony.usage_after_num_correspondences }}</span>
                </div>
                <div v-if="testimony.usage_after_wait_time" class="flex justify-between">
                  <span class="text-gray-600">Temps d'attente :</span>
                  <span class="font-semibold text-gray-900">{{ testimony.usage_after_wait_time }} min</span>
                </div>
                <div v-if="testimony.usage_after_missed_per_month" class="flex justify-between">
                  <span class="text-gray-600">Correspondances ratées/mois :</span>
                  <span class="font-semibold text-red-600">{{ testimony.usage_after_missed_per_month }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Problems faced -->
          <div v-if="hasProblems" class="card p-6 mb-8 bg-red-50 border-2 border-red-200">
            <h3 class="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
              <Icon name="heroicons:exclamation-triangle" class="w-6 h-6" />
              Problèmes rencontrés
            </h3>
            <div class="flex flex-wrap gap-3">
              <div v-if="testimony.has_missed_correspondences" class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-red-900">
                <Icon name="heroicons:clock" class="w-4 h-4" />
                Correspondances ratées
              </div>
              <div v-if="testimony.has_delays" class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-red-900">
                <Icon name="heroicons:clock" class="w-4 h-4" />
                Retards fréquents
              </div>
              <div v-if="testimony.has_physical_difficulty" class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-red-900">
                <Icon name="heroicons:heart" class="w-4 h-4" />
                Difficultés physiques
              </div>
              <div v-if="testimony.has_fear" class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-red-900">
                <Icon name="heroicons:shield-exclamation" class="w-4 h-4" />
                Sentiment d'insécurité
              </div>
              <div v-if="testimony.has_extra_cost" class="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-red-900">
                <Icon name="heroicons:currency-euro" class="w-4 h-4" />
                Surcoûts importants
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center justify-between text-sm text-gray-500 px-4">
            <div class="flex items-center gap-1">
              <Icon name="heroicons:eye" class="w-4 h-4" />
              {{ testimony.views_count }} vue{{ testimony.views_count > 1 ? 's' : '' }}
            </div>
            <div class="text-gray-400">
              ID: {{ testimony.id.split('-')[0] }}
            </div>
          </div>
        </div>
      </section>

      <!-- Call to action -->
      <section class="py-16 bg-white">
        <div class="container-custom text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            Vous aussi, témoignez
          </h2>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Votre témoignage peut faire la différence dans notre mobilisation
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/temoignages/nouveau" class="btn-primary inline-flex items-center">
              <Icon name="heroicons:document-text" class="w-5 h-5 mr-2" />
              Ajouter mon témoignage
            </NuxtLink>
            <NuxtLink to="/temoignages" class="btn-secondary inline-flex items-center">
              <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
              Voir tous les témoignages
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
const testimonyId = route.params.id as string

// State
const testimony = ref<Testimony | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Fetch testimony
const fetchTestimony = async () => {
  loading.value = true
  error.value = null

  try {
    const { supabase } = useSupabase()

    // Fetch testimony
    const { data, error: fetchError } = await supabase
      .from('testimonies')
      .select('*')
      .eq('id', testimonyId)
      .eq('is_published', true)
      .eq('moderation_status', 'approved')
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        error.value = 'Ce témoignage n\'existe pas ou n\'est pas encore publié.'
      } else {
        throw fetchError
      }
      return
    }

    testimony.value = data

    // Increment views count
    await supabase
      .from('testimonies')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', testimonyId)
  } catch (e: any) {
    console.error('Error fetching testimony:', e)
    error.value = 'Une erreur est survenue lors du chargement du témoignage.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTestimony()
})

// Computed
const hasProblems = computed(() => {
  if (!testimony.value) return false
  return testimony.value.has_missed_correspondences ||
    testimony.value.has_delays ||
    testimony.value.has_physical_difficulty ||
    testimony.value.has_fear ||
    testimony.value.has_extra_cost
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
    senior: 'Senior',
    pmr: 'Personne à mobilité réduite',
    other: 'Autre'
  }
  return labels[type] || type
}

const getFrequencyLabel = (freq: string | null): string => {
  if (!freq) return 'Non renseigné'
  const labels: Record<string, string> = {
    daily: 'Quotidien',
    '2-3_per_week': '2-3 fois/semaine',
    weekly: 'Hebdomadaire',
    occasional: 'Occasionnel'
  }
  return labels[freq] || freq
}

const getSolutionLabel = (solution: string | null): string => {
  if (!solution) return 'Non renseigné'
  const labels: Record<string, string> = {
    car: 'Voiture personnelle',
    correspondences: 'Correspondances',
    depends_on_someone: 'Dépend de quelqu\'un',
    stopped: 'A arrêté'
  }
  return labels[solution] || solution
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
}

// SEO
const seoTitle = computed(() => {
  if (!testimony.value) return 'Témoignage'
  const name = getDisplayName(testimony.value)
  return `Témoignage de ${name} - ${testimony.value.city}`
})

const seoDescription = computed(() => {
  if (!testimony.value) return 'Témoignage sur l\'impact de la suppression de la ligne 21'
  return testimony.value.testimony_text.substring(0, 160) + '...'
})

useHead({
  title: seoTitle,
  meta: [
    {
      name: 'description',
      content: seoDescription
    }
  ]
})
</script>

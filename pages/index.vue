<template>
  <div>
    <!-- Hero Section -->
    <HomeHeroBanner />

    <!-- Key Facts -->
    <HomeKeyFacts />

    <!-- Did You Know - Infographies -->
    <HomeDidYouKnow />

    <!-- Latest News Preview -->
    <!-- <HomeLatestNews /> -->

    <!-- Call to Action -->
    <HomeCallToAction />

    <!-- Testimonies Preview -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ils témoignent
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Les habitants racontent l'impact de la suppression de la ligne directe sur leur quotidien
          </p>
        </div>

        <!-- Loading state -->
        <div v-if="testimoniesLoading" class="text-center py-12">
          <Icon name="heroicons:arrow-path" class="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
        </div>

        <!-- Testimonies Grid -->
        <div v-else-if="recentTestimonies.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            v-for="testimony in recentTestimonies"
            :key="testimony.id"
            class="card p-6 hover:shadow-xl transition-shadow cursor-pointer"
            @click="navigateTo(`/temoignages/${testimony.id}`)"
          >
            <div class="flex items-start mb-4">
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Icon name="heroicons:user" class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-gray-900 truncate">
                  {{ getDisplayName(testimony) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ testimony.city }} • {{ getUserTypeLabel(testimony.user_type) }}
                </div>
              </div>
            </div>
            <p class="text-gray-700 italic line-clamp-3">
              "{{ testimony.testimony_text }}"
            </p>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <Icon name="heroicons:document-text" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 mb-6">Aucun témoignage pour le moment</p>
        </div>

        <div class="text-center">
          <NuxtLink
            to="/temoignages"
            class="btn-primary inline-flex items-center"
          >
            Voir tous les témoignages
            <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-2" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Testimony } from '~/types/database.types'

const { organizationSchema, websiteSchema, addSchema } = useSchemaOrg()

// Add Organization and WebSite schemas
addSchema(organizationSchema)
addSchema(websiteSchema)

// Fetch recent testimonies
const testimoniesLoading = ref(true)
const recentTestimonies = ref<Testimony[]>([])

const fetchRecentTestimonies = async () => {
  try {
    const { supabase } = useSupabase()
    const { data, error } = await supabase
      .from('testimonies')
      .select('*')
      .eq('is_published', true)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
      .limit(2)

    if (error) throw error
    recentTestimonies.value = data || []
  } catch (e) {
    console.error('Error fetching testimonies:', e)
  } finally {
    testimoniesLoading.value = false
  }
}

onMounted(() => {
  fetchRecentTestimonies()
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

// SEO
useHead({
  title: 'Accueil',
  meta: [
    {
      name: 'description',
      content: 'ADUL21 - Association de défense des usagers de la ligne 21 Ledenon-Nîmes. Rétablissons la liaison directe entre Ledenon, Cabrières, Saint-Gervasy et la gare SNCF de Nîmes.'
    },
    { property: 'og:title', content: 'ADUL21 - Rétablissons la ligne 21 directe vers Nîmes' },
    { property: 'og:description', content: 'Mobilisation pour défendre le droit à la mobilité des habitants de Ledenon, Cabrières et Saint-Gervasy.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

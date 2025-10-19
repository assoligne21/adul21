<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Gestion des témoignages</h1>

    <div v-if="pending" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else>
      <div class="mb-6 flex flex-wrap gap-2 sm:gap-4">
        <UButton
          :color="filter === 'all' ? 'primary' : 'gray'"
          @click="filter = 'all'"
        >
          Tous ({{ testimoniesList?.length || 0 }})
        </UButton>
        <UButton
          :color="filter === 'pending' ? 'primary' : 'gray'"
          @click="filter = 'pending'"
        >
          En attente ({{ pendingCount }})
        </UButton>
        <UButton
          :color="filter === 'published' ? 'primary' : 'gray'"
          @click="filter = 'published'"
        >
          Publiés ({{ publishedCount }})
        </UButton>
      </div>

      <div class="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auteur
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="testimony in filteredTestimonies" :key="testimony.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ testimony.firstName }} {{ testimony.lastName }}
                  </div>
                  <div class="text-sm text-gray-500">{{ testimony.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ testimony.city }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(testimony.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="{
                      'bg-orange-100 text-orange-800': testimony.moderationStatus === 'pending',
                      'bg-green-100 text-green-800': testimony.isPublished,
                      'bg-red-100 text-red-800': testimony.moderationStatus === 'rejected'
                    }"
                  >
                    {{ getStatusLabel(testimony) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex gap-2">
                    <UButton
                      v-if="testimony.moderationStatus === 'pending'"
                      color="green"
                      size="xs"
                      icon="i-heroicons-eye"
                      @click="publishTestimony(testimony.id)"
                      aria-label="Publier le témoignage"
                    >
                      Publier
                    </UButton>
                    <UButton
                      v-if="testimony.isPublished"
                      color="orange"
                      size="xs"
                      icon="i-heroicons-eye-slash"
                      @click="unpublishTestimony(testimony.id)"
                      aria-label="Dépublier le témoignage"
                    >
                      Dépublier
                    </UButton>
                    <UButton
                      color="red"
                      size="xs"
                      icon="i-heroicons-trash"
                      @click="confirmDelete(testimony.id, `${testimony.firstName} ${testimony.lastName}`)"
                      aria-label="Supprimer le témoignage"
                    >
                      Supprimer
                    </UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden space-y-4">
        <div
          v-for="testimony in filteredTestimonies"
          :key="testimony.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div class="mb-3">
            <h3 class="font-semibold text-gray-900">
              {{ testimony.firstName }} {{ testimony.lastName }}
            </h3>
            <p class="text-sm text-gray-600">{{ testimony.email }}</p>
          </div>

          <div class="space-y-2 text-sm mb-3">
            <p class="text-gray-600">📍 {{ testimony.city }}</p>
            <p class="text-gray-500">🕐 {{ formatDate(testimony.createdAt) }}</p>
            <div class="flex items-center gap-2">
              <span class="text-gray-500">Statut:</span>
              <span
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="{
                  'bg-orange-100 text-orange-800': testimony.moderationStatus === 'pending',
                  'bg-green-100 text-green-800': testimony.isPublished,
                  'bg-red-100 text-red-800': testimony.moderationStatus === 'rejected'
                }"
              >
                {{ getStatusLabel(testimony) }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 pt-3 border-t">
            <UButton
              v-if="testimony.moderationStatus === 'pending'"
              color="green"
              size="xs"
              icon="i-heroicons-eye"
              @click="publishTestimony(testimony.id)"
              class="flex-1"
            >
              Publier
            </UButton>
            <UButton
              v-if="testimony.isPublished"
              color="orange"
              size="xs"
              icon="i-heroicons-eye-slash"
              @click="unpublishTestimony(testimony.id)"
              class="flex-1"
            >
              Dépublier
            </UButton>
            <UButton
              color="red"
              size="xs"
              icon="i-heroicons-trash"
              @click="confirmDelete(testimony.id, `${testimony.firstName} ${testimony.lastName}`)"
              class="flex-1"
            >
              Supprimer
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

const filter = ref('all')

const { data: testimoniesResponse, pending, refresh } = await useFetch('/api/testimonies', {
  query: {
    limit: 500,
    moderation_status: '', // Tous les statuts de modération
    published: '' // Tous (publiés et non publiés)
  }
})

const testimoniesList = computed(() => testimoniesResponse.value?.data || [])

const filteredTestimonies = computed(() => {
  if (!testimoniesList.value) return []

  if (filter.value === 'pending') {
    return testimoniesList.value.filter((t) => t.moderationStatus === 'pending')
  }
  if (filter.value === 'published') {
    return testimoniesList.value.filter((t) => t.isPublished)
  }
  return testimoniesList.value
})

const pendingCount = computed(() =>
  testimoniesList.value?.filter((t) => t.moderationStatus === 'pending').length || 0
)

const publishedCount = computed(() =>
  testimoniesList.value?.filter((t) => t.isPublished).length || 0
)

function formatDate(date: string | Date | null | undefined) {
  if (!date) return '-'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return '-'
  return dateObj.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function getStatusLabel(testimony) {
  if (testimony.isPublished) return 'Publié'
  if (testimony.moderationStatus === 'pending') return 'En attente'
  if (testimony.moderationStatus === 'rejected') return 'Rejeté'
  return testimony.moderationStatus
}

async function publishTestimony(id: string) {
  try {
    await $fetch(`/api/testimonies/${id}`, {
      method: 'PATCH',
      body: {
        is_published: true,
        moderation_status: 'approved'
      }
    })
    await refresh()
    alert('✅ Témoignage publié avec succès')
  } catch (error) {
    console.error('Error publishing testimony:', error)
    alert('❌ Erreur lors de la publication du témoignage')
  }
}

async function unpublishTestimony(id: string) {
  try {
    await $fetch(`/api/testimonies/${id}`, {
      method: 'PATCH',
      body: {
        is_published: false
      }
    })
    await refresh()
    alert('✅ Témoignage dépublié avec succès')
  } catch (error) {
    console.error('Error unpublishing testimony:', error)
    alert('❌ Erreur lors de la dépublication du témoignage')
  }
}

async function deleteTestimony(id: string) {
  try {
    await $fetch(`/api/testimonies/${id}`, {
      method: 'DELETE'
    })
    await refresh()
  } catch (error) {
    console.error('Error deleting testimony:', error)
    alert('Erreur lors de la suppression du témoignage')
  }
}

function confirmDelete(id: string, name: string) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le témoignage de ${name} ? Cette action est irréversible.`)) {
    deleteTestimony(id)
  }
}
</script>

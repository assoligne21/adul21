<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Inscrits Newsletter</h1>
      <UButton
        color="primary"
        icon="i-heroicons-arrow-down-tray"
        @click="exportToCSV"
      >
        Export CSV
      </UButton>
    </div>

    <div v-if="pending" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else>
      <!-- Filters and search -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par email, nom..."
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tous</option>
          <option value="active">Actifs</option>
          <option value="unsubscribed">Désabonnés</option>
        </select>
        <select
          v-model="filterSource"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Toutes sources</option>
          <option value="footer">Footer</option>
          <option value="adhesion">Adhésion</option>
          <option value="donation">Don</option>
          <option value="pre-adhesion">Pré-adhésion</option>
        </select>
      </div>

      <!-- Stats summary -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="text-2xl font-bold text-gray-900">{{ filteredSubscribers.length }}</div>
          <div class="text-sm text-gray-600">Total affiché</div>
        </div>
        <div class="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
          <div class="text-2xl font-bold text-green-900">
            {{ filteredSubscribers.filter(s => s.isActive).length }}
          </div>
          <div class="text-sm text-green-700">Actifs</div>
        </div>
        <div class="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
          <div class="text-2xl font-bold text-red-900">
            {{ filteredSubscribers.filter(s => !s.isActive).length }}
          </div>
          <div class="text-sm text-red-700">Désabonnés</div>
        </div>
      </div>

      <!-- Subscribers table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date inscription
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date désabo
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="subscriber in filteredSubscribers" :key="subscriber.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <a
                    :href="`mailto:${subscriber.email}`"
                    class="text-sm font-medium text-primary-600 hover:underline"
                  >
                    {{ subscriber.email }}
                  </a>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span v-if="subscriber.firstName || subscriber.lastName">
                    {{ subscriber.firstName }} {{ subscriber.lastName }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="{
                      'bg-blue-100 text-blue-800': subscriber.source === 'footer',
                      'bg-green-100 text-green-800': subscriber.source === 'adhesion',
                      'bg-purple-100 text-purple-800': subscriber.source === 'donation',
                      'bg-orange-100 text-orange-800': subscriber.source === 'pre-adhesion',
                      'bg-gray-100 text-gray-800': !subscriber.source
                    }"
                  >
                    {{ getSourceLabel(subscriber.source) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': subscriber.isActive,
                      'bg-red-100 text-red-800': !subscriber.isActive
                    }"
                  >
                    {{ subscriber.isActive ? 'Actif' : 'Désabonné' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(subscriber.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="subscriber.unsubscribedAt">
                    {{ formatDate(subscriber.unsubscribedAt) }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="filteredSubscribers.length === 0" class="text-center py-12 text-gray-500">
        Aucun inscrit trouvé
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

const searchQuery = ref('')
const filterStatus = ref('')
const filterSource = ref('')

const { data: subscribersList, pending } = await useFetch('/api/admin/newsletter')

const filteredSubscribers = computed(() => {
  if (!subscribersList.value) return []

  let filtered = subscribersList.value

  // Search filter
  const query = searchQuery.value.toLowerCase()
  if (query) {
    filtered = filtered.filter((s) =>
      s.email.toLowerCase().includes(query) ||
      (s.firstName && s.firstName.toLowerCase().includes(query)) ||
      (s.lastName && s.lastName.toLowerCase().includes(query))
    )
  }

  // Status filter
  if (filterStatus.value === 'active') {
    filtered = filtered.filter((s) => s.isActive)
  } else if (filterStatus.value === 'unsubscribed') {
    filtered = filtered.filter((s) => !s.isActive)
  }

  // Source filter
  if (filterSource.value) {
    filtered = filtered.filter((s) => s.source === filterSource.value)
  }

  return filtered
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function getSourceLabel(source: string) {
  const labels: Record<string, string> = {
    footer: 'Footer',
    adhesion: 'Adhésion',
    donation: 'Don',
    'pre-adhesion': 'Pré-adhésion'
  }
  return labels[source] || source || 'Inconnu'
}

function exportToCSV() {
  const headers = ['Email', 'Prénom', 'Nom', 'Source', 'Statut', 'Date inscription', 'Date désabonnement']

  const rows = filteredSubscribers.value.map((s) => [
    s.email,
    s.firstName || '',
    s.lastName || '',
    getSourceLabel(s.source),
    s.isActive ? 'Actif' : 'Désabonné',
    formatDate(s.createdAt),
    s.unsubscribedAt ? formatDate(s.unsubscribedAt) : ''
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `newsletter-adul21-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

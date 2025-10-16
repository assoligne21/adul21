<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Soutiens (Pré-adhésions)</h1>
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
      <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par nom, email, ville..."
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
        <select
          v-model="filterCity"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Toutes les villes</option>
          <option value="Ledenon">Ledenon</option>
          <option value="Cabrières">Cabrières</option>
          <option value="Saint-Gervasy">Saint-Gervasy</option>
          <option value="Autre">Autre</option>
        </select>
        <select
          v-model="filterWantsToBecomeMember"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tous</option>
          <option value="true">Veut adhérer</option>
          <option value="false">Ne veut pas adhérer</option>
        </select>
        <select
          v-model="filterWantsToVolunteer"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tous</option>
          <option value="true">Veut être bénévole</option>
          <option value="false">Ne veut pas être bénévole</option>
        </select>
      </div>

      <!-- Stats summary -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="text-2xl font-bold text-gray-900">{{ filteredSupporters.length }}</div>
          <div class="text-sm text-gray-600">Total affiché</div>
        </div>
        <div class="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
          <div class="text-2xl font-bold text-blue-900">
            {{ filteredSupporters.filter(s => s.wantsToBecomeMember).length }}
          </div>
          <div class="text-sm text-blue-700">Veulent adhérer</div>
        </div>
        <div class="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
          <div class="text-2xl font-bold text-green-900">
            {{ filteredSupporters.filter(s => s.wantsToVolunteer).length }}
          </div>
          <div class="text-sm text-green-700">Veulent être bénévoles</div>
        </div>
        <div class="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-4">
          <div class="text-2xl font-bold text-purple-900">
            {{ filteredSupporters.filter(s => s.acceptsNewsletter).length }}
          </div>
          <div class="text-sm text-purple-700">Acceptent newsletter</div>
        </div>
      </div>

      <!-- Supporters table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Soutien
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intentions
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participation
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="supporter in filteredSupporters" :key="supporter.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ supporter.firstName }} {{ supporter.lastName }}
                  </div>
                  <div class="text-sm text-gray-500">{{ getUserTypeLabel(supporter.userType) }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">
                    <a :href="`mailto:${supporter.email}`" class="text-primary-600 hover:underline">
                      {{ supporter.email }}
                    </a>
                  </div>
                  <div class="text-sm text-gray-500">{{ supporter.phone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ supporter.city }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getUserTypeLabel(supporter.userType) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-if="supporter.wantsToBecomeMember"
                      class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                    >
                      Adhérer
                    </span>
                    <span
                      v-if="supporter.wantsToVolunteer"
                      class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
                    >
                      Bénévole
                    </span>
                    <span
                      v-if="supporter.canHostMeeting"
                      class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800"
                    >
                      Héberger
                    </span>
                    <span
                      v-if="supporter.canDistributeFlyers"
                      class="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800"
                    >
                      Distribuer
                    </span>
                    <span
                      v-if="supporter.acceptsNewsletter"
                      class="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800"
                    >
                      Newsletter
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="supporter.participationAreas && supporter.participationAreas.length > 0" class="flex flex-wrap gap-1">
                    <span
                      v-for="area in supporter.participationAreas"
                      :key="area"
                      class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                    >
                      {{ getParticipationAreaLabel(area) }}
                    </span>
                  </div>
                  <span v-else class="text-xs text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(supporter.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="filteredSupporters.length === 0" class="text-center py-12 text-gray-500">
        Aucun soutien trouvé
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
const filterCity = ref('')
const filterWantsToBecomeMember = ref('')
const filterWantsToVolunteer = ref('')

const { data: supportersList, pending } = await useFetch('/api/admin/pre-members')

const filteredSupporters = computed(() => {
  if (!supportersList.value) return []

  let filtered = supportersList.value

  // Search filter
  const query = searchQuery.value.toLowerCase()
  if (query) {
    filtered = filtered.filter((s: any) =>
      s.firstName.toLowerCase().includes(query) ||
      s.lastName.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.city.toLowerCase().includes(query)
    )
  }

  // City filter
  if (filterCity.value) {
    filtered = filtered.filter((s: any) => s.city === filterCity.value)
  }

  // Wants to become member filter
  if (filterWantsToBecomeMember.value) {
    const wantsMember = filterWantsToBecomeMember.value === 'true'
    filtered = filtered.filter((s: any) => s.wantsToBecomeMember === wantsMember)
  }

  // Wants to volunteer filter
  if (filterWantsToVolunteer.value) {
    const wantsVolunteer = filterWantsToVolunteer.value === 'true'
    filtered = filtered.filter((s: any) => s.wantsToVolunteer === wantsVolunteer)
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

function getUserTypeLabel(type: string) {
  const labels: Record<string, string> = {
    student: 'Lycéen',
    parent: 'Parent',
    worker: 'Actif',
    senior: 'Senior',
    pmr: 'PMR',
    other: 'Autre'
  }
  return labels[type] || type
}

function getParticipationAreaLabel(area: string) {
  const labels: Record<string, string> = {
    communication: 'Communication',
    legal: 'Juridique',
    events: 'Événementiel',
    actions: 'Actions',
    press: 'Presse',
    admin: 'Administratif'
  }
  return labels[area] || area
}

function exportToCSV() {
  const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Ville', 'Type', 'Veut adhérer', 'Veut être bénévole', 'Peut héberger', 'Peut distribuer', 'Domaines participation', 'Newsletter', 'Contact création', 'Invitation AG', 'Date inscription']

  const rows = filteredSupporters.value.map((s: any) => [
    s.firstName,
    s.lastName,
    s.email,
    s.phone,
    s.city,
    getUserTypeLabel(s.userType),
    s.wantsToBecomeMember ? 'Oui' : 'Non',
    s.wantsToVolunteer ? 'Oui' : 'Non',
    s.canHostMeeting ? 'Oui' : 'Non',
    s.canDistributeFlyers ? 'Oui' : 'Non',
    s.participationAreas?.map((a: string) => getParticipationAreaLabel(a)).join(', ') || '',
    s.acceptsNewsletter ? 'Oui' : 'Non',
    s.acceptsContactWhenCreated ? 'Oui' : 'Non',
    s.acceptsAgInvitation ? 'Oui' : 'Non',
    formatDate(s.createdAt)
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `soutiens-adul21-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

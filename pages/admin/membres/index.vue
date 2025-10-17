<template>
  <div>
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Gestion des membres</h1>

    <div v-if="pending" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else>
      <!-- Search -->
      <div class="mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par nom, email, ville..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
        />
      </div>

      <!-- Desktop Table -->
      <div class="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membre
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cotisation
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ member.firstName }} {{ member.lastName }}
                  </div>
                  <div class="text-sm text-gray-500">{{ member.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ member.city }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getUserTypeLabel(member.userType) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ member.membershipFee }}€
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': member.membershipStatus === 'active',
                      'bg-orange-100 text-orange-800': member.membershipStatus === 'pending',
                      'bg-red-100 text-red-800': member.membershipStatus === 'expired'
                    }"
                  >
                    {{ getStatusLabel(member.membershipStatus) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(member.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="sm:hidden space-y-4">
        <div
          v-for="member in filteredMembers"
          :key="member.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">
                {{ member.firstName }} {{ member.lastName }}
              </h3>
              <p class="text-sm text-gray-600">{{ member.email }}</p>
            </div>
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2"
              :class="{
                'bg-green-100 text-green-800': member.membershipStatus === 'active',
                'bg-orange-100 text-orange-800': member.membershipStatus === 'pending',
                'bg-red-100 text-red-800': member.membershipStatus === 'expired'
              }"
            >
              {{ getStatusLabel(member.membershipStatus) }}
            </span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Ville</span>
              <span class="font-medium text-gray-900">{{ member.city }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Type</span>
              <span class="font-medium text-gray-900">{{ getUserTypeLabel(member.userType) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Cotisation</span>
              <span class="font-medium text-gray-900">{{ member.membershipFee }}€</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Date</span>
              <span class="text-gray-600">{{ formatDate(member.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredMembers.length === 0" class="text-center py-12 text-gray-500">
        Aucun membre trouvé
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

const { data: membersList, pending } = await useFetch('/api/members', {
  query: { limit: 500 }
})

const filteredMembers = computed(() => {
  if (!membersList.value) return []
  
  const query = searchQuery.value.toLowerCase()
  if (!query) return membersList.value
  
  return membersList.value.filter((member) => 
    member.firstName.toLowerCase().includes(query) ||
    member.lastName.toLowerCase().includes(query) ||
    member.email.toLowerCase().includes(query) ||
    member.city.toLowerCase().includes(query)
  )
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

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    active: 'Actif',
    pending: 'En attente',
    expired: 'Expiré'
  }
  return labels[status] || status
}
</script>

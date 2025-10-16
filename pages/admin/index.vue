<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

    <div v-if="pending" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Testimonies Card -->
      <NuxtLink
        to="/admin/temoignages"
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:chat-bubble-left-right" class="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h3 class="text-sm font-medium text-gray-600 mb-1">Témoignages</h3>
        <p class="text-3xl font-bold text-gray-900">{{ stats.testimonies.total }}</p>
        <div class="mt-4 flex gap-4 text-sm">
          <span class="text-orange-600">
            <strong>{{ stats.testimonies.pending }}</strong> en attente
          </span>
          <span class="text-green-600">
            <strong>{{ stats.testimonies.published }}</strong> publiés
          </span>
        </div>
      </NuxtLink>

      <!-- Members Card -->
      <NuxtLink
        to="/admin/membres"
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:users" class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <h3 class="text-sm font-medium text-gray-600 mb-1">Membres</h3>
        <p class="text-3xl font-bold text-gray-900">{{ stats.members.total }}</p>
        <p class="text-sm text-gray-500 mt-2">Total des adhésions</p>
      </NuxtLink>

      <!-- Supporters Card -->
      <NuxtLink
        to="/admin/soutiens"
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:hand-raised" class="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <h3 class="text-sm font-medium text-gray-600 mb-1">Soutiens</h3>
        <p class="text-3xl font-bold text-gray-900">{{ stats.preMembers.total }}</p>
        <div class="mt-4 flex gap-4 text-sm">
          <span class="text-blue-600">
            <strong>{{ stats.preMembers.wantToBeMembers }}</strong> adhérer
          </span>
          <span class="text-green-600">
            <strong>{{ stats.preMembers.wantToVolunteer }}</strong> bénévoles
          </span>
        </div>
      </NuxtLink>

      <!-- Newsletter Card -->
      <NuxtLink
        to="/admin/newsletter"
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:envelope-open" class="w-6 h-6 text-teal-600" />
          </div>
        </div>
        <h3 class="text-sm font-medium text-gray-600 mb-1">Newsletter</h3>
        <p class="text-3xl font-bold text-gray-900">{{ stats.newsletter.active }}</p>
        <div class="mt-4 flex gap-4 text-sm">
          <span class="text-green-600">
            <strong>{{ stats.newsletter.active }}</strong> actifs
          </span>
          <span v-if="stats.newsletter.unsubscribed > 0" class="text-gray-500">
            <strong>{{ stats.newsletter.unsubscribed }}</strong> désabonnés
          </span>
        </div>
      </NuxtLink>

      <!-- Messages Card -->
      <NuxtLink
        to="/admin/contacts"
        class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:envelope" class="w-6 h-6 text-purple-600" />
          </div>
          <span v-if="stats.messages.unread > 0" class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {{ stats.messages.unread }}
          </span>
        </div>
        <h3 class="text-sm font-medium text-gray-600 mb-1">Messages</h3>
        <p class="text-3xl font-bold text-gray-900">{{ stats.messages.unread }}</p>
        <p class="text-sm text-gray-500 mt-2">Non lus</p>
      </NuxtLink>

      <!-- News Card -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:newspaper" class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <h3 class="text-sm font-medium text-gray-600 mb-1">Actualités</h3>
        <p class="text-3xl font-bold text-gray-900">{{ stats.news.total }}</p>
        <p class="text-sm text-gray-500 mt-2">{{ stats.news.published }} publiées</p>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="mt-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
      <div class="flex flex-wrap gap-4">
        <UButton 
          to="/admin/temoignages" 
          color="primary" 
          size="lg"
          icon="i-heroicons-chat-bubble-left-right"
        >
          Modérer les témoignages
        </UButton>
        <UButton 
          to="/admin/membres" 
          color="gray" 
          size="lg"
          icon="i-heroicons-users"
        >
          Voir les membres
        </UButton>
        <UButton 
          to="/admin/contacts" 
          color="gray" 
          size="lg"
          icon="i-heroicons-envelope"
        >
          Lire les messages
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

const { data: stats, pending } = await useFetch('/api/admin/stats', {
  key: 'admin-stats'
})
</script>

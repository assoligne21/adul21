<template>
  <div>
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Messages de contact</h1>

    <div v-if="pending" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else>
      <div class="mb-6 flex flex-wrap gap-2 sm:gap-4">
        <UButton
          :color="filter === 'all' ? 'primary' : 'gray'"
          @click="filter = 'all'"
        >
          Tous
        </UButton>
        <UButton
          :color="filter === 'new' ? 'primary' : 'gray'"
          @click="filter = 'new'"
        >
          Non lus ({{ newCount }})
        </UButton>
        <UButton
          :color="filter === 'read' ? 'primary' : 'gray'"
          @click="filter = 'read'"
        >
          Lus
        </UButton>
      </div>

      <div class="space-y-4">
        <div
          v-for="message in filteredMessages"
          :key="message.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-base sm:text-lg font-bold text-gray-900">{{ message.name }}</h3>
                <span
                  v-if="message.status === 'new'"
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 whitespace-nowrap"
                >
                  Nouveau
                </span>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <span class="truncate">📧 {{ message.email }}</span>
                <span v-if="message.phone">📞 {{ message.phone }}</span>
                <span>🕐 {{ formatDate(message.createdAt) }}</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <UButton
                v-if="message.status === 'new'"
                color="primary"
                size="sm"
                @click="markAsRead(message.id)"
              >
                Marquer lu
              </UButton>
              <a
                :href="`mailto:${message.email}?subject=Re: ${message.subject}`"
                class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                <Icon name="heroicons:envelope" class="w-4 h-4" />
                Répondre
              </a>
              <UButton
                color="red"
                size="sm"
                icon="i-heroicons-trash"
                @click="confirmDelete(message.id, message.name)"
                aria-label="Supprimer le message"
              >
                Supprimer
              </UButton>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <p class="text-sm font-semibold text-gray-700 mb-2">Sujet : {{ message.subject }}</p>
            <p class="text-gray-700 whitespace-pre-wrap">{{ message.message }}</p>
          </div>

          <div v-if="message.acceptsContact" class="mt-4 text-sm text-gray-500">
            ✓ Accepte d'être recontacté
          </div>
        </div>
      </div>

      <div v-if="filteredMessages.length === 0" class="text-center py-12 text-gray-500">
        Aucun message
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

const { data: contactsList, pending, refresh } = await useFetch('/api/contact', {
  query: { limit: 200 }
})

const filteredMessages = computed(() => {
  if (!contactsList.value) return []
  
  if (filter.value === 'new') {
    return contactsList.value.filter((m) => m.status === 'new')
  }
  if (filter.value === 'read') {
    return contactsList.value.filter((m) => m.status === 'read')
  }
  return contactsList.value
})

const newCount = computed(() => 
  contactsList.value?.filter((m) => m.status === 'new').length || 0
)

function formatDate(date: string) {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function markAsRead(id: string) {
  try {
    // Note: Need to create this API endpoint or use generic update
    await $fetch(`/api/contact/${id}`, {
      method: 'PATCH',
      body: { status: 'read' }
    })
    await refresh()
  } catch (error) {
    console.error('Error marking as read:', error)
  }
}

async function deleteMessage(id: string) {
  try {
    await $fetch(`/api/contact/${id}`, {
      method: 'DELETE'
    })
    await refresh()
  } catch (error) {
    console.error('Error deleting message:', error)
    alert('Erreur lors de la suppression du message')
  }
}

function confirmDelete(id: string, name: string) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le message de ${name} ? Cette action est irréversible.`)) {
    deleteMessage(id)
  }
}
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Utilisateurs administrateurs</h1>
      <UButton
        color="primary"
        icon="i-heroicons-plus"
        @click="openCreateModal"
        size="sm"
      >
        <span class="hidden sm:inline">Nouvel utilisateur</span>
        <span class="sm:hidden">Nouveau</span>
      </UButton>
    </div>

    <div v-if="pending" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else>
      <!-- Desktop Table -->
      <div class="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in usersList" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': user.isActive,
                      'bg-red-100 text-red-800': !user.isActive
                    }"
                  >
                    {{ user.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Jamais' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex gap-2">
                    <UButton
                      color="blue"
                      size="xs"
                      @click="openEditModal(user)"
                    >
                      Éditer
                    </UButton>
                    <UButton
                      v-if="!user.isActive"
                      color="green"
                      size="xs"
                      @click="toggleUserStatus(user.id, true)"
                    >
                      Activer
                    </UButton>
                    <UButton
                      v-if="user.isActive"
                      color="orange"
                      size="xs"
                      @click="toggleUserStatus(user.id, false)"
                    >
                      Désactiver
                    </UButton>
                    <UButton
                      color="red"
                      size="xs"
                      @click="confirmDelete(user.id, user.name)"
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
      <div class="sm:hidden space-y-4">
        <div
          v-for="user in usersList"
          :key="user.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ user.name }}</h3>
              <p class="text-sm text-gray-600">{{ user.email }}</p>
            </div>
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ml-2"
              :class="{
                'bg-green-100 text-green-800': user.isActive,
                'bg-red-100 text-red-800': !user.isActive
              }"
            >
              {{ user.isActive ? 'Actif' : 'Inactif' }}
            </span>
          </div>
          <div class="text-sm text-gray-500 mb-3">
            Dernière connexion: {{ user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Jamais' }}
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton
              color="blue"
              size="xs"
              @click="openEditModal(user)"
            >
              Éditer
            </UButton>
            <UButton
              v-if="!user.isActive"
              color="green"
              size="xs"
              @click="toggleUserStatus(user.id, true)"
            >
              Activer
            </UButton>
            <UButton
              v-if="user.isActive"
              color="orange"
              size="xs"
              @click="toggleUserStatus(user.id, false)"
            >
              Désactiver
            </UButton>
            <UButton
              color="red"
              size="xs"
              @click="confirmDelete(user.id, user.name)"
            >
              Supprimer
            </UButton>
          </div>
        </div>
      </div>

      <div v-if="usersList?.length === 0" class="text-center py-12 text-gray-500">
        Aucun utilisateur trouvé
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h2 class="text-xl font-bold text-gray-900">
            {{ editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' }}
          </h2>
        </template>

        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <UInput
              v-model="formData.name"
              type="text"
              required
              placeholder="Nom complet"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <UInput
              v-model="formData.email"
              type="email"
              required
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe {{ editingUser ? '(laisser vide pour ne pas modifier)' : '' }}
            </label>
            <UInput
              v-model="formData.password"
              type="password"
              :required="!editingUser"
              placeholder="Minimum 8 caractères"
            />
            <p class="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
          </div>

          <div class="flex items-center gap-2">
            <UCheckbox
              v-model="formData.isActive"
              id="isActive"
            />
            <label for="isActive" class="text-sm text-gray-700">
              Compte actif
            </label>
          </div>

          <div class="flex gap-3 pt-4">
            <UButton
              type="submit"
              color="primary"
              :loading="saving"
              class="flex-1"
            >
              {{ editingUser ? 'Mettre à jour' : 'Créer' }}
            </UButton>
            <UButton
              type="button"
              color="gray"
              variant="outline"
              @click="closeModal"
              class="flex-1"
            >
              Annuler
            </UButton>
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth']
})

const showModal = ref(false)
const saving = ref(false)
const editingUser = ref(null)

const formData = ref({
  name: '',
  email: '',
  password: '',
  isActive: true
})

const { data: usersData, pending, refresh } = await useFetch('/api/admin/users')
const usersList = computed(() => usersData.value?.data || [])

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function openCreateModal() {
  editingUser.value = null
  formData.value = {
    name: '',
    email: '',
    password: '',
    isActive: true
  }
  showModal.value = true
}

function openEditModal(user: any) {
  editingUser.value = user
  formData.value = {
    name: user.name,
    email: user.email,
    password: '',
    isActive: user.isActive
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingUser.value = null
  formData.value = {
    name: '',
    email: '',
    password: '',
    isActive: true
  }
}

async function saveUser() {
  saving.value = true
  try {
    if (editingUser.value) {
      // Update existing user
      const updateData: any = {
        name: formData.value.name,
        email: formData.value.email,
        isActive: formData.value.isActive
      }

      if (formData.value.password) {
        updateData.password = formData.value.password
      }

      await $fetch(`/api/admin/users/${editingUser.value.id}`, {
        method: 'PATCH',
        body: updateData
      })
    } else {
      // Create new user
      await $fetch('/api/admin/users', {
        method: 'POST',
        body: formData.value
      })
    }

    await refresh()
    closeModal()
  } catch (error: any) {
    console.error('Error saving user:', error)
    alert(error.data?.statusMessage || 'Erreur lors de l\'enregistrement')
  } finally {
    saving.value = false
  }
}

async function toggleUserStatus(id: string, isActive: boolean) {
  try {
    await $fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: { isActive }
    })
    await refresh()
  } catch (error: any) {
    console.error('Error toggling user status:', error)
    alert(error.data?.statusMessage || 'Erreur lors de la modification du statut')
  }
}

async function deleteUser(id: string) {
  try {
    await $fetch(`/api/admin/users/${id}`, {
      method: 'DELETE'
    })
    await refresh()
  } catch (error: any) {
    console.error('Error deleting user:', error)
    alert(error.data?.statusMessage || 'Erreur lors de la suppression')
  }
}

function confirmDelete(id: string, name: string) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${name} ? Cette action est irréversible.`)) {
    deleteUser(id)
  }
}
</script>

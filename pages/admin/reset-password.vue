<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <img src="/logo-adul21.svg" alt="ADUL21" class="h-20 w-auto mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-white">Nouveau mot de passe</h1>
        <p class="text-primary-100 mt-2">Choisissez un nouveau mot de passe</p>
      </div>

      <!-- Form card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <form v-if="!success" @submit.prevent="handleResetPassword" class="space-y-6">
          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              required
              minlength="8"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
            <p class="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              minlength="8"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>

          <!-- Error message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
            {{ errorMessage }}
          </div>

          <!-- Submit button -->
          <UButton
            type="submit"
            color="primary"
            size="xl"
            :loading="loading"
            :disabled="loading"
            class="w-full"
          >
            {{ loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
          </UButton>
        </form>

        <!-- Success message -->
        <div v-else class="text-center space-y-4">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            <p class="font-medium mb-2">Mot de passe réinitialisé !</p>
            <p class="text-sm">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
          </div>

          <UButton
            color="primary"
            size="xl"
            class="w-full"
            @click="$router.push('/admin/login')"
          >
            Se connecter
          </UButton>
        </div>
      </div>

      <!-- Back to login -->
      <div v-if="!success" class="text-center mt-6">
        <NuxtLink to="/admin/login" class="text-sm text-primary-100 hover:text-white transition-colors">
          ← Retour à la connexion
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: []
})

const route = useRoute()
const token = route.query.token as string

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const success = ref(false)

// Check if token is present
onMounted(() => {
  if (!token) {
    errorMessage.value = 'Token manquant. Veuillez utiliser le lien envoyé par email.'
  }
})

async function handleResetPassword() {
  errorMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }

  loading.value = true

  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token,
        password: password.value
      }
    })

    success.value = true
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'Erreur lors de la réinitialisation'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <img src="/logo-adul21.svg" alt="ADUL21" class="h-20 w-auto mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-white">Mot de passe oublié</h1>
        <p class="text-primary-100 mt-2">Entrez votre email pour réinitialiser votre mot de passe</p>
      </div>

      <!-- Form card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <form v-if="!success" @submit.prevent="handleForgotPassword" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="assoligne21@gmail.com"
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
            {{ loading ? 'Envoi...' : 'Réinitialiser le mot de passe' }}
          </UButton>
        </form>

        <!-- Success message -->
        <div v-else class="text-center space-y-4">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
            <p class="font-medium mb-2">Email envoyé !</p>
            <p class="text-sm">Si votre email existe dans notre système, vous recevrez un lien de réinitialisation.</p>
          </div>

          <!-- Development mode: show token -->
          <div v-if="devToken" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
            <p class="font-medium mb-2">Mode développement</p>
            <p class="mb-2">Token de réinitialisation :</p>
            <code class="block bg-yellow-100 p-2 rounded break-all">{{ devToken }}</code>
            <NuxtLink :to="`/admin/reset-password?token=${devToken}`" class="text-primary-600 hover:underline block mt-2">
              Cliquez ici pour réinitialiser
            </NuxtLink>
          </div>

          <NuxtLink to="/admin/login" class="block text-primary-600 hover:text-primary-700">
            Retour à la connexion
          </NuxtLink>
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

const email = ref('')
const loading = ref(false)
const errorMessage = ref('')
const success = ref(false)
const devToken = ref('')

async function handleForgotPassword() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })

    success.value = true

    // In development, show the token
    if (response.token) {
      devToken.value = response.token
    }
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'Erreur lors de la demande de réinitialisation'
  } finally {
    loading.value = false
  }
}
</script>

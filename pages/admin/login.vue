<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <img src="/logo-adul21.svg" alt="ADUL21" class="h-20 w-auto mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-white">Administration</h1>
        <p class="text-primary-100 mt-2">Connectez-vous pour accéder au backoffice</p>
      </div>

      <!-- Login card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
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

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <NuxtLink to="/admin/forgot-password" class="text-sm text-primary-600 hover:text-primary-700">
                Mot de passe oublié ?
              </NuxtLink>
            </div>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
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
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </UButton>
        </form>
      </div>

      <!-- Back to site -->
      <div class="text-center mt-6">
        <NuxtLink to="/" class="text-sm text-primary-100 hover:text-white transition-colors">
          ← Retour au site
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

const { login, isAuthenticated } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

// Redirect if already authenticated
onMounted(async () => {
  if (isAuthenticated.value) {
    await router.push('/admin')
  }
})

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''

  const result = await login(email.value, password.value)

  if (result.success) {
    await router.push('/admin')
  } else {
    errorMessage.value = result.message || 'Erreur de connexion'
  }

  loading.value = false
}
</script>

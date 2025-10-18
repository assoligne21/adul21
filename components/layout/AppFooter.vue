<script setup lang="ts">
const email = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true

  try {
    await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: { email: email.value, source: 'footer' }
    })
    email.value = ''
    alert('Inscription confirmée ! Vous recevrez nos actualités par email.')
  } catch (error) {
    alert('Erreur lors de l\'inscription. Veuillez réessayer.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <footer class="relative z-40 bg-gray-900 text-white">
    <!-- Main Footer -->
    <div class="container-custom py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- About -->
        <div>
          <NuxtLink to="/" class="inline-block mb-4">
            <img src="/logo-adul21.svg" alt="ADUL21" class="h-40 w-auto" />
          </NuxtLink>
          <p class="text-sm text-gray-400 mb-2">
            Association de Défense des Usagers de la Ligne 21
          </p>
          <p class="text-xs text-gray-500">
            Association loi 1901 (En création) • © {{ new Date().getFullYear() }} ADUL21
          </p>
        </div>

        <!-- L'association -->
        <div>
          <h3 class="font-bold mb-4">L'association</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/revendications" class="text-gray-400 hover:text-white transition-colors">Nos revendications</NuxtLink></li>
            <li><NuxtLink to="/arguments-juridiques" class="text-gray-400 hover:text-white transition-colors">Arguments juridiques</NuxtLink></li>
            <li><NuxtLink to="/impacts" class="text-gray-400 hover:text-white transition-colors">Impacts chiffrés</NuxtLink></li>
            <li><NuxtLink to="/temoignages" class="text-gray-400 hover:text-white transition-colors">Témoignages</NuxtLink></li>
            <li><NuxtLink to="/actualites" class="text-gray-400 hover:text-white transition-colors">Actualités</NuxtLink></li>
          </ul>
        </div>

        <!-- Agir -->
        <div>
          <h3 class="font-bold mb-4">Agir</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/temoignages/nouveau" class="text-gray-400 hover:text-white transition-colors">Témoigner</NuxtLink></li>
            <li><NuxtLink to="/rejoindre/adherer" class="text-gray-400 hover:text-white transition-colors">Adhérer</NuxtLink></li>
            <li><NuxtLink to="/rejoindre/soutien" class="text-gray-400 hover:text-white transition-colors">Faire un don</NuxtLink></li>
            <li><NuxtLink to="/telechargements" class="text-gray-400 hover:text-white transition-colors">Téléchargements</NuxtLink></li>
            <li><NuxtLink to="/contact" class="text-gray-400 hover:text-white transition-colors">Contact</NuxtLink></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="font-bold mb-4">Restez informé</h3>
          <p class="text-sm text-gray-400 mb-4">Recevez nos actualités et actions</p>
          <form @submit.prevent="onSubmit" class="space-y-2">
            <input
              v-model="email"
              type="email"
              required
              placeholder="Votre email"
              :disabled="loading"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400 disabled:opacity-50"
              style="color: white !important;"
            />
            <button
              type="submit"
              :disabled="loading"
              class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 transition-colors"
            >
              {{ loading ? 'Envoi...' : 'S\'inscrire' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800">
      <div class="container-custom py-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div class="flex gap-4">
            <NuxtLink to="/mentions-legales" class="hover:text-gray-300 transition-colors">Mentions légales</NuxtLink>
            <NuxtLink to="/politique-confidentialite" class="hover:text-gray-300 transition-colors">Politique de confidentialité</NuxtLink>
          </div>
          <div>
            <a href="mailto:assoligne21@gmail.com" class="hover:text-gray-300 transition-colors">
              assoligne21@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

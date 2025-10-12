<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-sm min-h-screen hidden md:block">
        <div class="p-6">
          <NuxtLink to="/" class="flex items-center space-x-3 mb-8">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">21</span>
            </div>
            <div>
              <div class="font-bold text-gray-900">ADUL21 Admin</div>
            </div>
          </NuxtLink>

          <nav class="space-y-1">
            <NuxtLink
              to="/admin/dashboard"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              active-class="bg-primary-50 text-primary-700"
            >
              <Icon name="heroicons:chart-bar" class="w-5 h-5" />
              <span>Dashboard</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/moderation"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              active-class="bg-primary-50 text-primary-700"
            >
              <Icon name="heroicons:document-check" class="w-5 h-5" />
              <span>Modération</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/membres"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              active-class="bg-primary-50 text-primary-700"
            >
              <Icon name="heroicons:users" class="w-5 h-5" />
              <span>Membres</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/dons"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              active-class="bg-primary-50 text-primary-700"
            >
              <Icon name="heroicons:currency-euro" class="w-5 h-5" />
              <span>Dons</span>
            </NuxtLink>

            <NuxtLink
              to="/admin/actualites"
              class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              active-class="bg-primary-50 text-primary-700"
            >
              <Icon name="heroicons:newspaper" class="w-5 h-5" />
              <span>Actualités</span>
            </NuxtLink>
          </nav>

          <div class="mt-8 pt-8 border-t">
            <button
              @click="logout"
              class="flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1">
        <!-- Top Bar -->
        <header class="bg-white shadow-sm">
          <div class="px-6 py-4 flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ pageTitle }}
            </h1>
            <div class="flex items-center space-x-4">
              <NuxtLink
                to="/"
                target="_blank"
                class="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
              >
                <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" />
                <span>Voir le site</span>
              </NuxtLink>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { logout } = useAuth()
const route = useRoute()

// Définir le titre de la page selon la route
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/moderation': 'Modération des témoignages',
    '/admin/membres': 'Gestion des membres',
    '/admin/dons': 'Suivi des dons',
    '/admin/actualites': 'Gestion des actualités'
  }
  return titles[route.path] || 'Administration'
})

// SEO
useHead({
  title: 'Administration - ADUL21',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

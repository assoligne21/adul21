<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top bar -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <img src="/logo-adul21.svg" alt="ADUL21" class="h-8 w-auto" />
            <span class="text-xl font-bold text-gray-900">Administration</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-700">{{ user?.name }}</span>
            <UButton 
              color="gray" 
              variant="ghost" 
              icon="i-heroicons-arrow-right-on-rectangle"
              @click="logout"
            >
              Déconnexion
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r border-gray-200">
        <nav class="p-4 space-y-2">
          <NuxtLink
            to="/admin"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            active-class="bg-primary-50 text-primary-600 font-semibold"
          >
            <Icon name="heroicons:home" class="w-5 h-5" />
            Dashboard
          </NuxtLink>

          <NuxtLink
            to="/admin/temoignages"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            active-class="bg-primary-50 text-primary-600 font-semibold"
          >
            <Icon name="heroicons:chat-bubble-left-right" class="w-5 h-5" />
            Témoignages
          </NuxtLink>

          <NuxtLink
            to="/admin/membres"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            active-class="bg-primary-50 text-primary-600 font-semibold"
          >
            <Icon name="heroicons:users" class="w-5 h-5" />
            Membres
          </NuxtLink>

          <NuxtLink
            to="/admin/contacts"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            active-class="bg-primary-50 text-primary-600 font-semibold"
          >
            <Icon name="heroicons:envelope" class="w-5 h-5" />
            Messages
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
</script>

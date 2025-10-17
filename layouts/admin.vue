<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Top bar -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <!-- Mobile menu button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Menu"
            >
              <Icon v-if="!mobileMenuOpen" name="heroicons:bars-3" class="w-6 h-6" />
              <Icon v-else name="heroicons:x-mark" class="w-6 h-6" />
            </button>
            <img src="/logo-adul21.svg" alt="ADUL21" class="h-8 w-auto" />
            <span class="text-lg sm:text-xl font-bold text-gray-900">Admin</span>
          </div>
          <div class="flex items-center gap-2 sm:gap-4">
            <span class="hidden sm:inline text-sm text-gray-700">{{ user?.name }}</span>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-right-on-rectangle"
              @click="logout"
              size="sm"
            >
              <span class="hidden sm:inline">Déconnexion</span>
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <div class="flex">
      <!-- Sidebar Desktop -->
      <aside class="hidden lg:block w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r border-gray-200">
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
            to="/admin/soutiens"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            active-class="bg-primary-50 text-primary-600 font-semibold"
          >
            <Icon name="heroicons:hand-raised" class="w-5 h-5" />
            Soutiens
          </NuxtLink>

          <NuxtLink
            to="/admin/newsletter"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            active-class="bg-primary-50 text-primary-600 font-semibold"
          >
            <Icon name="heroicons:envelope-open" class="w-5 h-5" />
            Newsletter
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

      <!-- Sidebar Mobile (Overlay) -->
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mobileMenuOpen"
          class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          @click="mobileMenuOpen = false"
        />
      </Transition>

      <Transition
        enter-active-class="transition-transform duration-300"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <aside
          v-if="mobileMenuOpen"
          class="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg z-50 lg:hidden overflow-y-auto"
        >
          <nav class="p-4 space-y-2">
            <NuxtLink
              to="/admin"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              active-class="bg-primary-50 text-primary-600 font-semibold"
              @click="mobileMenuOpen = false"
            >
              <Icon name="heroicons:home" class="w-5 h-5" />
              Dashboard
            </NuxtLink>

            <NuxtLink
              to="/admin/temoignages"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              active-class="bg-primary-50 text-primary-600 font-semibold"
              @click="mobileMenuOpen = false"
            >
              <Icon name="heroicons:chat-bubble-left-right" class="w-5 h-5" />
              Témoignages
            </NuxtLink>

            <NuxtLink
              to="/admin/membres"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              active-class="bg-primary-50 text-primary-600 font-semibold"
              @click="mobileMenuOpen = false"
            >
              <Icon name="heroicons:users" class="w-5 h-5" />
              Membres
            </NuxtLink>

            <NuxtLink
              to="/admin/soutiens"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              active-class="bg-primary-50 text-primary-600 font-semibold"
              @click="mobileMenuOpen = false"
            >
              <Icon name="heroicons:hand-raised" class="w-5 h-5" />
              Soutiens
            </NuxtLink>

            <NuxtLink
              to="/admin/newsletter"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              active-class="bg-primary-50 text-primary-600 font-semibold"
              @click="mobileMenuOpen = false"
            >
              <Icon name="heroicons:envelope-open" class="w-5 h-5" />
              Newsletter
            </NuxtLink>

            <NuxtLink
              to="/admin/contacts"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              active-class="bg-primary-50 text-primary-600 font-semibold"
              @click="mobileMenuOpen = false"
            >
              <Icon name="heroicons:envelope" class="w-5 h-5" />
              Messages
            </NuxtLink>
          </nav>
        </aside>
      </Transition>

      <!-- Main content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Mobile menu state
const mobileMenuOpen = ref(false)

// Ensure auth composable is available
const { user, logout } = useAuth()

// Make sure user is loaded on mount
onMounted(async () => {
  if (!user.value) {
    const { checkAuth } = useAuth()
    await checkAuth()
  }
})

// Close mobile menu when route changes
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

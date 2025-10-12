<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="container-custom">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-3 focus-visible">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">21</span>
          </div>
          <div class="hidden sm:block">
            <div class="font-bold text-gray-900 text-lg">ADUL21</div>
            <div class="text-xs text-gray-600">Association de Défense des Usagers</div>
          </div>
        </NuxtLink>

        <!-- Navigation Desktop -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink
            to="/revendications"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors focus-visible"
          >
            Revendications
          </NuxtLink>
          <NuxtLink
            to="/arguments-juridiques"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors focus-visible"
          >
            Arguments
          </NuxtLink>
          <NuxtLink
            to="/temoignages"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors focus-visible"
          >
            Témoignages
          </NuxtLink>
          <NuxtLink
            to="/actualites"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors focus-visible"
          >
            Actualités
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors focus-visible"
          >
            Contact
          </NuxtLink>
        </div>

        <!-- CTA Buttons -->
        <div class="hidden md:flex items-center space-x-3">
          <NuxtLink
            to="/rejoindre/donner"
            class="btn-secondary text-sm"
          >
            Faire un don
          </NuxtLink>
          <NuxtLink
            to="/rejoindre/adherer"
            class="btn-primary text-sm"
          >
            Adhérer
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 focus-visible"
          aria-label="Menu"
        >
          <Icon :name="mobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t">
          <div class="flex flex-col space-y-3">
            <NuxtLink
              to="/revendications"
              class="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              @click="mobileMenuOpen = false"
            >
              Revendications
            </NuxtLink>
            <NuxtLink
              to="/arguments-juridiques"
              class="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              @click="mobileMenuOpen = false"
            >
              Arguments
            </NuxtLink>
            <NuxtLink
              to="/temoignages"
              class="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              @click="mobileMenuOpen = false"
            >
              Témoignages
            </NuxtLink>
            <NuxtLink
              to="/actualites"
              class="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              @click="mobileMenuOpen = false"
            >
              Actualités
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              @click="mobileMenuOpen = false"
            >
              Contact
            </NuxtLink>
            <div class="pt-3 border-t space-y-2">
              <NuxtLink
                to="/rejoindre/donner"
                class="btn-secondary w-full text-sm"
                @click="mobileMenuOpen = false"
              >
                Faire un don
              </NuxtLink>
              <NuxtLink
                to="/rejoindre/adherer"
                class="btn-primary w-full text-sm"
                @click="mobileMenuOpen = false"
              >
                Adhérer
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)

// Fermer le menu mobile lors du changement de route
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

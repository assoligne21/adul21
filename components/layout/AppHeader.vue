<script setup lang="ts">
const mobileMenuOpen = ref(false)

const items = [{
  label: 'Revendications',
  to: '/revendications'
}, {
  label: 'Arguments',
  to: '/arguments-juridiques'
}, {
  label: 'Témoignages',
  to: '/temoignages'
}, {
  label: 'Actualités',
  to: '/actualites'
}, {
  label: 'Contact',
  to: '/contact'
}]
</script>

<template>
  <header class="relative z-50 bg-white border-b border-gray-200 shadow-sm">
    <nav class="container-custom">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <img src="/logo-adul21.svg" alt="ADUL21" class="h-10 w-auto" />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-8">
          <NuxtLink
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            class="text-gray-700 hover:text-primary-600 font-medium transition-colors"
          >
            {{ item.label }}
          </NuxtLink>

          <NuxtLink
            to="/rejoindre/adherer"
            class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
          >
            Adhérer
          </NuxtLink>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="lg:hidden p-2 text-gray-600 hover:text-gray-900"
        >
          <Icon v-if="!mobileMenuOpen" name="heroicons:bars-3" class="w-6 h-6" />
          <Icon v-else name="heroicons:x-mark" class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="lg:hidden py-4 border-t border-gray-200">
        <div class="flex flex-col space-y-3">
          <NuxtLink
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            class="text-gray-700 hover:text-primary-600 font-medium py-2"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>

          <NuxtLink
            to="/rejoindre/adherer"
            class="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium mt-4"
            @click="mobileMenuOpen = false"
          >
            Adhérer
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

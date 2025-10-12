<template>
  <div class="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-8 text-center shadow-xl">
    <div class="mb-4">
      <Icon name="heroicons:users" class="w-12 h-12 mx-auto mb-2" />
      <h3 class="text-2xl font-bold">Mobilisation en cours</h3>
    </div>

    <div class="mb-6">
      <div class="text-6xl md:text-7xl font-bold mb-2 animate-pulse">
        {{ displayCount }}
      </div>
      <div class="text-xl text-green-100">
        {{ count > 1 ? 'soutiens enregistrés' : 'soutien enregistré' }}
      </div>
    </div>

    <div class="bg-white/20 backdrop-blur rounded-lg p-4 mb-6">
      <p class="text-green-50 text-sm mb-3">
        <strong>Association en cours de création</strong>
      </p>
      <p class="text-green-100 text-sm">
        Rejoignez gratuitement la liste de pré-adhésion pour être informé(e) dès l'ouverture officielle
      </p>
    </div>

    <NuxtLink
      to="/rejoindre/soutien"
      class="inline-flex items-center justify-center px-8 py-4 bg-white text-green-700 font-bold rounded-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    >
      <Icon name="heroicons:hand-raised" class="w-5 h-5 mr-2" />
      Je soutiens le combat (gratuit)
    </NuxtLink>

    <p class="text-green-100 text-xs mt-4">
      Plus nous serons nombreux, plus notre impact sera fort !
    </p>
  </div>
</template>

<script setup lang="ts">
const count = ref(0)
const displayCount = ref(0)

// Fetch support count
const fetchCount = async () => {
  try {
    const { data } = await $fetch('/api/pre-members/count')
    count.value = data?.count || 0

    // Animate count
    animateCount()
  } catch (error) {
    console.error('Error fetching support count:', error)
    count.value = 0
  }
}

// Animate count from 0 to actual value
const animateCount = () => {
  const duration = 1500 // 1.5 seconds
  const steps = 50
  const increment = count.value / steps
  const stepDuration = duration / steps

  let current = 0
  const timer = setInterval(() => {
    current += increment
    if (current >= count.value) {
      displayCount.value = count.value
      clearInterval(timer)
    } else {
      displayCount.value = Math.floor(current)
    }
  }, stepDuration)
}

onMounted(() => {
  fetchCount()
})
</script>

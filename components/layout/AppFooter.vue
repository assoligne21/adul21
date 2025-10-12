<script setup lang="ts">
const columns = [{
  label: 'L\'association',
  children: [{
    label: 'Nos revendications',
    to: '/revendications'
  }, {
    label: 'Arguments juridiques',
    to: '/arguments-juridiques'
  }, {
    label: 'Impacts chiffrés',
    to: '/impacts'
  }, {
    label: 'Témoignages',
    to: '/temoignages'
  }, {
    label: 'Actualités',
    to: '/actualites'
  }]
}, {
  label: 'Agir',
  children: [{
    label: 'Témoigner',
    to: '/temoignages/nouveau'
  }, {
    label: 'Adhérer',
    to: '/rejoindre/adherer'
  }, {
    label: 'Faire un don',
    to: '/rejoindre/soutien'
  }, {
    label: 'Téléchargements',
    to: '/telechargements'
  }, {
    label: 'Contact',
    to: '/contact'
  }]
}, {
  label: 'Légal',
  children: [{
    label: 'Mentions légales',
    to: '/mentions-legales'
  }, {
    label: 'Politique de confidentialité',
    to: '/politique-confidentialite'
  }]
}]

const toast = useToast()
const email = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  // TODO: Implement newsletter subscription API call
  setTimeout(() => {
    toast.add({
      title: 'Inscription confirmée !',
      description: 'Vous recevrez nos actualités par email.',
      color: 'primary'
    })
    email.value = ''
    loading.value = false
  }, 1000)
}
</script>

<template>
  <USeparator
    icon="i-heroicons-map-pin"
    class="h-px"
  />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField
                name="email"
                label="Restez informé"
                description="Recevez nos actualités et actions"
                size="lg"
              >
                <UInput
                  v-model="email"
                  type="email"
                  required
                  class="w-full"
                  placeholder="Votre email"
                  :disabled="loading"
                >
                  <template #trailing>
                    <UButton
                      type="submit"
                      size="xs"
                      label="S'inscrire"
                      :loading="loading"
                    />
                  </template>
                </UInput>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <div class="flex flex-col gap-2">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/logo-adul21.svg" alt="ADUL21" class="h-8 w-auto" />
        </NuxtLink>
        <p class="text-sm text-muted">
          Association de Défense des Usagers de la Ligne 21
        </p>
        <p class="text-xs text-muted">
          Association loi 1901 • © {{ new Date().getFullYear() }} ADUL21
        </p>
        <p class="text-xs text-muted">
          Site conforme au RGPD • Analytics sans cookies
        </p>
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-2">
        <UButton
          to="mailto:assoligne21@gmail.com"
          target="_blank"
          icon="i-heroicons-envelope"
          aria-label="Nous contacter par email"
          color="neutral"
          variant="ghost"
        />
      </div>
    </template>
  </UFooter>
</template>

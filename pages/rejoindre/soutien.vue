<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">🤝 Je soutiens le combat</h1>
        <p class="text-xl text-primary-100 max-w-3xl">
          Inscription gratuite - Créez notre base de mobilisation avant la création officielle de l'association
        </p>
      </div>
    </section>

    <!-- Success message -->
    <section v-if="submitSuccess" class="py-12 bg-green-50">
      <div class="container-custom max-w-2xl text-center">
        <Icon name="heroicons:check-circle" class="w-20 h-20 text-green-600 mx-auto mb-6" />
        <h2 class="text-3xl font-bold text-green-900 mb-4">Merci pour votre soutien !</h2>
        <p class="text-lg text-green-800 mb-6">
          Vous faites maintenant partie des {{ totalSupports }} personnes mobilisées.
        </p>
        <p class="text-green-700 mb-8">
          Vous recevrez un email dès la création officielle de l'association avec la possibilité d'adhérer.
        </p>
        <NuxtLink to="/" class="btn-primary">
          Retour à l'accueil
        </NuxtLink>
      </div>
    </section>

    <!-- Form -->
    <section v-else class="py-16 bg-white">
      <div class="container-custom max-w-4xl">
        <!-- Info box -->
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
          <div class="flex items-start">
            <Icon name="heroicons:information-circle" class="w-6 h-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 class="text-lg font-bold text-blue-900 mb-2">Phase de pré-création (GRATUIT)</h3>
              <p class="text-blue-800 mb-3">
                L'association ADUL21 est en cours de création. En vous inscrivant gratuitement aujourd'hui, vous :
              </p>
              <ul class="space-y-2 text-blue-800">
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Recevez nos actualités en priorité</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Êtes informé(e) de la création officielle</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Pourrez adhérer dès l'ouverture</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <span>Serez invité(e) à l'Assemblée Générale constitutive</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Support counter -->
        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-8 text-center mb-8">
          <div class="text-5xl md:text-6xl font-bold mb-2">{{ totalSupports }}</div>
          <div class="text-xl">soutiens déjà enregistrés !</div>
          <div class="text-green-100 mt-2">Rejoignez le mouvement</div>
        </div>

        <form @submit.prevent="handleSubmit" class="card p-8 space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>

          <!-- Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                Prénom <span class="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                Nom <span class="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <!-- Contact -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Téléphone <span class="text-red-500">*</span>
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <!-- City & Profile -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                Commune <span class="text-red-500">*</span>
              </label>
              <select
                id="city"
                v-model="form.city"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Choisir</option>
                <option value="Ledenon">Ledenon</option>
                <option value="Cabrières">Cabrières</option>
                <option value="Saint-Gervasy">Saint-Gervasy</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label for="userType" class="block text-sm font-medium text-gray-700 mb-2">
                Vous êtes <span class="text-red-500">*</span>
              </label>
              <select
                id="userType"
                v-model="form.userType"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Choisir</option>
                <option value="student">Lycéen</option>
                <option value="parent">Parent d'élève</option>
                <option value="worker">Actif</option>
                <option value="senior">Senior</option>
                <option value="pmr">Personne à mobilité réduite</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>

          <!-- Engagement section -->
          <div class="border-t pt-6 space-y-4">
            <h3 class="text-lg font-bold text-gray-900">Comment souhaitez-vous participer ?</h3>

            <label class="flex items-start cursor-pointer">
              <input
                v-model="form.wantsToBecomeMember"
                type="checkbox"
                class="mt-1 mr-3 w-5 h-5 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">
                <strong>Je souhaite devenir membre dès la création</strong>
              </span>
            </label>

            <label class="flex items-start cursor-pointer">
              <input
                v-model="form.wantsToVolunteer"
                type="checkbox"
                class="mt-1 mr-3 w-5 h-5 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">
                <strong>Je souhaite m'investir activement</strong>
              </span>
            </label>

            <div v-if="form.wantsToVolunteer" class="ml-8 space-y-2 bg-gray-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-gray-700 mb-2">Domaines d'action :</p>
              <label class="flex items-start cursor-pointer">
                <input
                  v-model="form.participationAreas"
                  value="communication"
                  type="checkbox"
                  class="mt-1 mr-3"
                />
                <span class="text-sm text-gray-700">Communication (réseaux sociaux, site web)</span>
              </label>
              <label class="flex items-start cursor-pointer">
                <input
                  v-model="form.participationAreas"
                  value="actions"
                  type="checkbox"
                  class="mt-1 mr-3"
                />
                <span class="text-sm text-gray-700">Actions terrain (distributions, manifestations)</span>
              </label>
              <label class="flex items-start cursor-pointer">
                <input
                  v-model="form.participationAreas"
                  value="legal"
                  type="checkbox"
                  class="mt-1 mr-3"
                />
                <span class="text-sm text-gray-700">Juridique (si compétences)</span>
              </label>
              <label class="flex items-start cursor-pointer">
                <input
                  v-model="form.participationAreas"
                  value="press"
                  type="checkbox"
                  class="mt-1 mr-3"
                />
                <span class="text-sm text-gray-700">Relations presse/médias</span>
              </label>
              <label class="flex items-start cursor-pointer">
                <input
                  v-model="form.participationAreas"
                  value="events"
                  type="checkbox"
                  class="mt-1 mr-3"
                />
                <span class="text-sm text-gray-700">Événementiel (organisation réunions)</span>
              </label>
              <label class="flex items-start cursor-pointer">
                <input
                  v-model="form.participationAreas"
                  value="admin"
                  type="checkbox"
                  class="mt-1 mr-3"
                />
                <span class="text-sm text-gray-700">Administratif (secrétariat, comptabilité)</span>
              </label>
            </div>

            <label class="flex items-start cursor-pointer">
              <input
                v-model="form.canHostMeeting"
                type="checkbox"
                class="mt-1 mr-3 w-5 h-5 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">
                Je peux héberger une réunion
              </span>
            </label>

            <label class="flex items-start cursor-pointer">
              <input
                v-model="form.canDistributeFlyers"
                type="checkbox"
                class="mt-1 mr-3 w-5 h-5 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">
                Je peux distribuer des tracts
              </span>
            </label>
          </div>

          <!-- Consent section -->
          <div class="border-t pt-6 space-y-3">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Consentements</h3>

            <label class="flex items-start cursor-pointer">
              <input
                v-model="form.acceptsNewsletter"
                type="checkbox"
                class="mt-1 mr-3 w-5 h-5 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">
                J'accepte de recevoir les actualités de la mobilisation
              </span>
            </label>

            <label class="flex items-start cursor-pointer">
              <input
                v-model="form.acceptsContactWhenCreated"
                type="checkbox"
                class="mt-1 mr-3 w-5 h-5 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">
                Je souhaite être contacté(e) dès la création officielle de l'association
              </span>
            </label>

            <label class="flex items-start cursor-pointer">
              <input
                v-model="form.acceptsAgInvitation"
                type="checkbox"
                class="mt-1 mr-3 w-5 h-5 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">
                Je souhaite être invité(e) à l'Assemblée Générale constitutive
              </span>
            </label>
          </div>

          <!-- Submit button -->
          <div class="pt-6">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon v-if="!isSubmitting" name="heroicons:check" class="w-5 h-5 mr-2 inline" />
              <Icon v-else name="heroicons:arrow-path" class="w-5 h-5 mr-2 inline animate-spin" />
              {{ isSubmitting ? 'Enregistrement...' : 'Je soutiens le combat (gratuit)' }}
            </button>
          </div>

          <!-- Error message -->
          <div v-if="submitError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            ✗ {{ submitError }}
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')
const totalSupports = ref(0)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  userType: '',
  wantsToBecomeMember: true,
  wantsToVolunteer: false,
  canHostMeeting: false,
  canDistributeFlyers: false,
  participationAreas: [] as string[],
  acceptsNewsletter: false,
  acceptsContactWhenCreated: true,
  acceptsAgInvitation: true
})

// Fetch current support count
const fetchSupportCount = async () => {
  try {
    const { data } = await $fetch('/api/pre-members/count')
    totalSupports.value = data?.count || 0
  } catch (error) {
    console.error('Error fetching support count:', error)
  }
}

onMounted(() => {
  fetchSupportCount()
})

const handleSubmit = async () => {
  isSubmitting.value = true
  submitError.value = ''

  try {
    const response = await $fetch('/api/pre-members', {
      method: 'POST',
      body: form.value
    })

    submitSuccess.value = true
    totalSupports.value = response.totalSupports || totalSupports.value + 1
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error: any) {
    submitError.value = error.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    isSubmitting.value = false
  }
}

// SEO
useHead({
  title: 'Je soutiens le combat - Pré-adhésion gratuite',
  meta: [
    {
      name: 'description',
      content: 'Inscrivez-vous gratuitement pour soutenir la création de l\'ADUL21 et être informé(e) dès l\'ouverture officielle. Rejoignez les centaines de personnes mobilisées.'
    }
  ]
})
</script>

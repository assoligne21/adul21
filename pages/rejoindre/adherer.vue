<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Adhérer à l'ADUL21</h1>
        <p class="text-xl text-primary-100 max-w-3xl">
          Rejoignez notre combat pour rétablir la ligne 21 directe et défendre le droit à la mobilité
        </p>
      </div>
    </section>

    <!-- Success message -->
    <section v-if="submitSuccess" class="py-12 bg-green-50">
      <div class="container-custom max-w-2xl text-center">
        <Icon name="heroicons:check-circle" class="w-20 h-20 text-green-600 mx-auto mb-6" />
        <h2 class="text-3xl font-bold text-green-900 mb-4">Demande d'adhésion reçue !</h2>
        <p class="text-lg text-green-800 mb-6">
          Merci pour votre soutien ! Vous allez recevoir un email avec les instructions de paiement.
        </p>
        <p class="text-green-700 mb-8">
          Votre adhésion sera effective dès réception de votre règlement.
        </p>
        <NuxtLink to="/" class="btn-primary">
          Retour à l'accueil
        </NuxtLink>
      </div>
    </section>

    <!-- Form -->
    <section v-else class="py-16 bg-white">
      <div class="container-custom max-w-4xl">
        <!-- Progress indicator -->
        <div class="mb-12">
          <div class="flex items-center justify-between">
            <div v-for="stepNumber in 4" :key="stepNumber" class="flex-1">
              <div class="flex items-center">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                    step >= stepNumber
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  ]"
                >
                  {{ stepNumber }}
                </div>
                <div
                  v-if="stepNumber < 4"
                  :class="[
                    'flex-1 h-1 mx-2 transition-all',
                    step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
                  ]"
                ></div>
              </div>
              <div
                class="mt-2 text-xs font-medium"
                :class="step >= stepNumber ? 'text-primary-600' : 'text-gray-500'"
              >
                {{ getStepLabel(stepNumber) }}
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="card p-8">
          <!-- Step 1: Personal Information -->
          <div v-show="step === 1" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="civility" class="block text-sm font-medium text-gray-700 mb-2">
                  Civilité <span class="text-red-500">*</span>
                </label>
                <select
                  id="civility"
                  v-model="form.civility"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Choisir</option>
                  <option value="M.">M.</option>
                  <option value="Mme">Mme</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
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

            <div>
              <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance (optionnel)
              </label>
              <input
                id="birthDate"
                v-model="form.birthDate"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

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

            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                Adresse complète <span class="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                v-model="form.address"
                rows="2"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Numéro, rue, bâtiment..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-2">
                  Code postal <span class="text-red-500">*</span>
                </label>
                <input
                  id="postalCode"
                  v-model="form.postalCode"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
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
            </div>
          </div>

          <!-- Step 2: User Profile -->
          <div v-show="step === 2" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Votre profil d'usager</h2>

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

            <!-- Conditional fields for students -->
            <div v-if="form.userType === 'student'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="schoolName" class="block text-sm font-medium text-gray-700 mb-2">
                  Établissement scolaire
                </label>
                <input
                  id="schoolName"
                  v-model="form.schoolName"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label for="schoolSection" class="block text-sm font-medium text-gray-700 mb-2">
                  Filière
                </label>
                <input
                  id="schoolSection"
                  v-model="form.schoolSection"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="usageBefore" class="block text-sm font-medium text-gray-700 mb-2">
                  Utilisation AVANT la suppression
                </label>
                <select
                  id="usageBefore"
                  v-model="form.usageBefore"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Non concerné</option>
                  <option value="daily">Quotidiennement</option>
                  <option value="2-3_per_week">2-3 fois par semaine</option>
                  <option value="weekly">Hebdomadairement</option>
                  <option value="occasional">Occasionnellement</option>
                </select>
              </div>
              <div>
                <label for="usageAfter" class="block text-sm font-medium text-gray-700 mb-2">
                  Solution APRÈS la suppression
                </label>
                <select
                  id="usageAfter"
                  v-model="form.usageAfter"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Non concerné</option>
                  <option value="car">Voiture personnelle</option>
                  <option value="correspondences">Bus avec correspondances</option>
                  <option value="depends_on_someone">Dépend de quelqu'un</option>
                  <option value="stopped">A arrêté</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 3: Membership Type -->
          <div v-show="step === 3" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Type d'adhésion</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Reduced -->
              <div
                :class="[
                  'cursor-pointer border-2 rounded-lg p-6 transition-all',
                  form.membershipType === 'reduced'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                ]"
                @click="selectMembership('reduced', 5)"
              >
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-lg font-bold text-gray-900">Tarif réduit</h3>
                  <div class="text-2xl font-bold text-primary-600">5€</div>
                </div>
                <p class="text-sm text-gray-600">
                  Pour les étudiants, demandeurs d'emploi et personnes en difficulté financière
                </p>
              </div>

              <!-- Normal -->
              <div
                :class="[
                  'cursor-pointer border-2 rounded-lg p-6 transition-all',
                  form.membershipType === 'normal'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                ]"
                @click="selectMembership('normal', 15)"
              >
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-lg font-bold text-gray-900">Tarif normal</h3>
                  <div class="text-2xl font-bold text-primary-600">15€</div>
                </div>
                <p class="text-sm text-gray-600">
                  Adhésion individuelle standard
                </p>
              </div>

              <!-- Support -->
              <div
                :class="[
                  'cursor-pointer border-2 rounded-lg p-6 transition-all',
                  form.membershipType === 'support'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                ]"
                @click="selectMembership('support', 50)"
              >
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-lg font-bold text-gray-900">Tarif de soutien</h3>
                  <div class="text-2xl font-bold text-primary-600">50€</div>
                </div>
                <p class="text-sm text-gray-600">
                  Pour soutenir davantage notre mobilisation
                </p>
              </div>

              <!-- Custom -->
              <div
                :class="[
                  'cursor-pointer border-2 rounded-lg p-6 transition-all',
                  form.membershipType === 'custom'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                ]"
                @click="selectMembership('custom', form.membershipFee)"
              >
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-lg font-bold text-gray-900">Montant libre</h3>
                  <div class="text-2xl font-bold text-primary-600">{{ form.membershipFee }}€</div>
                </div>
                <input
                  v-model.number="form.membershipFee"
                  type="number"
                  min="5"
                  step="1"
                  placeholder="Montant minimum: 5€"
                  class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  @click.stop
                  @input="form.membershipType = 'custom'"
                />
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-sm text-blue-900">
                <strong>💡 À savoir :</strong> Votre cotisation est valable 1 an et vous donne accès aux assemblées générales et à toutes les informations de l'association.
              </p>
            </div>
          </div>

          <!-- Step 4: Engagement & Consent -->
          <div v-show="step === 4" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Engagement et consentements</h2>

            <div>
              <label class="flex items-start mb-3">
                <input
                  v-model="form.wantsToParticipate"
                  type="checkbox"
                  class="mt-1 mr-3"
                />
                <span class="text-sm text-gray-700">
                  <strong>Je souhaite participer activement à la mobilisation</strong>
                </span>
              </label>

              <div v-if="form.wantsToParticipate" class="ml-6 space-y-2">
                <label class="flex items-start">
                  <input
                    v-model="form.participationAreas"
                    value="communication"
                    type="checkbox"
                    class="mt-1 mr-3"
                  />
                  <span class="text-sm text-gray-700">Communication (réseaux sociaux, flyers...)</span>
                </label>
                <label class="flex items-start">
                  <input
                    v-model="form.participationAreas"
                    value="legal"
                    type="checkbox"
                    class="mt-1 mr-3"
                  />
                  <span class="text-sm text-gray-700">Actions juridiques</span>
                </label>
                <label class="flex items-start">
                  <input
                    v-model="form.participationAreas"
                    value="events"
                    type="checkbox"
                    class="mt-1 mr-3"
                  />
                  <span class="text-sm text-gray-700">Organisation d'événements</span>
                </label>
                <label class="flex items-start">
                  <input
                    v-model="form.participationAreas"
                    value="actions"
                    type="checkbox"
                    class="mt-1 mr-3"
                  />
                  <span class="text-sm text-gray-700">Actions de terrain</span>
                </label>
                <label class="flex items-start">
                  <input
                    v-model="form.participationAreas"
                    value="press"
                    type="checkbox"
                    class="mt-1 mr-3"
                  />
                  <span class="text-sm text-gray-700">Relations presse</span>
                </label>
              </div>
            </div>

            <div class="border-t pt-6 space-y-3">
              <h3 class="font-bold text-gray-900 mb-4">Consentements RGPD</h3>

              <label class="flex items-start">
                <input
                  v-model="form.acceptsNewsletter"
                  type="checkbox"
                  class="mt-1 mr-3"
                />
                <span class="text-sm text-gray-700">
                  J'accepte de recevoir la newsletter avec les actualités de la mobilisation
                </span>
              </label>

              <label class="flex items-start">
                <input
                  v-model="form.acceptsTestimonyPublication"
                  type="checkbox"
                  class="mt-1 mr-3"
                />
                <span class="text-sm text-gray-700">
                  J'accepte que mon témoignage (si je le soumets) soit publié sur le site
                </span>
              </label>

              <label class="flex items-start">
                <input
                  v-model="form.acceptsMediaContact"
                  type="checkbox"
                  class="mt-1 mr-3"
                />
                <span class="text-sm text-gray-700">
                  J'accepte d'être contacté par des médias dans le cadre de la mobilisation
                </span>
              </label>

              <label class="flex items-start">
                <input
                  v-model="form.acceptsActionSolicitation"
                  type="checkbox"
                  class="mt-1 mr-3"
                />
                <span class="text-sm text-gray-700">
                  J'accepte d'être sollicité pour participer à des actions de mobilisation
                </span>
              </label>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 class="font-bold text-yellow-900 mb-2">Modalités de règlement</h3>
              <p class="text-sm text-yellow-800 mb-3">
                Suite à votre demande d'adhésion, vous recevrez un email avec les coordonnées bancaires pour effectuer votre règlement par virement.
              </p>
              <p class="text-sm text-yellow-800">
                <strong>Modes de paiement acceptés :</strong> Virement bancaire, chèque, espèces
              </p>
            </div>
          </div>

          <!-- Navigation buttons -->
          <div class="flex items-center justify-between pt-8 border-t mt-8">
            <button
              v-if="step > 1"
              type="button"
              @click="step--"
              class="btn-outline"
            >
              <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2 inline" />
              Précédent
            </button>
            <div v-else></div>

            <button
              v-if="step < 4"
              type="button"
              @click="step++"
              class="btn-primary"
            >
              Suivant
              <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-2 inline" />
            </button>
            <button
              v-else
              type="submit"
              :disabled="isSubmitting"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon v-if="!isSubmitting" name="heroicons:check" class="w-5 h-5 mr-2 inline" />
              <Icon v-else name="heroicons:arrow-path" class="w-5 h-5 mr-2 inline animate-spin" />
              {{ isSubmitting ? 'Envoi en cours...' : 'Valider mon adhésion' }}
            </button>
          </div>

          <!-- Error message -->
          <div v-if="submitError" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            ✗ {{ submitError }}
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

// Redirect to pre-adhesion page if association not created yet
if (!config.public.associationCreated) {
  navigateTo('/rejoindre/soutien', { redirectCode: 301 })
}

const step = ref(1)
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const form = ref({
  // Step 1: Personal info
  civility: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  email: '',
  phone: '',
  address: '',
  postalCode: '',
  city: '',

  // Step 2: User profile
  userType: '',
  schoolName: '',
  schoolSection: '',
  usageBefore: '',
  usageAfter: '',

  // Step 3: Membership
  membershipType: '',
  membershipFee: 15,

  // Step 4: Engagement
  wantsToParticipate: false,
  participationAreas: [] as string[],
  acceptsNewsletter: false,
  acceptsTestimonyPublication: false,
  acceptsMediaContact: false,
  acceptsActionSolicitation: false
})

const getStepLabel = (stepNumber: number): string => {
  const labels: Record<number, string> = {
    1: 'Coordonnées',
    2: 'Profil',
    3: 'Cotisation',
    4: 'Engagement'
  }
  return labels[stepNumber] || ''
}

const selectMembership = (type: string, amount: number) => {
  form.value.membershipType = type
  if (type !== 'custom') {
    form.value.membershipFee = amount
  }
}

const handleSubmit = async () => {
  if (form.value.membershipFee < 5) {
    submitError.value = 'Le montant minimum d\'adhésion est de 5€'
    return
  }

  isSubmitting.value = true
  submitError.value = ''

  try {
    await $fetch('/api/members', {
      method: 'POST',
      body: form.value
    })

    submitSuccess.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error: unknown) {
    submitError.value = error.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    isSubmitting.value = false
  }
}

// SEO
useHead({
  title: 'Adhérer à l\'association',
  meta: [
    {
      name: 'description',
      content: 'Adhérez à l\'ADUL21 et rejoignez notre combat pour rétablir la ligne 21 directe. Plusieurs formules d\'adhésion disponibles à partir de 5€.'
    }
  ]
})
</script>

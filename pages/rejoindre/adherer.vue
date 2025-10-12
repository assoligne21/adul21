<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Adhérer à l'ADUL21</h1>
        <p class="text-xl text-primary-100 max-w-3xl">
          Votre adhésion finance nos actions juridiques et renforce notre légitimité auprès des élus
        </p>
      </div>
    </section>

    <!-- Benefits -->
    <section class="py-12 bg-white border-b">
      <div class="container-custom">
        <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Pourquoi adhérer ?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-6">
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:scale" class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Actions juridiques</h3>
            <p class="text-gray-600">Financer les recours en justice et les expertises juridiques</p>
          </div>
          <div class="text-center p-6">
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:megaphone" class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Poids politique</h3>
            <p class="text-gray-600">Plus nous sommes nombreux, plus notre voix porte auprès des élus</p>
          </div>
          <div class="text-center p-6">
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:users" class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Mobilisation collective</h3>
            <p class="text-gray-600">Participer aux décisions et aux actions de l'association</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Membership Form -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom max-w-3xl">
        <div class="card p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Formulaire d'adhésion</h2>

          <!-- Progress indicator -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <span
                v-for="i in 4"
                :key="i"
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm',
                  currentStep >= i ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                ]"
              >
                {{ i }}
              </span>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-600">
              <span>Informations</span>
              <span>Profil</span>
              <span>Cotisation</span>
              <span>Confirmation</span>
            </div>
          </div>

          <form @submit.prevent="nextStep">
            <!-- Step 1: Personal Information -->
            <div v-if="currentStep === 1" class="space-y-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">1. Informations personnelles</h3>

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
                  Date de naissance (optionnelle)
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
                  placeholder="Numéro, rue, résidence..."
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
                    pattern="[0-9]{5}"
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
            <div v-if="currentStep === 2" class="space-y-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">2. Votre profil d'usager</h3>

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

              <!-- Student specific fields -->
              <div v-if="form.userType === 'student'" class="space-y-4">
                <div>
                  <label for="schoolName" class="block text-sm font-medium text-gray-700 mb-2">
                    Lycée
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
                    Filière/Section
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
                    <option value="">Non renseigné</option>
                    <option value="daily">Quotidienne</option>
                    <option value="2-3_per_week">2-3 fois/semaine</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="occasional">Occasionnelle</option>
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
                    <option value="">Non renseigné</option>
                    <option value="car">Voiture</option>
                    <option value="correspondences">Correspondances</option>
                    <option value="depends_on_someone">Dépend de quelqu'un</option>
                    <option value="stopped">A arrêté</option>
                  </select>
                </div>
              </div>

              <!-- Participation -->
              <div class="bg-primary-50 rounded-lg p-6">
                <h4 class="font-bold text-gray-900 mb-4">Souhaitez-vous participer aux actions de l'association ?</h4>
                <label class="flex items-start mb-4 cursor-pointer">
                  <input
                    v-model="form.wantsToParticipate"
                    type="checkbox"
                    class="mt-1 mr-3"
                  />
                  <span class="text-sm text-gray-700">
                    Oui, je souhaite être contacté(e) pour participer aux actions
                  </span>
                </label>

                <div v-if="form.wantsToParticipate" class="space-y-2 ml-6">
                  <label class="flex items-center">
                    <input v-model="form.participationAreas" type="checkbox" value="communication" class="mr-2" />
                    <span class="text-sm">Communication (réseaux sociaux, flyers)</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="form.participationAreas" type="checkbox" value="legal" class="mr-2" />
                    <span class="text-sm">Soutien juridique</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="form.participationAreas" type="checkbox" value="events" class="mr-2" />
                    <span class="text-sm">Organisation d'événements</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="form.participationAreas" type="checkbox" value="actions" class="mr-2" />
                    <span class="text-sm">Actions de terrain</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="form.participationAreas" type="checkbox" value="press" class="mr-2" />
                    <span class="text-sm">Relations presse</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Step 3: Membership Fee -->
            <div v-if="currentStep === 3" class="space-y-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">3. Cotisation annuelle</h3>

              <div class="bg-primary-50 border-l-4 border-primary-600 p-6 rounded-r-lg mb-6">
                <p class="text-primary-900">
                  <strong>Important :</strong> Votre cotisation finance les actions juridiques et la mobilisation.
                  Choisissez le montant qui correspond à vos moyens.
                </p>
              </div>

              <div class="space-y-4">
                <label
                  v-for="option in membershipOptions"
                  :key="option.type"
                  :class="[
                    'card p-6 cursor-pointer transition-all border-2',
                    form.membershipType === option.type
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  ]"
                >
                  <input
                    v-model="form.membershipType"
                    type="radio"
                    :value="option.type"
                    class="mr-4"
                    required
                  />
                  <div class="inline-block">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="text-lg font-bold text-gray-900">{{ option.label }}</span>
                      <span class="text-2xl font-bold text-primary-600">{{ option.amount }}€</span>
                    </div>
                    <p class="text-sm text-gray-600">{{ option.description }}</p>
                  </div>
                </label>

                <!-- Custom amount -->
                <label
                  :class="[
                    'card p-6 cursor-pointer transition-all border-2',
                    form.membershipType === 'custom'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  ]"
                >
                  <input
                    v-model="form.membershipType"
                    type="radio"
                    value="custom"
                    class="mr-4"
                  />
                  <div class="inline-block">
                    <div class="font-bold text-gray-900 mb-2">Montant libre</div>
                    <input
                      v-if="form.membershipType === 'custom'"
                      v-model.number="form.customAmount"
                      type="number"
                      min="5"
                      step="1"
                      placeholder="Minimum 5€"
                      class="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </label>
              </div>

              <!-- RGPD Consents -->
              <div class="bg-gray-50 rounded-lg p-6 space-y-3">
                <label class="flex items-start cursor-pointer">
                  <input
                    v-model="form.acceptsNewsletter"
                    type="checkbox"
                    class="mt-1 mr-3"
                  />
                  <span class="text-sm text-gray-700">
                    J'accepte de recevoir la newsletter de l'ADUL21 (actualités, événements)
                  </span>
                </label>
                <label class="flex items-start cursor-pointer">
                  <input
                    v-model="form.acceptsActionSolicitation"
                    type="checkbox"
                    class="mt-1 mr-3"
                  />
                  <span class="text-sm text-gray-700">
                    J'accepte d'être sollicité(e) pour participer aux actions de mobilisation
                  </span>
                </label>
                <label class="flex items-start cursor-pointer">
                  <input
                    v-model="form.acceptsMediaContact"
                    type="checkbox"
                    class="mt-1 mr-3"
                  />
                  <span class="text-sm text-gray-700">
                    J'accepte d'être contacté(e) par les médias si nécessaire
                  </span>
                </label>
              </div>
            </div>

            <!-- Step 4: Confirmation -->
            <div v-if="currentStep === 4" class="space-y-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">4. Confirmation et paiement</h3>

              <!-- Summary -->
              <div class="card p-6 bg-gray-50">
                <h4 class="font-bold text-gray-900 mb-4">Récapitulatif</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Nom :</span>
                    <span class="font-semibold">{{ form.civility }} {{ form.firstName }} {{ form.lastName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Email :</span>
                    <span class="font-semibold">{{ form.email }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Commune :</span>
                    <span class="font-semibold">{{ form.city }}</span>
                  </div>
                  <div class="flex justify-between pt-4 border-t">
                    <span class="text-gray-600">Cotisation :</span>
                    <span class="text-2xl font-bold text-primary-600">{{ finalAmount }}€</span>
                  </div>
                </div>
              </div>

              <!-- Payment instructions -->
              <div class="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg">
                <h4 class="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                  <Icon name="heroicons:information-circle" class="w-6 h-6" />
                  Instructions de paiement
                </h4>
                <p class="text-yellow-900 mb-4">
                  Le paiement en ligne sera disponible prochainement. Pour l'instant, veuillez effectuer votre règlement par :
                </p>
                <ul class="space-y-2 text-yellow-900">
                  <li class="flex items-start">
                    <Icon name="heroicons:check-circle" class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Virement bancaire</strong> (coordonnées envoyées par email)</span>
                  </li>
                  <li class="flex items-start">
                    <Icon name="heroicons:check-circle" class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Chèque</strong> à l'ordre de "ADUL21" (adresse envoyée par email)</span>
                  </li>
                  <li class="flex items-start">
                    <Icon name="heroicons:check-circle" class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Espèces</strong> lors d'une permanence</span>
                  </li>
                </ul>
                <p class="text-yellow-900 mt-4 text-sm">
                  Vous recevrez un email de confirmation avec toutes les instructions de paiement.
                </p>
              </div>

              <!-- Final consent -->
              <div class="bg-gray-50 rounded-lg p-6">
                <label class="flex items-start cursor-pointer">
                  <input
                    v-model="form.acceptsProcessing"
                    type="checkbox"
                    required
                    class="mt-1 mr-3"
                  />
                  <span class="text-sm text-gray-700">
                    J'accepte que mes données soient traitées par l'ADUL21 dans le cadre de mon adhésion.
                    Ces données ne seront jamais partagées avec des tiers. <span class="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </div>

            <!-- Navigation buttons -->
            <div class="flex items-center justify-between mt-8 pt-6 border-t">
              <button
                v-if="currentStep > 1"
                type="button"
                @click="previousStep"
                class="btn-secondary"
              >
                <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2 inline" />
                Retour
              </button>
              <div v-else></div>

              <button
                v-if="currentStep < 4"
                type="submit"
                class="btn-primary"
              >
                Continuer
                <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-2 inline" />
              </button>
              <button
                v-else
                type="button"
                @click="submitMembership"
                :disabled="isSubmitting || !form.acceptsProcessing"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon v-if="!isSubmitting" name="heroicons:check-circle" class="w-5 h-5 mr-2 inline" />
                <Icon v-else name="heroicons:arrow-path" class="w-5 h-5 mr-2 inline animate-spin" />
                {{ isSubmitting ? 'Envoi en cours...' : 'Valider mon adhésion' }}
              </button>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="submitSuccess" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 text-green-800">
              <div class="flex items-start gap-3">
                <Icon name="heroicons:check-circle" class="w-6 h-6 flex-shrink-0" />
                <div>
                  <p class="font-bold mb-2">✓ Votre demande d'adhésion a été enregistrée avec succès !</p>
                  <p class="text-sm">
                    Vous allez recevoir un email de confirmation avec les instructions de paiement.
                    Votre adhésion sera activée dès réception de votre règlement.
                  </p>
                </div>
              </div>
            </div>
            <div v-if="submitError" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
              <div class="flex items-start gap-3">
                <Icon name="heroicons:x-circle" class="w-6 h-6 flex-shrink-0" />
                <div>
                  <p class="font-bold mb-2">✗ Une erreur est survenue</p>
                  <p class="text-sm">{{ submitError }}</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const currentStep = ref(1)
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref<string | null>(null)

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

  // Step 2: Profile
  userType: '',
  schoolName: '',
  schoolSection: '',
  usageBefore: '',
  usageAfter: '',
  wantsToParticipate: false,
  participationAreas: [] as string[],

  // Step 3: Membership
  membershipType: '',
  customAmount: null as number | null,
  acceptsNewsletter: false,
  acceptsActionSolicitation: false,
  acceptsMediaContact: false,

  // Step 4: Confirmation
  acceptsProcessing: false
})

const membershipOptions = [
  { type: 'reduced', label: 'Tarif réduit', amount: 5, description: 'Lycéens, étudiants, demandeurs d\'emploi' },
  { type: 'normal', label: 'Tarif normal', amount: 10, description: 'Adhésion individuelle standard' },
  { type: 'support', label: 'Tarif soutien', amount: 20, description: 'Pour soutenir davantage nos actions' }
]

const finalAmount = computed(() => {
  if (form.value.membershipType === 'custom') {
    return form.value.customAmount || 0
  }
  const option = membershipOptions.find(o => o.type === form.value.membershipType)
  return option?.amount || 0
})

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const submitMembership = async () => {
  if (!form.value.acceptsProcessing) {
    submitError.value = 'Vous devez accepter le traitement de vos données'
    return
  }

  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = null

  try {
    await $fetch('/api/membership', {
      method: 'POST',
      body: {
        ...form.value,
        membershipFee: finalAmount.value
      }
    })

    submitSuccess.value = true

    // Scroll to success message
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)

    // Redirect after 5 seconds
    setTimeout(() => {
      navigateTo('/')
    }, 5000)
  } catch (error: any) {
    console.error('Error submitting membership:', error)
    submitError.value = error.data?.message || 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.'
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Adhérer à l\'association',
  meta: [
    {
      name: 'description',
      content: 'Adhérez à l\'ADUL21 pour soutenir notre mobilisation. Votre cotisation finance nos actions juridiques et renforce notre légitimité.'
    }
  ]
})
</script>

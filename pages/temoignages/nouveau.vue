<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Partagez votre témoignage</h1>
        <p class="text-xl text-primary-100 max-w-3xl">
          Votre expérience est essentielle pour faire valoir nos droits. Chaque témoignage compte.
        </p>
      </div>
    </section>

    <!-- Form Section -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom max-w-4xl">
        <!-- Progress Steps -->
        <div class="mb-12">
          <div class="flex items-center justify-between">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="flex items-center"
              :class="{ 'flex-1': index < steps.length - 1 }"
            >
              <div class="flex flex-col items-center">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all"
                  :class="currentStep > index ? 'bg-green-500 text-white' : currentStep === index ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'"
                >
                  <Icon v-if="currentStep > index" name="heroicons:check" class="w-6 h-6" />
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <span class="text-xs mt-2 text-gray-600 hidden sm:block">{{ step }}</span>
              </div>
              <div
                v-if="index < steps.length - 1"
                class="flex-1 h-1 mx-2"
                :class="currentStep > index ? 'bg-green-500' : 'bg-gray-300'"
              ></div>
            </div>
          </div>
        </div>

        <!-- Form Card -->
        <div class="card p-8">
          <form @submit.prevent="nextStep">
            <!-- Step 1: Informations personnelles -->
            <div v-if="currentStep === 0" class="space-y-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Vos informations</h2>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.first_name"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span class="text-gray-500">(optionnel pour anonymat)</span>
                  </label>
                  <input
                    v-model="form.last_name"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tranche d'âge <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.age_range"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Choisir</option>
                    <option value="under_18">Moins de 18 ans</option>
                    <option value="18-30">18-30 ans</option>
                    <option value="30-50">30-50 ans</option>
                    <option value="50-70">50-70 ans</option>
                    <option value="over_70">Plus de 70 ans</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone <span class="text-gray-500">(optionnel)</span>
                  </label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Commune <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.city"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choisir</option>
                  <option value="Ledenon">Ledenon</option>
                  <option value="Cabrières">Cabrières</option>
                  <option value="Saint-Gervasy">Saint-Gervasy</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Vous êtes <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.user_type"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choisir</option>
                  <option value="student">Lycéen(ne)</option>
                  <option value="parent">Parent d'élève</option>
                  <option value="senior">Senior</option>
                  <option value="pmr">Personne à mobilité réduite</option>
                  <option value="worker">Travailleur/se</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <!-- Conditional fields for students -->
              <div v-if="form.user_type === 'student' || form.user_type === 'parent'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Lycée
                  </label>
                  <input
                    v-model="form.school_name"
                    type="text"
                    placeholder="Ex: Lycée Albert Camus"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Filière / Section
                  </label>
                  <input
                    v-model="form.school_section"
                    type="text"
                    placeholder="Ex: Bac STMG, BTS Audiovisuel..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <!-- Conditional fields for workers -->
              <div v-if="form.user_type === 'worker'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Lieu de travail
                  </label>
                  <input
                    v-model="form.workplace"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Horaires de travail
                  </label>
                  <input
                    v-model="form.work_hours"
                    type="text"
                    placeholder="Ex: 8h-17h"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <!-- Step 2: Usage AVANT -->
            <div v-if="currentStep === 1" class="space-y-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Votre usage AVANT la suppression</h2>
              <p class="text-gray-600 mb-6">Comment utilisiez-vous la ligne 21 directe ?</p>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fréquence d'utilisation <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.usage_before_frequency"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choisir</option>
                  <option value="daily">Quotidiennement</option>
                  <option value="2-3_per_week">2-3 fois par semaine</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="occasional">Occasionnellement</option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Temps de trajet (minutes)
                  </label>
                  <input
                    v-model.number="form.usage_before_time"
                    type="number"
                    min="0"
                    placeholder="Ex: 25"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Coût mensuel (€)
                  </label>
                  <input
                    v-model.number="form.usage_before_cost"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 45"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Destination principale
                </label>
                <input
                  v-model="form.usage_before_destination"
                  type="text"
                  placeholder="Ex: Gare SNCF de Nîmes, Lycée..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <!-- Step 3: Usage APRÈS -->
            <div v-if="currentStep === 2" class="space-y-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Votre situation APRÈS la suppression</h2>
              <p class="text-gray-600 mb-6">Comment vous déplacez-vous maintenant ?</p>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Solution de transport actuelle <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.usage_after_solution"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choisir</option>
                  <option value="car">Voiture personnelle ou dépendance</option>
                  <option value="correspondences">Bus avec correspondances</option>
                  <option value="depends_on_someone">Je dépends de quelqu'un</option>
                  <option value="stopped">J'ai dû arrêter mes déplacements</option>
                </select>
              </div>

              <!-- Conditional fields based on solution -->
              <div v-if="form.usage_after_solution === 'car'" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Distance parcourue (km/jour)
                    </label>
                    <input
                      v-model.number="form.usage_after_distance"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ex: 20"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Surcoût mensuel (€)
                    </label>
                    <input
                      v-model.number="form.usage_after_cost"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Ex: 150"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div v-if="form.usage_after_solution === 'correspondences'" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de correspondances
                    </label>
                    <input
                      v-model.number="form.usage_after_correspondences"
                      type="number"
                      min="0"
                      placeholder="Ex: 2"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Temps d'attente total (min)
                    </label>
                    <input
                      v-model.number="form.usage_after_wait_time"
                      type="number"
                      min="0"
                      placeholder="Ex: 30"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau temps total (min)
                    </label>
                    <input
                      v-model.number="form.usage_after_time"
                      type="number"
                      min="0"
                      placeholder="Ex: 75"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Correspondances ratées par mois
                  </label>
                  <input
                    v-model.number="form.missed_correspondences_per_month"
                    type="number"
                    min="0"
                    placeholder="Ex: 5"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <!-- Problems faced -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Problèmes rencontrés (plusieurs choix possibles)
                </label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input v-model="form.problems" type="checkbox" value="missed_correspondences" class="mr-2" />
                    <span class="text-gray-700">Correspondances ratées</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="form.problems" type="checkbox" value="delays" class="mr-2" />
                    <span class="text-gray-700">Retards fréquents</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="form.problems" type="checkbox" value="physical_difficulty" class="mr-2" />
                    <span class="text-gray-700">Difficulté physique (PMR, seniors)</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="form.problems" type="checkbox" value="fear" class="mr-2" />
                    <span class="text-gray-700">Peur/stress des correspondances</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="form.problems" type="checkbox" value="extra_cost" class="mr-2" />
                    <span class="text-gray-700">Surcoût financier</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Step 4: Témoignage -->
            <div v-if="currentStep === 3" class="space-y-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Votre témoignage</h2>
              <p class="text-gray-600 mb-6">Racontez-nous concrètement l'impact sur votre quotidien</p>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Témoignage principal <span class="text-red-500">*</span>
                  <span class="text-gray-500 text-xs">(50 à 2000 caractères)</span>
                </label>
                <textarea
                  v-model="form.testimony_text"
                  rows="8"
                  required
                  minlength="50"
                  maxlength="2000"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Racontez comment la suppression de la ligne directe impacte votre vie quotidienne, vos études, votre travail, ou celle de vos proches..."
                ></textarea>
                <div class="text-sm text-gray-500 mt-1">
                  {{ form.testimony_text.length }} / 2000 caractères
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Exemple concret (optionnel)
                  <span class="text-gray-500 text-xs">(max 500 caractères)</span>
                </label>
                <textarea
                  v-model="form.concrete_example"
                  rows="4"
                  maxlength="500"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: 'Le 15 janvier, j'ai raté ma correspondance et suis arrivé avec 1h de retard à mon examen...'"
                ></textarea>
                <div class="text-sm text-gray-500 mt-1">
                  {{ form.concrete_example?.length || 0 }} / 500 caractères
                </div>
              </div>

              <!-- Publication preferences -->
              <div class="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 class="font-semibold text-gray-900">Préférences de publication</h3>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Comment souhaitez-vous apparaître ? <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.publication_preference"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="first_name">Avec mon prénom (ex: "Marie")</option>
                    <option value="initials">Avec mes initiales (ex: "M.D.")</option>
                    <option value="anonymous">Anonyme</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="flex items-start">
                    <input v-model="form.accepts_site_publication" type="checkbox" class="mt-1 mr-3" />
                    <span class="text-sm text-gray-700">
                      J'accepte la publication de mon témoignage sur le site web de l'ADUL21 <span class="text-red-500">*</span>
                    </span>
                  </label>
                  <label class="flex items-start">
                    <input v-model="form.accepts_legal_use" type="checkbox" class="mt-1 mr-3" />
                    <span class="text-sm text-gray-700">
                      J'accepte que mon témoignage soit utilisé dans le cadre des démarches juridiques
                    </span>
                  </label>
                  <label class="flex items-start">
                    <input v-model="form.accepts_media_contact" type="checkbox" class="mt-1 mr-3" />
                    <span class="text-sm text-gray-700">
                      J'accepte d'être contacté(e) par les médias si nécessaire
                    </span>
                  </label>
                  <label class="flex items-start">
                    <input v-model="form.accepts_oral_testimony" type="checkbox" class="mt-1 mr-3" />
                    <span class="text-sm text-gray-700">
                      Je suis prêt(e) à témoigner oralement si besoin
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex items-center justify-between mt-8 pt-6 border-t">
              <button
                v-if="currentStep > 0"
                type="button"
                @click="previousStep"
                class="btn-secondary"
              >
                <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
                Retour
              </button>
              <div v-else></div>

              <button
                v-if="currentStep < steps.length - 1"
                type="submit"
                class="btn-primary"
              >
                Continuer
                <Icon name="heroicons:arrow-right" class="w-5 h-5 ml-2" />
              </button>
              <button
                v-else
                type="button"
                @click="submitTestimony"
                :disabled="isSubmitting || !form.accepts_site_publication"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon v-if="!isSubmitting" name="heroicons:paper-airplane" class="w-5 h-5 mr-2" />
                <Icon v-else name="heroicons:arrow-path" class="w-5 h-5 mr-2 animate-spin" />
                {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer mon témoignage' }}
              </button>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="submitSuccess" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              <div class="flex items-start">
                <Icon name="heroicons:check-circle" class="w-6 h-6 mr-3 flex-shrink-0 text-green-600" />
                <div>
                  <p class="font-semibold">Témoignage envoyé avec succès !</p>
                  <p class="text-sm mt-1">Merci pour votre participation. Votre témoignage sera examiné par notre équipe avant publication. Vous recevrez un email de confirmation.</p>
                </div>
              </div>
            </div>
            <div v-if="submitError" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              <div class="flex items-start">
                <Icon name="heroicons:x-circle" class="w-6 h-6 mr-3 flex-shrink-0 text-red-600" />
                <div>
                  <p class="font-semibold">Une erreur est survenue</p>
                  <p class="text-sm mt-1">{{ submitError }}</p>
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
const steps = ['Vos infos', 'Avant', 'Après', 'Témoignage']
const currentStep = ref(0)

const form = ref({
  // Step 1: Personal info
  first_name: '',
  last_name: '',
  age_range: '',
  email: '',
  phone: '',
  city: '',
  user_type: '',
  school_name: '',
  school_section: '',
  workplace: '',
  work_hours: '',

  // Step 2: Before
  usage_before_frequency: '',
  usage_before_time: null as number | null,
  usage_before_cost: null as number | null,
  usage_before_destination: '',

  // Step 3: After
  usage_after_solution: '',
  usage_after_time: null as number | null,
  usage_after_correspondences: null as number | null,
  usage_after_wait_time: null as number | null,
  usage_after_cost: null as number | null,
  usage_after_distance: null as number | null,
  problems: [] as string[],
  missed_correspondences_per_month: null as number | null,

  // Step 4: Testimony
  testimony_text: '',
  concrete_example: '',
  publication_preference: 'first_name',
  accepts_site_publication: true,
  accepts_legal_use: false,
  accepts_media_contact: false,
  accepts_oral_testimony: false
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const nextStep = () => {
  // Validation supplémentaire pour le step 1
  if (currentStep.value === 1 && !form.value.usage_before_frequency) {
    submitError.value = 'Veuillez sélectionner la fréquence d\'utilisation avant de continuer.'
    return
  }

  // Validation supplémentaire pour le step 2
  if (currentStep.value === 2 && !form.value.usage_after_solution) {
    submitError.value = 'Veuillez sélectionner votre solution de transport actuelle avant de continuer.'
    return
  }

  submitError.value = ''
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const submitTestimony = async () => {
  if (!form.value.accepts_site_publication) {
    submitError.value = 'Vous devez accepter la publication sur le site pour soumettre votre témoignage.'
    return
  }

  if (form.value.testimony_text.length < 50 || form.value.testimony_text.length > 2000) {
    submitError.value = 'Le témoignage doit contenir entre 50 et 2000 caractères.'
    return
  }

  if (!form.value.publication_preference) {
    submitError.value = 'Veuillez choisir comment vous souhaitez apparaître dans la publication.'
    return
  }

  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = ''

  try {
    const { data, error } = await $fetch('/api/testimonies', {
      method: 'POST',
      body: form.value
    })

    if (error) {
      throw new Error(error)
    }

    submitSuccess.value = true

    // Reset form after successful submission
    setTimeout(() => {
      navigateTo('/temoignages')
    }, 3000)
  } catch (error: any) {
    submitError.value = error.message || 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Partager mon témoignage',
  meta: [
    {
      name: 'description',
      content: 'Partagez votre expérience suite à la suppression de la ligne 21. Votre témoignage est essentiel pour faire valoir nos droits.'
    }
  ]
})
</script>

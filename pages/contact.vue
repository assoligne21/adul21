<template>
  <div>
    <!-- Page Header -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
        <p class="text-xl text-primary-100 max-w-3xl">
          Une question ? Un témoignage ? Vous souhaitez nous rejoindre ? N'hésitez pas à nous écrire.
        </p>
      </div>
    </section>

    <!-- Contact Form & Info -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Contact Info -->
          <div class="lg:col-span-1 space-y-6">
            <div class="card p-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Icon name="heroicons:envelope" class="w-6 h-6 text-primary-600" />
              </div>
              <h3 class="font-bold text-gray-900 mb-2">Email</h3>
              <a href="mailto:assoligne21@gmail.com" class="text-primary-600 hover:text-primary-700">
                assoligne21@gmail.com
              </a>
            </div>

            <div class="card p-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Icon name="heroicons:clock" class="w-6 h-6 text-primary-600" />
              </div>
              <h3 class="font-bold text-gray-900 mb-2">Délai de réponse</h3>
              <p class="text-gray-600">Nous vous répondons sous 48h ouvrées</p>
            </div>

            <div class="card p-6">
              <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Icon name="heroicons:shield-check" class="w-6 h-6 text-primary-600" />
              </div>
              <h3 class="font-bold text-gray-900 mb-2">Confidentialité</h3>
              <p class="text-gray-600">Vos données sont protégées et ne seront jamais partagées</p>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="lg:col-span-2">
            <div class="card p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>

              <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Civilité + Nom + Prénom -->
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

                <!-- Email + Téléphone -->
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
                      Téléphone (optionnel)
                    </label>
                    <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <!-- Sujet -->
                <div>
                  <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                    Sujet <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    v-model="form.subject"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Choisir un sujet</option>
                    <option value="testimony">Témoignage</option>
                    <option value="membership">Adhésion</option>
                    <option value="volunteering">Bénévolat</option>
                    <option value="press">Demande presse/média</option>
                    <option value="legal">Question juridique</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <!-- Message -->
                <div>
                  <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                    Message <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="6"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Décrivez votre demande..."
                  ></textarea>
                </div>

                <!-- RGPD -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <label class="flex items-start">
                    <input
                      v-model="form.acceptsProcessing"
                      type="checkbox"
                      required
                      class="mt-1 mr-3"
                    />
                    <span class="text-sm text-gray-700">
                      J'accepte que mes données soient traitées par l'ADUL21 dans le cadre de ma demande de contact. Ces données ne seront pas partagées avec des tiers. <span class="text-red-500">*</span>
                    </span>
                  </label>
                </div>

                <!-- Submit -->
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-500">
                    <span class="text-red-500">*</span> Champs obligatoires
                  </p>
                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon v-if="!isSubmitting" name="heroicons:paper-airplane" class="w-5 h-5 mr-2 inline" />
                    <Icon v-else name="heroicons:arrow-path" class="w-5 h-5 mr-2 inline animate-spin" />
                    {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le message' }}
                  </button>
                </div>

                <!-- Success/Error Messages -->
                <div v-if="submitSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                  ✓ Votre message a été envoyé avec succès ! Nous vous répondrons sous 48h.
                </div>
                <div v-if="submitError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                  ✗ Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const form = ref({
  civility: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  acceptsProcessing: false
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = false

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: form.value
    })

    submitSuccess.value = true
    // Reset form
    form.value = {
      civility: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      acceptsProcessing: false
    }
  } catch (error) {
    submitError.value = true
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Contact',
  meta: [
    {
      name: 'description',
      content: 'Contactez l\'ADUL21 pour toute question, témoignage ou demande d\'information sur la mobilisation pour le rétablissement de la ligne 21.'
    }
  ]
})
</script>

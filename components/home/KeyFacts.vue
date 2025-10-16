<template>
  <section class="py-16 bg-white">
    <div class="container-custom">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Le problème en chiffres
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          La suppression de la ligne directe a des conséquences graves pour les habitants
        </p>
      </div>

      <!-- Scénarios de coût sur une année scolaire (36 semaines) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- Scénario 3 jours/semaine -->
        <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Scénario 3 trajets/semaine</h3>
            <p class="text-sm text-gray-600">(36 semaines - depuis Ledenon)</p>
          </div>

          <div class="space-y-4">
            <!-- Coût carburant -->
            <div class="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="heroicons:currency-euro" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">194€</div>
                <p class="text-sm text-gray-600">de surcoût carburant</p>
              </div>
            </div>

            <!-- CO2 -->
            <div class="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="heroicons:cloud" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">520 kg</div>
                <p class="text-sm text-gray-600">de CO₂ supplémentaire</p>
              </div>
            </div>

            <!-- Temps perdu -->
            <div class="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="heroicons:clock" class="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">40 heures</div>
                <p class="text-sm text-gray-600">perdues dans les trajets</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Scénario 5 jours/semaine -->
        <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-200">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Scénario 5 trajets/semaine</h3>
            <p class="text-sm text-gray-600">(36 semaines - depuis Ledenon)</p>
          </div>

          <div class="space-y-4">
            <!-- Coût carburant -->
            <div class="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="heroicons:currency-euro" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">324€</div>
                <p class="text-sm text-gray-600">de surcoût carburant</p>
              </div>
            </div>

            <!-- CO2 -->
            <div class="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="heroicons:cloud" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">864 kg</div>
                <p class="text-sm text-gray-600">de CO₂ supplémentaire</p>
              </div>
            </div>

            <!-- Temps perdu -->
            <div class="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="heroicons:clock" class="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900">66 heures</div>
                <p class="text-sm text-gray-600">perdues dans les trajets</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats générales -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Stat Card: Habitants -->
        <div class="card p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Icon name="heroicons:user-group" class="w-6 h-6 text-blue-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-2">400+</div>
          <p class="text-gray-600">habitants privés de mobilité équitable dans les 3 villages</p>
        </div>

        <!-- Stat Card: Jeunes -->
        <div class="card p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Icon name="heroicons:academic-cap" class="w-6 h-6 text-purple-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-2">120+</div>
          <p class="text-gray-600">lycéens, étudiants, apprentis et jeunes actifs impactés quotidiennement</p>
        </div>
      </div>
    </div>
  </section>
</template>

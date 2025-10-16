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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Stat Card 1 -->
        <div class="card p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <Icon name="heroicons:clock" class="w-6 h-6 text-red-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-2">+45 min</div>
          <p class="text-gray-600">de temps de trajet en moyenne avec les correspondances</p>
        </div>

        <!-- Stat Card 2 -->
        <div class="card p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <Icon name="heroicons:currency-euro" class="w-6 h-6 text-orange-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-2">216€/an</div>
          <p class="text-gray-600">de surcoût pour les familles contraintes de prendre la voiture (Ledenon)</p>
        </div>

        <!-- Stat Card 3 -->
        <div class="card p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Icon name="heroicons:user-group" class="w-6 h-6 text-blue-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-2">400+</div>
          <p class="text-gray-600">habitants privés de mobilité équitable dans les 3 villages</p>
        </div>

        <!-- Stat Card 4 -->
        <div class="card p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Icon name="heroicons:academic-cap" class="w-6 h-6 text-green-600" />
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-2">120+</div>
          <p class="text-gray-600">lycéens, étudiants, apprentis et jeunes actifs</p>
        </div>
      </div>
    </div>
  </section>
</template>

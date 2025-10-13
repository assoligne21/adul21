<template>
  <section class="py-16 bg-gray-50">
    <div class="container-custom">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Le saviez-vous ?
        </h2>
        <p class="text-xl text-gray-600">
          L'impact concret sur les familles
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Ledenon Card -->
        <div class="card p-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <Icon name="heroicons:map-pin" class="w-6 h-6 text-red-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Depuis Ledenon</h3>
          </div>

          <div class="space-y-6">
            <div>
              <div class="flex items-baseline space-x-2 mb-2">
                <span class="text-4xl font-bold text-gray-900">9,2 km</span>
                <span class="text-gray-600">aller simple jusqu'à Marguerittes</span>
              </div>
              <p class="text-sm text-gray-500">Pour rejoindre la ligne de bus</p>
            </div>

            <div class="border-t pt-4">
              <p class="font-semibold text-gray-900 mb-3">Pour un parent qui va chercher son enfant :</p>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <Icon name="heroicons:arrow-right" class="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>18,4 km</strong> aller-retour quotidien</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:arrow-right" class="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>~1,80€</strong> de carburant par jour</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:arrow-right" class="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>4,8 kg</strong> de CO2 émis par jour</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:arrow-right" class="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>22 minutes</strong> perdues par jour</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:arrow-right" class="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>3 trajets par semaine</strong></span>
                </li>
              </ul>
            </div>

            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="font-bold text-red-900 mb-2">Sur une année scolaire (36 semaines) :</p>
              <ul class="space-y-1 text-red-800 text-sm">
                <li><strong>194€</strong> de surcoût carburant</li>
                <li><strong>520 kg</strong> de CO2 supplémentaire</li>
                <li><strong>40 heures</strong> perdues dans les trajets</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Cabrières Card -->
        <div class="card p-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <Icon name="heroicons:map-pin" class="w-6 h-6 text-orange-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Depuis Cabrières</h3>
          </div>

          <div class="space-y-6">
            <div>
              <div class="flex items-baseline space-x-2 mb-2">
                <span class="text-4xl font-bold text-gray-900">6 km</span>
                <span class="text-gray-600">aller simple jusqu'à Marguerittes</span>
              </div>
              <p class="text-sm text-gray-500">Pour rejoindre la ligne de bus</p>
            </div>

            <div class="border-t pt-4">
              <p class="font-semibold text-gray-900 mb-3">Pour un parent qui va chercher son enfant :</p>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <Icon name="heroicons:arrow-right" class="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>12 km</strong> aller-retour quotidien</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:arrow-right" class="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>~1,20€</strong> de carburant par jour</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:arrow-right" class="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>3,1 kg</strong> de CO2 émis par jour</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:arrow-right" class="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>14 minutes</strong> perdues par jour</span>
                </li>
                <li class="flex items-start">
                  <Icon name="heroicons:arrow-right" class="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span><strong>3 trajets par semaine</strong></span>
                </li>
              </ul>
            </div>

            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p class="font-bold text-orange-900 mb-2">Sur une année scolaire (36 semaines) :</p>
              <ul class="space-y-1 text-orange-800 text-sm">
                <li><strong>130€</strong> de surcoût carburant</li>
                <li><strong>335 kg</strong> de CO2 supplémentaire</li>
                <li><strong>25 heures</strong> perdues dans les trajets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Paradoxe écologique -->
      <div class="mt-12 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8 md:p-12">
        <div class="max-w-3xl mx-auto text-center">
          <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 mx-auto mb-6" />
          <h3 class="text-2xl md:text-3xl font-bold mb-4">
            Le paradoxe écologique
          </h3>
          <p class="text-xl mb-6 text-green-50">
            Nîmes Métropole nous <strong>FORCE à utiliser la voiture</strong> alors que nous voulions prendre le bus !
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div class="text-4xl font-bold mb-2">Avant</div>
              <p class="text-green-100">150 trajets bus/jour</p>
            </div>
            <div>
              <div class="text-4xl font-bold mb-2">Après</div>
              <p class="text-green-100">+80 trajets voiture/jour</p>
            </div>
            <div>
              <div class="text-4xl font-bold mb-2">Bilan</div>
              <p class="text-green-100">+1.000 tonnes CO2/an</p>
            </div>
          </div>
          <p class="mt-6 text-sm text-green-100">
            L'équivalent de 500 allers-retours Paris-New York !
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

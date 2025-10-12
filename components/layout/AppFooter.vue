<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="container-custom py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- À propos -->
        <div>
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-xl">21</span>
            </div>
            <div>
              <div class="font-bold text-white text-lg">ADUL21</div>
            </div>
          </div>
          <p class="text-sm text-gray-400 mb-4">
            Association de défense des usagers de la ligne 21 Ledenon-Cabrières-Saint-Gervasy vers Nîmes.
          </p>
          <div class="text-sm text-gray-400">
            <p>Email : <a href="mailto:assoligne21@gmail.com" class="text-primary-400 hover:text-primary-300">assoligne21@gmail.com</a></p>
          </div>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="font-semibold text-white mb-4">Navigation</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/revendications" class="hover:text-white transition-colors">Nos revendications</NuxtLink></li>
            <li><NuxtLink to="/arguments-juridiques" class="hover:text-white transition-colors">Arguments juridiques</NuxtLink></li>
            <li><NuxtLink to="/impacts" class="hover:text-white transition-colors">Impacts chiffrés</NuxtLink></li>
            <li><NuxtLink to="/temoignages" class="hover:text-white transition-colors">Témoignages</NuxtLink></li>
            <li><NuxtLink to="/actualites" class="hover:text-white transition-colors">Actualités</NuxtLink></li>
          </ul>
        </div>

        <!-- Agir -->
        <div>
          <h3 class="font-semibold text-white mb-4">Agir</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/rejoindre/adherer" class="hover:text-white transition-colors">Adhérer à l'association</NuxtLink></li>
            <li><NuxtLink to="/rejoindre/donner" class="hover:text-white transition-colors">Faire un don</NuxtLink></li>
            <li><NuxtLink to="/temoignages/nouveau" class="hover:text-white transition-colors">Témoigner</NuxtLink></li>
            <li><NuxtLink to="/telechargements" class="hover:text-white transition-colors">Télécharger des courriers types</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-white transition-colors">Nous contacter</NuxtLink></li>
          </ul>
        </div>

        <!-- Légal -->
        <div>
          <h3 class="font-semibold text-white mb-4">Informations légales</h3>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/mentions-legales" class="hover:text-white transition-colors">Mentions légales</NuxtLink></li>
            <li><NuxtLink to="/politique-confidentialite" class="hover:text-white transition-colors">Politique de confidentialité</NuxtLink></li>
          </ul>
          <div class="mt-6">
            <p class="text-xs text-gray-500">
              Association loi 1901<br>
              © {{ currentYear }} ADUL21
            </p>
          </div>
        </div>
      </div>

      <!-- Separator -->
      <div class="border-t border-gray-800 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>Fait avec ❤️ pour défendre les droits des usagers</p>
          <p class="mt-4 md:mt-0">
            Site conforme au RGPD - Analytics sans cookies (Plausible)
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

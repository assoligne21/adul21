<template>
  <section class="hero-section">
    <!-- Background gradient with pattern -->
    <div class="hero-background"></div>
    <div class="hero-overlay"></div>

    <!-- Main content -->
    <div class="hero-content">
      <!-- Logo -->
      <div class="hero-logo">
        <img src="/logo-adul21.svg" alt="ADUL21" class="w-auto h-24 md:h-32 mx-auto mb-8" />
      </div>

      <!-- Bus line visualization -->
      <div class="bus-line">
        <div class="bus-line-container">
          <span class="village">Ledenon</span>
          <div class="line-segment"></div>
          <span class="village">Cabrières</span>
          <div class="line-segment"></div>
          <span class="village">Saint-Gervasy</span>
          <div class="line-broken"></div>
          <div class="cross"></div>
          <div class="line-broken"></div>
          <div class="destination">
            <Icon name="heroicons:map-pin" class="w-5 h-5" />
            Gare de Nîmes
          </div>
        </div>
      </div>

      <!-- Main title -->
      <h1 class="hero-title">
        NOTRE LIGNE DIRECTE
        <span class="highlight">A ÉTÉ SUPPRIMÉE</span>
      </h1>

      <!-- Subtitle -->
      <p class="hero-subtitle">
        Nous exigeons son rétablissement immédiat
      </p>

      <!-- CTA Buttons -->
      <div class="hero-ctas">
        <NuxtLink to="/temoignages/nouveau" class="cta-button cta-primary">
          <Icon name="heroicons:document-text" class="w-5 h-5" />
          Témoigner
        </NuxtLink>
        <NuxtLink to="/rejoindre/adherer" class="cta-button cta-secondary">
          <Icon name="heroicons:user-plus" class="w-5 h-5" />
          Adhérer
        </NuxtLink>
        <NuxtLink to="/revendications" class="cta-button cta-tertiary">
          <Icon name="heroicons:arrow-right" class="w-5 h-5" />
          Nos revendications
        </NuxtLink>
      </div>

      <!-- Stats -->
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">{{ stats.supporters }}+</span>
          <span class="stat-label">Citoyens mobilisés</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ stats.signatures }}+</span>
          <span class="stat-label">Signatures</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ stats.testimonies }}+</span>
          <span class="stat-label">Témoignages</span>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-indicator">
      <Icon name="heroicons:chevron-down" class="w-8 h-8" />
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = ref({
  supporters: 347,
  signatures: 1247,
  testimonies: 87
})

// Animate counters on mount
onMounted(() => {
  // Animation des compteurs sera gérée par CSS
})
</script>

<style scoped>
/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 2rem;
}

/* Background */
.hero-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%);
}

/* Pattern overlay */
.hero-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(30, 58, 138, 0.95) 0%,
    rgba(59, 130, 246, 0.9) 50%,
    rgba(30, 64, 175, 0.95) 100%
  );
  z-index: 1;
}

/* Content */
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  text-align: center;
  color: white;
}

/* Bus Line */
.bus-line {
  margin-bottom: 3rem;
  padding: 0 1rem;
}

.bus-line-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.village {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #dbeafe;
}

.line-segment {
  flex-grow: 1;
  max-width: 150px;
  height: 4px;
  background: white;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.line-broken {
  position: relative;
  flex-grow: 1;
  max-width: 150px;
  height: 4px;
}

.line-broken::before,
.line-broken::after {
  content: '';
  position: absolute;
  height: 4px;
  background: white;
  width: 45%;
}

.line-broken::before {
  left: 0;
}

.line-broken::after {
  right: 0;
}

.cross {
  position: relative;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.cross::before,
.cross::after {
  content: '';
  position: absolute;
  background: #ef4444;
  width: 6px;
  height: 40px;
  border-radius: 3px;
}

.cross::before {
  transform: rotate(45deg);
}

.cross::after {
  transform: rotate(-45deg);
}

.destination {
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Title */
.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.hero-title .highlight {
  color: #fbbf24;
  display: block;
  margin-top: 0.5rem;
}

/* Subtitle */
.hero-subtitle {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 600;
  margin-bottom: 3rem;
  color: #dbeafe;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* CTA Buttons */
.hero-ctas {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 3px solid transparent;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cta-primary {
  background: #ef4444;
  color: white;
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
}

.cta-primary:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(239, 68, 68, 0.6);
}

.cta-secondary {
  background: white;
  color: #1e40af;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
}

.cta-secondary:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(255, 255, 255, 0.5);
}

.cta-tertiary {
  background: transparent;
  color: white;
  border-color: white;
}

.cta-tertiary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Stats */
.hero-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 2rem;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 900;
  color: #fbbf24;
  display: block;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #dbeafe;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  animation: bounce 2s ease-in-out infinite;
  color: white;
  opacity: 0.7;
}

@keyframes bounce {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 10px); }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 4rem 1.5rem;
  }

  .bus-line-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .line-segment,
  .line-broken {
    max-width: 80px;
    height: 3px;
  }

  .village {
    font-size: 0.8rem;
  }

  .hero-ctas {
    flex-direction: column;
    width: 100%;
  }

  .cta-button {
    width: 100%;
    justify-content: center;
  }

  .hero-stats {
    gap: 1.5rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }
}
</style>

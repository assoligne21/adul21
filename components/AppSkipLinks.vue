<template>
  <div class="skip-links">
    <a href="#main-content" class="skip-link">
      Aller au contenu principal
    </a>
    <a href="#main-navigation" class="skip-link">
      Aller à la navigation
    </a>
  </div>
</template>

<style scoped>
.skip-links {
  position: relative;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 9999;
  padding: 1rem 1.5rem;
  background-color: #2563eb;
  color: white;
  text-decoration: none;
  font-weight: 600;
  border-radius: 0 0 0.5rem 0.5rem;
  transition: top 0.2s ease-in-out;
}

.skip-link:focus {
  top: 0;
  outline: 3px solid #fbbf24;
  outline-offset: 2px;
}

.skip-link:focus-visible {
  top: 0;
}
</style>

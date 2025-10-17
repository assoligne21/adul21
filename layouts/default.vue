<template>
  <div>
    <AppSkipLinks />
    <LayoutAppHeader />

    <main id="main-content" tabindex="-1">
      <slot />
    </main>

    <LayoutAppFooter />
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <nav class="app-nav">
      <span class="app-nav__brand">Site Cerise</span>
      <RouterLink to="/courses" class="app-nav__link">Cours</RouterLink>
      <RouterLink to="/sessions" class="app-nav__link">Séances</RouterLink>
      <RouterLink to="/materiel" class="app-nav__link">Matériel</RouterLink>
      <RouterLink to="/materiel/attribution" class="app-nav__link">Attribution</RouterLink>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-nav {
  background-color: var(--color-eni-green);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.app-nav__brand {
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
}

.app-nav__link {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  opacity: 0.9;
}

.app-nav__link:hover {
  opacity: 1;
  text-decoration: underline;
}
</style>

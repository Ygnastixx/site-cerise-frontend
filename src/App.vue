<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="logo">🍒 Site Cerise</div>
      <div class="links">
        <RouterLink to="/login" class="nav-link">Connexion</RouterLink>
        <RouterLink to="/register" class="nav-link">Inscription</RouterLink>
        <RouterLink to="/courses" class="nav-link">Cours</RouterLink>
        <RouterLink to="/inventory" class="nav-link">Inventaire</RouterLink>
        <RouterLink to="/sessions" class="nav-link">Sessions</RouterLink>
        <RouterLink to="/studio" class="nav-link">Studio</RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/admin/pending" class="nav-link"
          >Validations</RouterLink
        >
      </div>
    </nav>
    <main><RouterView /></main>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--color-eni-green);
}

.logo {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}

.links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.nav-link:hover {
  opacity: 1;
  text-decoration: underline;
}

.nav-link.router-link-active {
  color: #ffd0d0;
  font-weight: bold;
  opacity: 1;
}

main {
  min-height: calc(100vh - 70px);
  background: #f7f7f7;
}
</style>

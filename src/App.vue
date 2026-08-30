<script setup>
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="logo">🍒 Site Cerise</div>
      <div class="links">
        <div v-if="!authStore.isAuthenticated" class="nav-group">
          <RouterLink to="/login" class="nav-link">Connexion</RouterLink>
          <RouterLink to="/register" class="nav-link">Inscription</RouterLink>
        </div>

        <div v-else class="nav-group">
          <RouterLink to="/courses" class="nav-link">Cours</RouterLink>
          <RouterLink to="/inventory" class="nav-link">Inventaire</RouterLink>
          <RouterLink to="/sessions" class="nav-link">Sessions</RouterLink>
          <RouterLink to="/studio" class="nav-link">Studio</RouterLink>
          <RouterLink v-if="authStore.isAdmin" to="/admin/pending" class="nav-link">
            Validations
          </RouterLink>

          <span class="account-badge">{{ authStore.matricule }} · {{ authStore.role }}</span>
          <button class="logout-btn" @click="handleLogout">Déconnexion</button>
        </div>
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
  align-items: center;
}

/* Groupe interne pour aligner les éléments v-if / v-else */
.nav-group {
  display: flex;
  align-items: center;
  gap: 1.25rem; /* Aère correctement tous les liens et boutons */
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.12); /* Feedback visuel doux */
  text-decoration: none;
}

/* État actif : surlignage doux rappelant les ton cerise clair */
.nav-link.router-link-active {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.22);
  font-weight: 600;
}

/* Badge utilisateur réadapté au fond foncé (lisibilité optimale) */
.account-badge {
  font-size: 0.8rem;
  color: #ffffff;
  padding: 0.35rem 0.8rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  margin-left: 0.5rem;
}

/* Bouton de déconnexion stylisé sur fond sombre */
.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #ffffff;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: var(--color-cherry-red);
  border-color: var(--color-cherry-red);
  color: #ffffff;
}

main {
  min-height: calc(100vh - 70px);
  background: #f7f7f7;
}
</style>

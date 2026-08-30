<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const matricule = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(matricule.value, password.value)
    router.push('/courses')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Identifiants invalides ou serveur indisponible.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <p class="eyebrow">SITE CERISE</p>
      <h1>Connexion</h1>
      <p class="subtitle">Accède à tes cours, séances et outils du club.</p>

      <div v-if="error" class="alert">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <label for="matricule">Matricule</label>
          <input id="matricule" v-model="matricule" type="text" autocomplete="username" required />
        </div>

        <div class="field">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <p class="switch-link">
        Pas encore de compte ?
        <RouterLink to="/register">S'inscrire</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(160deg, #fdf2f2 0%, #f4faf6 100%);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--color-cherry-red);
  margin: 0 0 0.5rem;
  text-transform: uppercase;
}

h1 {
  margin: 0 0 0.4rem;
  font-size: 1.6rem;
  color: #1f2937;
}

.subtitle {
  margin: 0 0 1.75rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.field {
  margin-bottom: 1.25rem;
}

.field label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
}

.field input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.field input:focus {
  outline: none;
  border-color: var(--color-eni-green);
  box-shadow: 0 0 0 3px rgba(34, 139, 87, 0.15);
}

.btn-primary {
  width: 100%;
  background: var(--color-cherry-red);
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: filter 0.15s;
}

.btn-primary:hover:not(:disabled) {
  filter: brightness(0.92);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  padding: 0.7rem 0.9rem;
  border-radius: 8px;
  background: #fff0f0;
  color: #a31616;
  border: 1px solid #f2c1c1;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
}

.switch-link {
  text-align: center;
  margin-top: 1.75rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.switch-link a {
  color: var(--color-eni-green);
  font-weight: 600;
  text-decoration: none;
}

.switch-link a:hover {
  text-decoration: underline;
}
</style>

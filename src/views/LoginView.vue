<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    // Appel vers l'endpoint d'obtention de token SimpleJWT de Django
    const response = await api.post('/token/', {
      matricule: username.value,
      password: password.value,
    })

    // Stockage du jeton d'accès
    localStorage.setItem('access_token', response.data.access)
    if (response.data.refresh) {
      localStorage.setItem('refresh_token', response.data.refresh)
    }

    // Redirection vers la page des cours
    router.push('/courses')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Identifiants invalides ou serveur indisponible.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <p class="eyebrow">SITE CERISE</p>
      <h1>Connexion</h1>

      <div v-if="error" class="alert">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <label>
          Matricule
          <input v-model="username" type="text" required placeholder="ex: admin" />
        </label>

        <label>
          Mot de passe
          <input v-model="password" type="password" required />
        </label>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 80vh;
  display: grid;
  place-items: center;
  padding: 20px;
}
.login-card {
  width: min(400px, 100%);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}
.eyebrow {
  color: var(--color-cherry-red);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}
h1 {
  font-size: 1.8rem;
  margin: 4px 0 20px;
}
form {
  display: grid;
  gap: 16px;
}
label {
  display: grid;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
}
input {
  width: 100%;
  border: 1px solid #d8dde3;
  border-radius: 8px;
  padding: 10px 12px;
  font: inherit;
}
.btn-primary {
  background: var(--color-eni-green);
  color: #fff;
  border: 0;
  border-radius: 7px;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}
.alert {
  padding: 10px;
  border-radius: 8px;
  background: #fff0f0;
  color: #a31616;
  border: 1px solid #f2c1c1;
  font-size: 0.85rem;
  margin-bottom: 12px;
}
</style>

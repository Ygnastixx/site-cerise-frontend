<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const matricule = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await api.post('/users/register/', {
      matricule: matricule.value,
      username: username.value,
      email: email.value,
      password: password.value,
    })
    success.value = true
  } catch (err) {
    error.value =
      err.response?.data?.detail ||
      Object.values(err.response?.data || {})
        .flat()
        .join(' ') ||
      'Impossible de créer le compte.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <p class="eyebrow">SITE CERISE</p>
      <h1>Inscription</h1>
      <p class="subtitle">
        Ton compte devra être validé par un administrateur avant de pouvoir te connecter.
      </p>

      <div v-if="success" class="alert-success">
        Compte créé ! Il doit être validé par un administrateur avant de pouvoir vous connecter.
      </div>

      <div v-if="error" class="alert">{{ error }}</div>

      <form v-if="!success" @submit.prevent="handleRegister">
        <div class="field">
          <label for="matricule">Matricule</label>
          <input id="matricule" v-model="matricule" type="text" autocomplete="username" required />
        </div>
        <div class="field">
          <label for="username">Nom d'utilisateur</label>
          <input id="username" v-model="username" type="text" autocomplete="nickname" required />
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" autocomplete="email" required />
        </div>
        <div class="field">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="new-password"
            required
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Création...' : "S'inscrire" }}
        </button>
      </form>

      <p class="switch-link">
        Déjà un compte ?
        <RouterLink to="/login">Se connecter</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* identique au style de LoginView.vue */
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
.alert-success {
  padding: 0.7rem 0.9rem;
  border-radius: 8px;
  background: #f0fff4;
  color: #166534;
  border: 1px solid #bbf7d0;
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

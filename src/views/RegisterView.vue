<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
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
  <div class="login-container">
    <div class="login-card">
      <p class="eyebrow">SITE CERISE</p>
      <h1>Inscription</h1>

      <div v-if="success" class="alert-success">
        Compte créé ! Il doit être validé par un administrateur avant de pouvoir vous connecter.
      </div>

      <div v-if="error" class="alert">{{ error }}</div>

      <form v-if="!success" @submit.prevent="handleRegister">
        <label>
          Matricule
          <input v-model="matricule" type="text" required />
        </label>
        <label>
          Nom d'utilisateur
          <input v-model="username" type="text" required />
        </label>
        <label>
          Email
          <input v-model="email" type="email" required />
        </label>
        <label>
          Mot de passe
          <input v-model="password" type="password" required />
        </label>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Création...' : "S'inscrire" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* copie le <style scoped> de LoginView.vue tel quel, + cette classe en plus */
.alert-success {
  padding: 10px;
  border-radius: 8px;
  background: #f0fff4;
  color: #166534;
  border: 1px solid #bbf7d0;
  font-size: 0.85rem;
  margin-bottom: 12px;
}
</style>

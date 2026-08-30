<template>
  <div class="sessions-page">
    <header>
      <div>
        <h1>Sessions de formation</h1>
        <p>Calendrier et gestion des sessions.</p>
      </div>

      <button v-if="authStore.isStaffOrAdmin" @click="showForm = true">+ Nouvelle session</button>
    </header>

    <SessionForm
      v-if="showForm && authStore.isStaffOrAdmin"
      @submit="saveSession"
      @cancel="showForm = false"
    />

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <SessionCalendar :sessions="sessions" />

    <div class="cards">
      <SessionCard
        v-for="session in sessions"
        :key="session.id"
        :session="session"
        @view="viewSession"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import SessionCard from '../../components/sessions_app/sessionCard.vue'
import SessionForm from '../../components/sessions_app/sessionForm.vue'
import SessionCalendar from '../../components/sessions_app/sessionCalendar.vue'

import { getSessions, createSession } from '../../services/sessionsService'

const router = useRouter()

const authStore = useAuthStore()
const sessions = ref([])
const showForm = ref(false)
const error = ref('')

const loadSessions = async () => {
  try {
    sessions.value = await getSessions()
  } catch (err) {
    console.error(err)
    error.value = 'Impossible de charger les sessions.'
  }
}

const saveSession = async (data) => {
  try {
    await createSession(data)

    showForm.value = false

    await loadSessions()
  } catch (err) {
    console.error(err)
    error.value = 'Erreur lors de la création de la session.'
  }
}

const viewSession = (session) => {
  router.push(`/sessions/${session.id}`)
}

onMounted(loadSessions)
</script>

<style scoped>
.sessions-page {
  padding: 2rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  color: var(--color-eni-green);
}

header button {
  background: var(--color-cherry-red);
  color: white;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.error {
  background: #ffe5e5;
  color: var(--color-cherry-red);
  padding: 1rem;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getSession, reserveEquipment } from '@/services/sessionsService'
import { getInventory } from '@/services/inventoryService'
import { formatSessionDate } from '@/utils/dateFormat'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const session = ref(null)
const inventory = ref([])
const loading = ref(true)
const selectedEquipmentId = ref('')
const quantityToReserve = ref(1)
const reservationMessage = ref('')

const loadData = async () => {
  try {
    session.value = await getSession(route.params.id)
    inventory.value = await getInventory()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleReserve = async () => {
  if (!selectedEquipmentId.value) return
  reservationMessage.value = ''
  try {
    await reserveEquipment(session.value.id, {
      equipment_id: selectedEquipmentId.value,
      quantity: quantityToReserve.value,
    })
    reservationMessage.value = 'Matériel réservé avec succès !'
    await loadData()
  } catch (err) {
    reservationMessage.value = 'Erreur lors de la réservation du matériel.'
  }
}

onMounted(loadData)
</script>

<template>
  <div class="session-detail-container">
    <div v-if="loading" class="state-card">Chargement des détails de la session...</div>

    <div v-else-if="session" class="session-layout">
      <!-- Panneau de gauche : Détails de la session -->
      <main class="main-card">
        <div class="session-header">
          <span class="badge">SESSION #{{ session.id }}</span>
          <h1>{{ session.theme }}</h1>
        </div>

        <div class="info-grid">
          <div class="info-card">
            <span class="icon">📅</span>
            <div>
              <label>Date & Heure</label>
              <p>{{ formatSessionDate(session.date) }}</p>
            </div>
          </div>

          <div class="info-card">
            <span class="icon">📍</span>
            <div>
              <label>Lieu</label>
              <p>{{ session.location || 'Non spécifié' }}</p>
            </div>
          </div>
        </div>

        <div v-if="session.description" class="description-section">
          <h3>Description</h3>
          <p>{{ session.description }}</p>
        </div>

        <div v-if="session.course" class="course-link-card">
          <span>📚 Cours rattaché :</span>
          <RouterLink :to="`/courses/${session.course.id}`" class="link">
            {{ session.course.title }} →
          </RouterLink>
        </div>
      </main>

      <!-- Panneau de droite : Matériel réservé & Réservation -->
      <aside class="sidebar-card">
        <h2>🛠️ Matériel de la session</h2>

        <!-- Liste des équipements réservés -->
        <div class="reserved-list">
          <p v-if="!session.equipments?.length" class="empty-text">
            Aucun matériel n'est réservé pour cette séance.
          </p>

          <ul v-else>
            <li v-for="item in session.equipments" :key="item.id" class="reserved-item">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">x{{ item.quantity }}</span>
            </li>
          </ul>
        </div>

        <hr v-if="authStore.isStaffOrAdmin" class="separator" />

        <!-- Formulaire de réservation -->
        <form
          v-if="authStore.isStaffOrAdmin"
          @submit.prevent="handleReserve"
          class="reservation-form"
        >
          <h3>Réserver un matériel</h3>

          <div v-if="reservationMessage" class="feedback-msg">
            {{ reservationMessage }}
          </div>

          <div class="form-group">
            <label>Équipement</label>
            <select v-model="selectedEquipmentId" required>
              <option value="">-- Sélectionner --</option>
              <option v-for="eq in inventory" :key="eq.id" :value="eq.id">
                {{ eq.name }} (Dispo: {{ eq.quantity }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Quantité</label>
            <input v-model.number="quantityToReserve" type="number" min="1" required />
          </div>

          <button type="submit" class="btn-reserve">Réserver</button>
        </form>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.session-detail-container {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.state-card {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  color: var(--color-text-muted);
}

.session-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1.5rem;
}

.main-card,
.sidebar-card {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  padding: 2rem;
}

.badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-eni-green);
  background: var(--color-bg-subtle);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

h1 {
  font-size: 1.8rem;
  margin-top: 0.5rem;
  color: var(--color-text-dark);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: var(--color-bg-subtle);
  padding: 1rem;
  border-radius: 8px;
}

.info-card .icon {
  font-size: 1.3rem;
}

.info-card label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.info-card p {
  font-weight: 600;
  color: var(--color-text-dark);
  margin: 0;
}

.description-section {
  margin-top: 1.5rem;
}

.description-section h3 {
  font-size: 1rem;
  color: var(--color-eni-green);
  margin-bottom: 0.5rem;
}

.course-link-card {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.course-link-card .link {
  color: var(--color-eni-green);
  font-weight: 700;
}

/* Sidebar Styles */
.sidebar-card h2 {
  font-size: 1.15rem;
  color: var(--color-text-dark);
  margin-bottom: 1rem;
}

.reserved-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reserved-item {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px dashed var(--color-border);
  font-size: 0.9rem;
}

.item-name {
  font-weight: 600;
}

.item-qty {
  color: var(--color-cherry-red);
  font-weight: 700;
}

.empty-text {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-style: italic;
}

.separator {
  border: 0;
  height: 1px;
  background: var(--color-border);
  margin: 1.5rem 0;
}

.reservation-form h3 {
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.feedback-msg {
  padding: 0.6rem;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.btn-reserve {
  width: 100%;
  background: var(--color-eni-green);
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-reserve:hover {
  background: var(--color-eni-green-light);
}

@media (max-width: 850px) {
  .session-layout {
    grid-template-columns: 1fr;
  }
}
</style>

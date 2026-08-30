<template>
  <div class="detail-page">
    <button @click="$router.back()">← Retour</button>

    <div v-if="loading">Chargement...</div>

    <div v-else-if="session">
      <h1>{{ session.theme }}</h1>

      <div class="card">
        <p><strong>Date :</strong> {{ formatSessionDate(session.date) }}</p>
        <p><strong>Lieu :</strong> {{ session.location || "Non défini" }}</p>
        <p v-if="session.description"><strong>Description :</strong> {{ session.description }}</p>
        <p v-if="session.course_title"><strong>Cours associé :</strong> {{ session.course_title }}</p>

        <hr>

        <h2>Matériel réservé</h2>
        <ul v-if="session.equipments?.length">
          <li v-for="item in session.equipments" :key="item.equipment_id">
            {{ item.name }} — {{ item.quantity_reserved }}
          </li>
        </ul>
        <p v-else>Aucun matériel réservé pour l'instant.</p>

        <h2>Réserver du matériel</h2>

        <select v-model="equipmentId">
          <option disabled :value="null">Choisir un matériel</option>
          <option v-for="item in equipmentList" :key="item.id" :value="item.id">
            {{ item.name }} (stock : {{ item.quantity }})
          </option>
        </select>

        <input v-model.number="quantity" type="number" min="1" placeholder="Quantité" />

        <button @click="reserve">Réserver</button>

        <p v-if="message">{{ message }}</p>
      </div>
    </div>

    <div v-else>Session introuvable.</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { getSession, reserveEquipment } from "../../services/sessionsService";
import { getInventory } from "../../services/inventoryService";
import { formatSessionDate } from '../../utils/dateFormat'

const route = useRoute();

const session = ref(null);
const loading = ref(true);
const equipmentList = ref([]);

const equipmentId = ref(null);
const quantity = ref(1);
const message = ref("");

const loadSession = async () => {
  try {
    session.value = await getSession(route.params.id);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const loadEquipment = async () => {
  try {
    equipmentList.value = await getInventory();
  } catch (error) {
    console.error(error);
  }
};

const reserve = async () => {
  if (!equipmentId.value) return;
  try {
    await reserveEquipment(route.params.id, {
      equipment_id: equipmentId.value,
      quantity_reserved: quantity.value,
    });
    message.value = "Matériel réservé avec succès.";
    await loadSession();
  } catch (error) {
    console.error(error);
    message.value = "Erreur lors de la réservation.";
  }
};

onMounted(() => {
  loadSession();
  loadEquipment();
});
</script>

<style scoped>
.detail-page {
  padding: 2rem;
}

.card {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

input {
  display: block;
  margin: 0.5rem 0;
  padding: 0.7rem;
}

button {
  background: var(--color-cherry-red);
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}
</style>

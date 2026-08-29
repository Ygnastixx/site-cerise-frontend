<template>
  <div class="detail-page">

    <button @click="$router.back()">
      ← Retour
    </button>

    <div v-if="loading">
      Chargement...
    </div>

    <div v-else-if="session">

      <h1>{{ session.title }}</h1>

      <div class="card">

        <p>
          <strong>Date :</strong>
          {{ session.date }}
        </p>

        <p>
          <strong>Heure :</strong>
          {{ session.start_time || "Non définie" }}
        </p>

        <p>
          <strong>Lieu :</strong>
          {{ session.location || "Non défini" }}
        </p>

        <hr>

        <h2>Réserver du matériel</h2>

        <input
          v-model.number="equipmentId"
          type="number"
          placeholder="ID du matériel"
        />

        <input
          v-model.number="quantity"
          type="number"
          min="1"
          placeholder="Quantité"
        />

        <button @click="reserve">
          Réserver
        </button>

        <p v-if="message">
          {{ message }}
        </p>

      </div>

    </div>

    <div v-else>
      Session introuvable.
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import {
  getSession,
  reserveEquipment,
} from "../../services/sessionsService";

const route = useRoute();

const session = ref(null);
const loading = ref(true);

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

const reserve = async () => {
  try {
    await reserveEquipment(route.params.id, {
      equipment_id: equipmentId.value,
      quantity: quantity.value,
    });

    message.value = "Matériel réservé avec succès.";
  } catch (error) {
    console.error(error);
    message.value = "Erreur lors de la réservation.";
  }
};

onMounted(loadSession);
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
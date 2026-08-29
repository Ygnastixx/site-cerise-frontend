<template>
  <div class="detail-page">
    <button @click="$router.back()" class="back">← Retour</button>

    <div v-if="loading">Chargement...</div>

    <div v-else-if="equipment">
      <h1>{{ equipment.name }}</h1>
      <div class="detail-card">
        <p><strong>Description :</strong> {{ equipment.description || 'Aucune description' }}</p>
        <p><strong>Quantité :</strong> {{ equipment.quantity }}</p>
      </div>
    </div>

    <div v-else>Matériel introuvable.</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../services/api'

const route = useRoute()
const equipment = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get(`/inventory/equipments/${route.params.id}/`)
    equipment.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.detail-page {
  padding: 2rem;
}
.back {
  border: none;
  background: none;
  cursor: pointer;
  margin-bottom: 1rem;
}
.detail-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}
</style>

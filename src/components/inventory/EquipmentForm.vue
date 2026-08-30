<script setup>
import { reactive } from 'vue'

const props = defineProps({
  equipment: { type: Object, default: null },
})
const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  name: props.equipment?.name || '',
  brand: props.equipment?.brand || '',
  model: props.equipment?.model || '',
  purchase_price: props.equipment?.purchase_price || '',
  quantity: props.equipment?.quantity || 0,
  description: props.equipment?.description || '',
})

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>

<template>
  <form class="equipment-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>Nom</label>
      <input v-model="form.name" type="text" required />
    </div>
    <div class="form-group">
      <label>Marque</label>
      <input v-model="form.brand" type="text" required />
    </div>
    <div class="form-group">
      <label>Modèle</label>
      <input v-model="form.model" type="text" required />
    </div>
    <div class="form-group">
      <label>Prix d'achat (€)</label>
      <input v-model="form.purchase_price" type="number" step="0.01" min="0" required />
    </div>
    <div class="form-group">
      <label>Quantité</label>
      <input v-model.number="form.quantity" type="number" min="0" required />
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea v-model="form.description"></textarea>
    </div>

    <div class="form-actions">
      <button type="button" @click="$emit('cancel')">Annuler</button>
      <button type="submit" class="btn-primary">Enregistrer</button>
    </div>
  </form>
</template>

<style scoped>
.equipment-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.equipment-form h2 {
  color: var(--color-eni-green);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.4rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

textarea {
  min-height: 100px;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-cherry-red);
  color: white;
}

.btn-cancel {
  background: #ddd;
}
</style>

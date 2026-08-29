<template>
  <form class="equipment-form" @submit.prevent="submitForm">
    <h2>
      {{ equipment ? 'Modifier le matériel' : 'Ajouter un matériel' }}
    </h2>

    <div class="form-group">
      <label>Nom</label>

      <input v-model="form.name" type="text" required placeholder="Ex : Projecteur" />
    </div>

    <div class="form-group">
      <label>Description</label>

      <textarea v-model="form.description" placeholder="Description du matériel"></textarea>
    </div>

    <div class="form-group">
      <label>Quantité</label>

      <input v-model.number="form.quantity" type="number" min="0" required />
    </div>

    <div class="actions">
      <button type="submit" class="btn-primary">
        {{ equipment ? 'Enregistrer' : 'Ajouter' }}
      </button>

      <button type="button" class="btn-cancel" @click="$emit('cancel')">Annuler</button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  equipment: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  name: props.equipment?.name || '',
  description: props.equipment?.description || '',
  quantity: props.equipment?.quantity || 0,
})

const submitForm = () => {
  emit('submit', {
    ...form,
  })
}
</script>

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

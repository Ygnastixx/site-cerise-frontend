<template>
  <div class="equipment-card">
    <div>
      <h3>{{ equipment.name }}</h3>

      <p v-if="equipment.description">
        {{ equipment.description }}
      </p>

      <p>
        <strong>Quantité :</strong>
        {{ equipment.quantity }}
      </p>

      <p>
        <strong>État :</strong>
        {{ equipment.status }}
      </p>
    </div>

    <div class="actions">
      <button class="btn-edit" @click="$emit('edit', equipment)">
        Modifier
      </button>

      <button class="btn-delete" @click="$emit('delete', equipment)">
        Supprimer
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  equipment: {
    type: Object,
    required: true,
  },
});

defineEmits(["edit", "delete"]);
</script>

<style scoped>
.equipment-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.equipment-card h3 {
  color: var(--color-eni-green);
  margin-top: 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

button {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background-color: var(--color-eni-green);
  color: white;
}

.btn-delete {
  background-color: var(--color-cherry-red);
  color: white;
}
</style>
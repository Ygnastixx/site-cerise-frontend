<template>
  <div class="equipment-list">

    <div v-if="loading" class="message">
      Chargement du matériel...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="equipment.length === 0" class="message">
      Aucun matériel disponible.
    </div>

    <EquipmentCard
      v-for="item in equipment"
      :key="item.id"
      :equipment="item"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />

  </div>
</template>

<script setup>
import EquipmentCard from "./EquipmentCard.vue";

defineProps({
  equipment: {
    type: Array,
    default: () => [],
  },

  loading: {
    type: Boolean,
    default: false,
  },

  error: {
    type: String,
    default: "",
  },
});

defineEmits(["edit", "delete"]);
</script>

<style scoped>
.equipment-list {
  width: 100%;
}

.message {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.error {
  padding: 1rem;
  background: #ffe5e5;
  color: var(--color-cherry-red);
  border-radius: 6px;
}
</style>
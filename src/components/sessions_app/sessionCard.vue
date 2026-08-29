<template>
  <div class="session-card">

    <h3>{{ session.title }}</h3>

    <p>
      <strong>Date :</strong>
      {{ session.date }}
    </p>

    <p v-if="session.start_time">
      <strong>Heure :</strong>
      {{ session.start_time }}
    </p>

    <p v-if="session.location">
      <strong>Lieu :</strong>
      {{ session.location }}
    </p>

    <button @click="$emit('view', session)">
      Voir les détails
    </button>

  </div>
</template>

<script setup>
defineProps({
  session: {
    type: Object,
    required: true,
  },
});

defineEmits(["view"]);
</script>

<style scoped>
.session-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}

.session-card h3 {
  color: var(--color-eni-green);
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
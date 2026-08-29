<template>
  <div class="calendar">

    <h2>Calendrier des sessions</h2>

    <div
      v-for="session in sessions"
      :key="session.id"
      class="calendar-item"
    >
      <div class="date">
        {{ session.date }}
      </div>

      <div>
        <strong>{{ session.title }}</strong>

        <p>
          {{ session.start_time || "" }}
          {{ session.location ? " - " + session.location : "" }}
        </p>
      </div>
    </div>

    <p v-if="sessions.length === 0">
      Aucune session.
    </p>

  </div>
</template>

<script setup>
defineProps({
  sessions: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.calendar {
  margin-top: 2rem;
}

.calendar-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.date {
  font-weight: bold;
  color: var(--color-cherry-red);
  min-width: 100px;
}

.calendar-item p {
  margin: 0.3rem 0;
}
</style>
<template>
  <div class="calendar">
    <h2>Calendrier des sessions</h2>

    <div v-for="session in sessions" :key="session.id" class="calendar-item">
      <div class="date">{{ formatSessionDate(session.date) }}</div>

      <div>
        <strong>{{ session.theme }}</strong>
        <p>{{ session.location || '' }}</p>
      </div>
    </div>

    <p v-if="sessions.length === 0">Aucune session.</p>
  </div>
</template>

<script setup>
import { formatSessionDate } from '@/utils/dateFormat'

defineProps({
  sessions: {
    type: Array,
    default: () => [],
  },
})
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
  min-width: 220px;
}
.calendar-item p {
  margin: 0.3rem 0;
}
</style>

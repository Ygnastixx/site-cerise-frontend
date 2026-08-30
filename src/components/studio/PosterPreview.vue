<script setup>
defineProps({
  poster: { type: Object, default: null },
})
</script>

<template>
  <div v-if="poster" class="poster">
    <div class="poster-header">
      <p class="poster-eyebrow">🍒 Club Robotique</p>
      <h1>{{ poster.title }}</h1>
    </div>

    <div class="poster-body">
      <p class="poster-date">{{ poster.date_formatted }}</p>
      <p class="poster-location">📍 {{ poster.location }}</p>

      <div v-if="poster.materials_needed?.length" class="poster-materials">
        <h3>Matériel nécessaire</h3>
        <ul>
          <li v-for="item in poster.materials_needed" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>

    <div class="poster-footer">
      <span>Rejoignez-nous</span>
    </div>
  </div>
</template>

<style scoped>
.poster {
  width: 100%;
  max-width: 420px;
  margin: 1rem auto 0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}
.poster-header {
  background: linear-gradient(160deg, var(--color-eni-green) 0%, #14532d 100%);
  color: white;
  padding: 2rem 1.5rem 1.5rem;
}
.poster-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.85;
  margin: 0 0 0.5rem;
}
.poster-header h1 {
  font-size: 1.7rem;
  line-height: 1.2;
  margin: 0;
}
.poster-body {
  background: #f4f9f6;
  padding: 1.5rem;
}
.poster-date {
  font-weight: 700;
  color: var(--color-cherry-red);
  font-size: 1.05rem;
  margin: 0 0 0.4rem;
  text-transform: capitalize;
}
.poster-location {
  color: #333;
  margin: 0 0 1rem;
}
.poster-materials h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-eni-green);
  margin-bottom: 0.5rem;
}
.poster-materials ul {
  margin: 0;
  padding-left: 1.2rem;
  color: #333;
  font-size: 0.92rem;
}
.poster-footer {
  background: var(--color-cherry-red);
  color: white;
  text-align: center;
  padding: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.85rem;
}
</style>

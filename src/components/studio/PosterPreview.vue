<script setup>
import { ref } from 'vue'
import * as htmlToImage from 'html-to-image'

defineProps({
  poster: { type: Object, default: null },
})

const posterRef = ref(null)

const downloadPoster = async () => {
  if (!posterRef.value) return
  try {
    const dataUrl = await htmlToImage.toPng(posterRef.value, { quality: 0.95 })
    const link = document.createElement('a')
    link.download = `affiche-session.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error("Erreur lors de la génération de l'image:", error)
  }
}

defineExpose({ downloadPoster })
</script>

<template>
  <div v-if="poster" class="poster-container">
    <div ref="posterRef" class="poster">
      <div class="poster-header">
        <span class="badge">🍒 CLUB ROBOTIQUE ENI</span>
        <h1>{{ poster.title }}</h1>
      </div>

      <div class="poster-body">
        <div class="info-block">
          <div class="info-item">
            <span class="icon">📅</span>
            <div>
              <strong>Date & Heure</strong>
              <p class="poster-date">{{ poster.date_formatted }}</p>
            </div>
          </div>

          <div class="info-item">
            <span class="icon">📍</span>
            <div>
              <strong>Lieu</strong>
              <p class="poster-location">{{ poster.location || 'À préciser' }}</p>
            </div>
          </div>
        </div>

        <div v-if="poster.materials_needed?.length" class="poster-materials">
          <h3>Matériel à apporter</h3>
          <ul>
            <li v-for="item in poster.materials_needed" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>

      <div class="poster-footer">
        <span>Venez nombreux · Entrée libre</span>
      </div>
    </div>

    <button class="btn-download" @click="downloadPoster">📥 Télécharger l'affiche (PNG)</button>
  </div>
</template>

<style scoped>
.poster-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.poster {
  width: 100%;
  max-width: 440px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  background: #ffffff;
}

.poster-header {
  background: linear-gradient(135deg, var(--color-eni-green) 0%, #0f3820 100%);
  color: white;
  padding: 2.5rem 2rem 2rem;
  text-align: center;
}

.badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.18);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}

.poster-header h1 {
  font-size: 1.8rem;
  line-height: 1.25;
  margin: 0;
  font-weight: 800;
}

.poster-body {
  padding: 2rem;
  background: #fdfdfd;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.info-item .icon {
  font-size: 1.3rem;
  line-height: 1;
}

.info-item strong {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.poster-date {
  font-weight: 700;
  color: var(--color-cherry-red);
  font-size: 1.05rem;
  margin: 0;
  text-transform: capitalize;
}

.poster-location {
  color: var(--color-text-dark);
  font-weight: 600;
  margin: 0;
}

.poster-materials {
  background: var(--color-bg-subtle);
  border-left: 4px solid var(--color-eni-green);
  padding: 1rem 1.2rem;
  border-radius: 0 8px 8px 0;
}

.poster-materials h3 {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-eni-green);
  margin-bottom: 0.4rem;
}

.poster-materials ul {
  margin: 0;
  padding-left: 1.2rem;
  color: #444;
  font-size: 0.9rem;
}

.poster-footer {
  background: var(--color-cherry-red);
  color: white;
  text-align: center;
  padding: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.btn-download {
  background: var(--color-eni-green);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.btn-download:hover {
  filter: brightness(1.1);
}
</style>

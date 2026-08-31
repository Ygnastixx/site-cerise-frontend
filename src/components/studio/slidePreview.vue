<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import * as htmlToImage from 'html-to-image'
import jsPDF from 'jspdf'

const props = defineProps({
  slide: { type: Object, default: null },
})

const currentIndex = ref(0)
const selectedTheme = ref('eni')

const themes = [
  { id: 'eni', name: 'CERISE' },
  { id: 'corporate', name: 'Corporate (Navy)' },
  { id: 'dark', name: 'Modern Dark' },
  { id: 'pastel', name: 'Pastel' },
]

watch(
  () => props.slide,
  () => {
    currentIndex.value = 0
  },
)

const slides = computed(() => props.slide?.slides || [])
const currentSlide = computed(() => slides.value[currentIndex.value] || null)

const slideRef = ref(null)
const exporting = ref(false)

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}
function next() {
  if (currentIndex.value < slides.value.length - 1) currentIndex.value++
}

async function exportToPdf() {
  if (!slides.value.length || exporting.value) return
  exporting.value = true
  const savedIndex = currentIndex.value

  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [960, 540],
    })

    for (let i = 0; i < slides.value.length; i++) {
      currentIndex.value = i
      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 150))

      const dataUrl = await htmlToImage.toPng(slideRef.value, {
        quality: 0.95,
        pixelRatio: 2,
        width: 960,
        height: 540,
      })

      if (i > 0) pdf.addPage([960, 540], 'landscape')
      pdf.addImage(dataUrl, 'PNG', 0, 0, 960, 540)
    }

    pdf.save(`presentation-${selectedTheme.value}.pdf`)
  } catch (err) {
    console.error("Erreur lors de l'export PDF :", err)
  } finally {
    currentIndex.value = savedIndex
    exporting.value = false
  }
}
</script>

<template>
  <div class="slide-preview">
    <div class="preview-header">
      <h2>Prévisualisation</h2>

      <div v-if="slides.length" class="theme-selector">
        <label for="theme-select">Thème:</label>
        <select id="theme-select" v-model="selectedTheme">
          <option v-for="t in themes" :key="t.id" :value="t.id">
            {{ t.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="!slides.length" class="slide empty">
      <p>Aucune diapositive générée pour l'instant.</p>
    </div>

    <template v-else>
      <!-- Zone d'affichage utilisateur responsive -->
      <div class="preview-viewport">
        <div
          ref="slideRef"
          class="slide"
          :class="[
            currentSlide.type?.toLowerCase(),
            `theme-${selectedTheme}`,
            { 'is-exporting': exporting },
          ]"
        >
          <template v-if="currentSlide.type === 'TITLE_SLIDE'">
            <h1>{{ currentSlide.title }}</h1>
            <p v-if="currentSlide.subtitle" class="subtitle">{{ currentSlide.subtitle }}</p>
          </template>

          <template v-else-if="currentSlide.type === 'IMAGE_LAYOUT'">
            <h2>{{ currentSlide.title }}</h2>
            <img
              v-if="currentSlide.image_url"
              :src="currentSlide.image_url"
              :alt="currentSlide.caption"
              crossorigin="anonymous"
            />
            <p v-if="currentSlide.caption" class="caption">{{ currentSlide.caption }}</p>
          </template>

          <template v-else-if="currentSlide.type === 'CODE_LAYOUT'">
            <h2>{{ currentSlide.title }}</h2>
            <span v-if="currentSlide.language" class="lang-badge">{{ currentSlide.language }}</span>
            <pre class="code"><code>{{ currentSlide.code_content }}</code></pre>
          </template>

          <template v-else-if="currentSlide.type === 'LIST_LAYOUT'">
            <h2>{{ currentSlide.title }}</h2>
            <ul>
              <li v-for="(item, idx) in currentSlide.items || []" :key="idx">{{ item }}</li>
            </ul>
          </template>

          <template v-else-if="currentSlide.type === 'CALLOUT_LAYOUT'">
            <h2>{{ currentSlide.title }}</h2>
            <div class="callout">⚠️ {{ currentSlide.text }}</div>
          </template>

          <template v-else>
            <h2>{{ currentSlide.title }}</h2>
            <p>{{ currentSlide.body }}</p>
          </template>
        </div>
      </div>

      <div class="slide-nav">
        <button type="button" :disabled="currentIndex === 0" @click="prev">← Précédent</button>
        <span>{{ currentIndex + 1 }} / {{ slides.length }}</span>
        <button type="button" :disabled="currentIndex === slides.length - 1" @click="next">
          Suivant →
        </button>
      </div>

      <button type="button" class="btn-export" :disabled="exporting" @click="exportToPdf">
        {{ exporting ? 'Export en cours...' : 'Exporter en PDF' }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.slide-preview {
  margin-top: 2rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.theme-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.theme-selector select {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
}

.preview-viewport {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}

/* La slide a des dimensions fixes natives 960x540 */
.slide {
  width: 960px;
  height: 540px;
  box-sizing: border-box;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  /* Rend la vue responsive à l'écran tout en conservant 960x540 pour htmlToImage */
  transform-origin: top left;
}

/* Neutralisation totale des animations pendant le changement de slide et l'export */
.slide.is-exporting,
.slide.is-exporting * {
  transition: none !important;
  animation: none !important;
}

/* 1. THÈME ENI / CERISE */
.theme-eni {
  background: #ffffff;
  color: #1e293b;
}
.theme-eni h1,
.theme-eni h2 {
  color: var(--color-eni-green, #15803d);
}
.theme-eni.title_slide {
  background: linear-gradient(160deg, var(--color-eni-green, #15803d) 0%, #14532d 100%);
  color: white;
}
.theme-eni.title_slide h1 {
  color: white;
}

/* 2. THÈME CORPORATE */
.theme-corporate {
  background: #f8fafc;
  color: #334155;
}
.theme-corporate h1,
.theme-corporate h2 {
  color: #0f172a;
  font-family: Georgia, serif;
}
.theme-corporate.title_slide {
  background: #0f172a;
  color: #f8fafc;
}
.theme-corporate.title_slide h1 {
  color: #38bdf8;
  font-family: Georgia, serif;
}
.theme-corporate .callout {
  background: #e0f2fe;
  border-left-color: #0284c7;
  color: #0369a1;
}

/* 3. THÈME MODERN DARK */
.theme-dark {
  background: #0f172a;
  color: #cbd5e1;
  border-color: #334155;
}
.theme-dark h1,
.theme-dark h2 {
  color: #38bdf8;
}
.theme-dark.title_slide {
  background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
  color: #f1f5f9;
}
.theme-dark.title_slide h1 {
  color: #a855f7;
}
.theme-dark .code {
  background: #020617;
  border: 1px solid #1e293b;
}
.theme-dark .callout {
  background: #1e293b;
  border-left-color: #f59e0b;
  color: #fbbf24;
}

/* 4. THÈME PLAYFUL PASTEL */
.theme-pastel {
  background: #fff7ed;
  color: #431407;
}
.theme-pastel h1,
.theme-pastel h2 {
  color: #ea580c;
}
.theme-pastel.title_slide {
  background: linear-gradient(135deg, #ff823a 0%, #bc84ee 100%);
  color: white;
}
.theme-pastel.title_slide h1 {
  color: white;
}
.theme-pastel .callout {
  background: #fef3c7;
  border-left-color: #d97706;
  color: #92400e;
}

/* Structuration du contenu */
.slide h1 {
  font-size: 2.8rem;
  margin-bottom: 0.8rem;
}
.slide h2 {
  font-size: 2rem;
  margin-bottom: 1.2rem;
}
.slide p {
  font-size: 1.2rem;
  max-width: 750px;
  line-height: 1.6;
}
.slide ul {
  text-align: left;
  display: inline-block;
  font-size: 1.2rem;
  line-height: 1.8;
}
.slide .code {
  width: 100%;
  max-width: 800px;
  text-align: left;
  padding: 1.2rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 1rem;
}
.slide .callout {
  width: 100%;
  max-width: 800px;
  text-align: left;
  padding: 1.2rem;
  border-left: 5px solid;
  border-radius: 6px;
  font-size: 1.2rem;
}

.slide-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}
.slide-nav button,
.btn-export {
  background: var(--color-eni-green, #15803d);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.btn-export {
  display: block;
  margin: 1rem auto 0;
}
</style>

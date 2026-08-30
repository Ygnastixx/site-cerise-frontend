<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  slide: { type: Object, default: null },
})

const currentIndex = ref(0)
watch(() => props.slide, () => { currentIndex.value = 0 })

const slides = computed(() => props.slide?.slides || [])
const currentSlide = computed(() => slides.value[currentIndex.value] || null)

function prev() { if (currentIndex.value > 0) currentIndex.value-- }
function next() { if (currentIndex.value < slides.value.length - 1) currentIndex.value++ }
</script>

<template>
  <div class="slide-preview">
    <h2>Prévisualisation</h2>

    <div v-if="!slides.length" class="slide empty">
      <p>Aucune diapositive générée pour l'instant.</p>
    </div>

    <template v-else>
      <div class="slide" :class="currentSlide.type?.toLowerCase()">
        <template v-if="currentSlide.type === 'TITLE_SLIDE'">
          <h1>{{ currentSlide.title }}</h1>
          <p v-if="currentSlide.subtitle" class="subtitle">{{ currentSlide.subtitle }}</p>
        </template>

        <template v-else-if="currentSlide.type === 'IMAGE_LAYOUT'">
          <h2>{{ currentSlide.title }}</h2>
          <img v-if="currentSlide.image_url" :src="currentSlide.image_url" :alt="currentSlide.caption" />
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

      <div class="slide-nav">
        <button type="button" :disabled="currentIndex === 0" @click="prev">← Précédent</button>
        <span>{{ currentIndex + 1 }} / {{ slides.length }}</span>
        <button type="button" :disabled="currentIndex === slides.length - 1" @click="next">Suivant →</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.slide-preview { margin-top: 2rem; }
.slide {
  width: 100%; min-height: 350px; background: white; border: 1px solid #ddd;
  border-radius: 8px; padding: 2rem; box-sizing: border-box;
  display: flex; flex-direction: column; justify-content: center;
}
.slide.title_slide {
  background: linear-gradient(160deg, var(--color-eni-green) 0%, #14532d 100%);
  color: white; text-align: center;
}
.slide.title_slide h1 { font-size: 2.2rem; margin-bottom: 0.5rem; }
.slide.title_slide .subtitle { opacity: 0.9; }
.slide h1, .slide h2 { color: var(--color-eni-green); }
.slide.title_slide h1 { color: white; }
.slide img { max-width: 100%; border-radius: 8px; margin: 1rem 0; }
.slide .caption { font-size: 0.85rem; color: #666; text-align: center; }
.slide .code {
  background: #1e1e2e; color: #cdd6f4; padding: 1rem; border-radius: 8px;
  overflow-x: auto; font-family: 'Fira Code', 'Courier New', monospace; font-size: 0.88rem;
}
.slide .lang-badge { align-self: flex-end; font-size: 0.7rem; color: #888; text-transform: uppercase; margin-bottom: 4px; }
.slide .callout { background: #fff7e6; border-left: 4px solid #f0a500; padding: 0.9rem 1.1rem; border-radius: 6px; color: #7a5200; }
.slide.empty { align-items: center; color: #999; }
.slide-nav { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-top: 1rem; }
.slide-nav button { background: var(--color-cherry-red); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }
.slide-nav button:disabled { opacity: 0.4; cursor: not-allowed; }
</style>

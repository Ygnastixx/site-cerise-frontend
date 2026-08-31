<template>
  <div class="template-card">
    <div class="preview" :class="template.layout_type?.toLowerCase()">
      <span class="preview-icon">{{ icon }}</span>
      <span class="preview-label">{{ layoutLabel }}</span>
    </div>

    <h3>{{ template.name }}</h3>
    <p v-if="template.description">{{ template.description }}</p>

    <button @click="$emit('select', template)">Utiliser ce template</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  template: { type: Object, required: true },
})
defineEmits(['select'])

const icons = { POSTER: '🖼️', SLIDE: '📊', DOCUMENT: '📄' }
const labels = { POSTER: 'Affiche', SLIDE: 'Diapositive', DOCUMENT: 'Document' }

const icon = computed(() => icons[props.template.layout_type] || '❔')
const layoutLabel = computed(() => labels[props.template.layout_type] || props.template.layout_type)
</script>

<style scoped>
.template-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}
.preview {
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 6px;
  color: white;
}
.preview.poster {
  background: linear-gradient(160deg, var(--color-cherry-red), #7a1f1f);
}
.preview.slide {
  background: linear-gradient(160deg, var(--color-eni-green), #14532d);
}
.preview.document {
  background: linear-gradient(160deg, #555, #222);
}
.preview-icon {
  font-size: 2.2rem;
}
.preview-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
}
button {
  background: var(--color-cherry-red);
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 0.75rem;
}
</style>

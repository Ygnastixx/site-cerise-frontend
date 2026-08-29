<template>
  <div class="studio-page">
    <header>
      <h1>Studio de présentation</h1>
      <p>Choisissez un template pour créer votre présentation.</p>
    </header>

    <TemplateGallery
      :templates="templates"
      :loading="loading"
      :error="error"
      @select="selectTemplate"
    />

    <SlidePreview v-if="selectedTemplate" :slide="generatedSlide" />

    <div v-if="selectedTemplate" class="generator">
      <h2>Générer une présentation</h2>

      <select v-model="selectedCourseId">
        <option disabled value="">Choisissez un cours</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>

      <button @click="generate" :disabled="!selectedCourseId">Générer les slides</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import TemplateGallery from '../../components/studio/TemplateGallery.vue'
import SlidePreview from '../../components/studio/slidePreview.vue'

import { getTemplates, generateSlides } from '../../services/studioService'
import courseService from '../../services/courseService'

const templates = ref([])
const selectedTemplate = ref(null)

const courses = ref([])
const selectedCourseId = ref(null)

const loading = ref(false)
const error = ref('')

const generatedSlide = ref(null)

const loadTemplates = async () => {
  loading.value = true
  try {
    templates.value = await getTemplates()
  } catch (err) {
    console.error(err)
    error.value = 'Impossible de charger les templates.'
  } finally {
    loading.value = false
  }
}

const loadCourses = async () => {
  try {
    const response = await courseService.getAllCourses()
    courses.value = response.data
  } catch (err) {
    console.error(err)
    error.value = 'Impossible de charger les cours.'
  }
}

const selectTemplate = (template) => {
  selectedTemplate.value = template
}

const generate = async () => {
  if (!selectedCourseId.value) return

  try {
    const result = await generateSlides({ course_id: selectedCourseId.value })
    generatedSlide.value = result
  } catch (err) {
    console.error(err)
    error.value = 'Erreur lors de la génération.'
  }
}

onMounted(() => {
  loadTemplates()
  loadCourses()
})
</script>

<style scoped>
.studio-page {
  padding: 2rem;
}

h1 {
  color: var(--color-eni-green);
}

.generator {
  margin-top: 2rem;
  background: white;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

input,
textarea {
  display: block;
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

textarea {
  min-height: 150px;
}

button {
  background: var(--color-cherry-red);
  color: white;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}
</style>

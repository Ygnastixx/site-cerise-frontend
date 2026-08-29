<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

import TemplateGallery from '../../components/studio/TemplateGallery.vue'
import SlidePreview from '../../components/studio/slidePreview.vue'

import {
  getTemplates,
  generateSlides,
  generatePoster,
  generateSocialPost,
} from '../../services/studioService'
import courseService from '../../services/courseService'
import { getSessions } from '../../services/sessionsService'

const authStore = useAuthStore()

const templates = ref([])
const selectedTemplate = ref(null)

const courses = ref([])
const selectedCourseId = ref(null)

const sessions = ref([])
const selectedSessionIdPoster = ref(null)
const selectedSessionIdSocial = ref(null)

const loading = ref(false)
const error = ref('')
const posterLoading = ref(false)
const socialPostLoading = ref(false)

const generatedSlide = ref(null)
const generatedPoster = ref(null)
const generatedSocialPost = ref(null)

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

const loadSessions = async () => {
  try {
    sessions.value = await getSessions()
  } catch (err) {
    console.error(err)
    error.value = 'Impossible de charger les séances.'
  }
}

const selectTemplate = (template) => {
  selectedTemplate.value = template
}

const generate = async () => {
  if (!selectedCourseId.value) return
  try {
    generatedSlide.value = await generateSlides({ course_id: selectedCourseId.value })
  } catch (err) {
    console.error(err)
    error.value = 'Erreur lors de la génération des slides.'
  }
}

const generateAffiche = async () => {
  if (!selectedSessionIdPoster.value) return
  posterLoading.value = true
  try {
    generatedPoster.value = await generatePoster({
      session_id: selectedSessionIdPoster.value,
      template_id: selectedTemplate.value?.id,
    })
  } catch (err) {
    console.error(err)
    error.value = "Erreur lors de la génération de l'affiche."
  } finally {
    posterLoading.value = false
  }
}

const generatePost = async () => {
  if (!selectedSessionIdSocial.value) return
  socialPostLoading.value = true
  try {
    generatedSocialPost.value = await generateSocialPost({
      session_id: selectedSessionIdSocial.value,
    })
  } catch (err) {
    console.error(err)
    error.value = 'Erreur lors de la génération du post.'
  } finally {
    socialPostLoading.value = false
  }
}

const copyPost = async () => {
  if (!generatedSocialPost.value) return
  try {
    await navigator.clipboard.writeText(generatedSocialPost.value.generated_text)
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  loadTemplates()
  loadCourses()
  if (authStore.isStaffOrAdmin) {
    loadSessions()
  }
})
</script>

<template>
  <div class="studio-page">
    <header>
      <h1>Studio de présentation</h1>
      <p>Choisissez un template, puis générez des slides, une affiche ou un post.</p>
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

    <div v-if="authStore.isStaffOrAdmin" class="generator">
      <h2>Générer une affiche de séance</h2>
      <select v-model="selectedSessionIdPoster">
        <option disabled value="">Choisissez une séance</option>
        <option v-for="session in sessions" :key="session.id" :value="session.id">
          {{ session.theme }} — {{ new Date(session.date).toLocaleDateString('fr-FR') }}
        </option>
      </select>
      <button @click="generateAffiche" :disabled="!selectedSessionIdPoster || posterLoading">
        {{ posterLoading ? 'Génération...' : "Générer l'affiche" }}
      </button>

      <div v-if="generatedPoster" class="poster-preview">
        <h3>{{ generatedPoster.title }}</h3>
        <p>{{ generatedPoster.date_formatted }}</p>
        <p>{{ generatedPoster.location }}</p>
        <p v-if="generatedPoster.materials_needed?.length">
          Matériel : {{ generatedPoster.materials_needed.join(', ') }}
        </p>
      </div>
    </div>

    <div v-if="authStore.isStaffOrAdmin" class="generator">
      <h2>Générer un post réseaux sociaux</h2>
      <select v-model="selectedSessionIdSocial">
        <option disabled value="">Choisissez une séance</option>
        <option v-for="session in sessions" :key="session.id" :value="session.id">
          {{ session.theme }} — {{ new Date(session.date).toLocaleDateString('fr-FR') }}
        </option>
      </select>
      <button @click="generatePost" :disabled="!selectedSessionIdSocial || socialPostLoading">
        {{ socialPostLoading ? 'Génération...' : 'Générer le texte' }}
      </button>

      <div v-if="generatedSocialPost" class="post-preview">
        <span class="badge" :class="generatedSocialPost.source">
          {{ generatedSocialPost.source === 'ai' ? 'Rédigé par IA' : 'Brouillon local' }}
        </span>
        <p class="post-text">{{ generatedSocialPost.generated_text }}</p>
        <button @click="copyPost">Copier</button>
      </div>
    </div>
  </div>
</template>

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
select,
textarea {
  display: block;
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
}
button {
  background: var(--color-cherry-red);
  color: white;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.poster-preview,
.post-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: #f7f7f7;
  border-radius: 6px;
}
.post-text {
  white-space: pre-line;
  margin: 0.75rem 0;
}
.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}
.badge.ai {
  background: #e6f4ea;
  color: var(--color-eni-green);
}
.badge.fallback {
  background: #fff4e5;
  color: #9a6700;
}
</style>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

import SlidePreview from '../../components/studio/slidePreview.vue'
import PosterPreview from '../../components/studio/PosterPreview.vue'

import { generateSlides, generatePoster, generateSocialPost } from '../../services/studioService'
import courseService from '../../services/courseService'
import { getSessions } from '../../services/sessionsService'
import { formatSessionDate } from '../../utils/dateFormat'

const authStore = useAuthStore()

// Gestion de l'outil actif : 'SLIDES' | 'POSTER' | 'SOCIAL'
const activeTool = ref('SLIDES')

const courses = ref([])
const selectedCourseId = ref('')

const sessions = ref([])
const selectedSessionIdPoster = ref('')
const selectedSessionIdSocial = ref('')

const slidesError = ref('')
const posterError = ref('')
const socialError = ref('')

const slidesLoading = ref(false)
const posterLoading = ref(false)
const socialPostLoading = ref(false)

const generatedSlide = ref(null)
const generatedPoster = ref(null)
const generatedSocialPost = ref(null)

const loadCourses = async () => {
  try {
    const response = await courseService.getAllCourses()
    courses.value = response.data
  } catch (err) {
    console.error(err)
    slidesError.value = 'Impossible de charger les cours.'
  }
}

const loadSessions = async () => {
  try {
    sessions.value = await getSessions()
  } catch (err) {
    console.error(err)
  }
}

const generate = async () => {
  if (!selectedCourseId.value) return
  slidesError.value = ''
  slidesLoading.value = true
  try {
    generatedSlide.value = await generateSlides({ course_id: selectedCourseId.value })
  } catch (err) {
    console.error(err)
    slidesError.value = err.response?.data?.detail || 'Erreur lors de la génération des slides.'
  } finally {
    slidesLoading.value = false
  }
}

const generateAffiche = async () => {
  if (!selectedSessionIdPoster.value) return
  posterError.value = ''
  posterLoading.value = true
  try {
    generatedPoster.value = await generatePoster({
      session_id: selectedSessionIdPoster.value,
    })
  } catch (err) {
    console.error(err)
    posterError.value = err.response?.data?.detail || "Erreur lors de la génération de l'affiche."
  } finally {
    posterLoading.value = false
  }
}

const generatePost = async () => {
  if (!selectedSessionIdSocial.value) return
  socialError.value = ''
  socialPostLoading.value = true
  try {
    generatedSocialPost.value = await generateSocialPost({
      session_id: selectedSessionIdSocial.value,
    })
  } catch (err) {
    console.error(err)
    socialError.value = err.response?.data?.detail || 'Erreur lors de la génération du post.'
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
  loadCourses()
  if (authStore.isStaffOrAdmin) {
    loadSessions()
  }
})
</script>

<template>
  <div class="studio-page">
    <header class="studio-header">
      <h1>Studio de création</h1>
      <p>Sélectionnez un outil pour générer vos supports de présentation et de communication.</p>
    </header>

    <!-- Grille des fonctionnalités (Cartes de sélection) -->
    <div class="tools-grid">
      <div
        class="tool-card"
        :class="{ active: activeTool === 'SLIDES' }"
        @click="activeTool = 'SLIDES'"
      >
        <div class="card-icon">📊</div>
        <h3>Diapositives</h3>
        <p>Générez un support de présentation interactif à partir d'un cours.</p>
      </div>

      <div
        v-if="authStore.isStaffOrAdmin"
        class="tool-card"
        :class="{ active: activeTool === 'POSTER' }"
        @click="activeTool = 'POSTER'"
      >
        <div class="card-icon">🖼️</div>
        <h3>Affiche de séance</h3>
        <p>Créez un visuel téléchargeable au format PNG pour une séance du club.</p>
      </div>

      <div
        v-if="authStore.isStaffOrAdmin"
        class="tool-card"
        :class="{ active: activeTool === 'SOCIAL' }"
        @click="activeTool = 'SOCIAL'"
      >
        <div class="card-icon">📱</div>
        <h3>Post Réseaux Sociaux</h3>
        <p>Rédigez automatiquement des textes d'annonce par IA pour vos réseaux.</p>
      </div>
    </div>

    <!-- Zone de travail dynamique selon l'outil sélectionné -->
    <div class="workspace">
      <!-- 1. Générateur de Diapositives -->
      <section v-if="activeTool === 'SLIDES'" class="tool-section">
        <h2>Générer des diapositives</h2>
        <div class="form-group">
          <select v-model="selectedCourseId">
            <option disabled value="">Choisissez un cours</option>
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.title }}
            </option>
          </select>

          <button
            class="btn-primary"
            @click="generate"
            :disabled="!selectedCourseId || slidesLoading"
          >
            {{ slidesLoading ? 'Génération...' : 'Générer les slides' }}
          </button>
        </div>

        <p v-if="slidesError" class="error-message">{{ slidesError }}</p>

        <SlidePreview :slide="generatedSlide" />
      </section>

      <!-- 2. Générateur d'Affiche -->
      <section v-if="activeTool === 'POSTER' && authStore.isStaffOrAdmin" class="tool-section">
        <h2>Générer une affiche de séance</h2>
        <div class="form-group">
          <select v-model="selectedSessionIdPoster">
            <option disabled value="">Choisissez une séance</option>
            <option v-for="session in sessions" :key="session.id" :value="session.id">
              {{ session.theme }} — {{ formatSessionDate(session.date) }}
            </option>
          </select>
          <button
            class="btn-primary"
            @click="generateAffiche"
            :disabled="!selectedSessionIdPoster || posterLoading"
          >
            {{ posterLoading ? 'Génération...' : "Générer l'affiche" }}
          </button>
        </div>

        <p v-if="posterError" class="error-message">{{ posterError }}</p>

        <PosterPreview v-if="generatedPoster" :poster="generatedPoster" />
      </section>

      <!-- 3. Générateur Social Post -->
      <section v-if="activeTool === 'SOCIAL' && authStore.isStaffOrAdmin" class="tool-section">
        <h2>Générer un post réseaux sociaux</h2>
        <div class="form-group">
          <select v-model="selectedSessionIdSocial">
            <option disabled value="">Choisissez une séance</option>
            <option v-for="session in sessions" :key="session.id" :value="session.id">
              {{ session.theme }} — {{ formatSessionDate(session.date) }}
            </option>
          </select>
          <button
            class="btn-primary"
            @click="generatePost"
            :disabled="!selectedSessionIdSocial || socialPostLoading"
          >
            {{ socialPostLoading ? 'Génération...' : 'Générer le texte' }}
          </button>
        </div>

        <p v-if="socialError" class="error-message">{{ socialError }}</p>

        <div v-if="generatedSocialPost" class="post-preview">
          <span class="badge" :class="generatedSocialPost.source">
            {{ generatedSocialPost.source === 'ai' ? 'Rédigé par IA' : 'Brouillon local' }}
          </span>
          <p class="post-text">{{ generatedSocialPost.generated_text }}</p>
          <button class="btn-secondary" @click="copyPost">📋 Copier le texte</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.studio-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.studio-header {
  margin-bottom: 2rem;
}

.studio-header h1 {
  color: var(--color-eni-green, #15803d);
  margin-bottom: 0.5rem;
}

/* Grille de sélection des fonctionnalités */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tool-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tool-card:hover {
  border-color: var(--color-eni-green, #15803d);
  transform: translateY(-2px);
}

.tool-card.active {
  border-color: var(--color-eni-green, #15803d);
  background: #f0fdf4;
  box-shadow: 0 4px 12px rgba(21, 128, 61, 0.1);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.tool-card h3 {
  margin: 0 0 0.5rem 0;
  color: #0f172a;
}

.tool-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.4;
}

/* Zone de travail pour l'outil sélectionné */
.workspace {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.tool-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #0f172a;
}

.form-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  max-width: 600px;
}

select {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
}

.btn-primary {
  background: var(--color-cherry-red, #dc2626);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.error-message {
  color: #a31616;
  background: #fff0f0;
  border: 1px solid #f2c1c1;
  padding: 0.6rem 0.9rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.post-preview {
  margin-top: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.post-text {
  white-space: pre-line;
  margin: 1rem 0;
  font-size: 1rem;
  line-height: 1.5;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge.ai {
  background: #dcfce7;
  color: #15803d;
}

.badge.fallback {
  background: #fef3c7;
  color: #b45309;
}
</style>

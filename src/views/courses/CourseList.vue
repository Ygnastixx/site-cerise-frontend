<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import courseService from '@/services/courseService'

const router = useRouter()

// État des données
const courses = ref([])
const loading = ref(false)
const error = ref('')

// État des filtres locaux
const searchQuery = ref('')
const statusFilter = ref('ALL')

// 1. Chargement des données depuis l'API
async function fetchCourses() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await courseService.getCourses()
    // Si la réponse est paginée (DRF standard), on prend data.results, sinon data
    courses.value = Array.isArray(data) ? data : data.results || []
  } catch (error) {
    error.value = 'Impossible de charger la liste des cours.'
  } finally {
    loading.value = false
  }
}

// 2. Traitement local instantané (Filtre + Recherche)
const filteredCourses = computed(() => {
  return courses.value.filter((course) => {
    // Filtre par recherche textuelle (Titre ou Description)
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (course.description &&
        course.description.toLowerCase().includes(searchQuery.value.toLowerCase()))

    // Filtre par statut (Publié, Brouillon, etc.)
    const matchesStatus = statusFilter.value === 'ALL' || course.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

// Navigation
function goToDetail(id) {
  router.push(`/courses/${id}`)
}

function goToCreate() {
  router.push('/courses/new')
}

// Initialisation unique
onMounted(() => {
  fetchCourses()
})
</script>

<template>
  <div class="courses-container">
    <!-- En-tête avec actions principales -->
    <header class="page-header">
      <div>
        <h1>Catalogue des Cours</h1>
        <p class="subtitle">{{ filteredCourses.length }} cours affiché(s)</p>
      </div>

      <div class="header-actions">
        <!-- Bouton d'actualisation manuelle -->
        <button class="btn-secondary" :disabled="loading" @click="fetchCourses">
          <span v-if="loading">Chargement...</span>
          <span v-else>🔄 Actualiser</span>
        </button>

        <button class="btn-primary" @click="goToCreate">+ Nouveau cours</button>
      </div>
    </header>

    <!-- Barre d'outils (Filtres locaux) -->
    <div class="toolbar">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher par titre ou mot-clé..."
        />
      </div>

      <div class="filter-box">
        <label>Statut :</label>
        <select v-model="statusFilter">
          <option value="ALL">Tous les statuts</option>
          <option value="PUBLISHED">Publié</option>
          <option value="DRAFT">Brouillon</option>
        </select>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="alert-error">{{ error }}</div>

    <!-- Etat de chargement initial -->
    <div v-if="loading && !courses.length" class="loading-state">Chargement du catalogue...</div>

    <!-- Grille/Liste des cours -->
    <div v-else-if="filteredCourses.length" class="courses-grid">
      <article
        v-for="course in filteredCourses"
        :key="course.id"
        class="course-card"
        @click="goToDetail(course.id)"
      >
        <div class="card-header">
          <span class="badge" :class="course.status?.toLowerCase()">
            {{ course.status }}
          </span>
          <small class="date" v-if="course.updated_at">
            Mis à jour le {{ new Date(course.updated_at).toLocaleDateString() }}
          </small>
        </div>

        <h2>{{ course.title }}</h2>
        <p class="description">
          {{ course.description || 'Aucune description disponible.' }}
        </p>

        <div class="card-footer">
          <span class="section-count"> 📚 {{ course.sections?.length || 0 }} section(s) </span>
          <span class="link-action">Consulter →</span>
        </div>
      </article>
    </div>

    <!-- Aucun résultat trouvé -->
    <div v-else class="empty-state">
      <p v-if="searchQuery || statusFilter !== 'ALL'">
        Aucun cours ne correspond à tes critères de recherche.
      </p>
      <p v-else>Aucun cours disponible pour le moment.</p>
    </div>
  </div>
</template>

<style scoped>
.courses-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.subtitle {
  color: #64748b;
  font-size: 0.9rem;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.search-box {
  flex: 1;
}

.search-box input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
}

.filter-box {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.filter-box select {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.course-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 18px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}
.badge.published {
  background: #dcfce7;
  color: #15803d;
}
.badge.draft {
  background: #fef9c3;
  color: #a16207;
}
.badge.archived {
  background: #f1f5f9;
  color: #64748b;
}

.description {
  color: #475569;
  font-size: 0.9rem;
  margin: 8px 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #64748b;
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
}

.btn-primary {
  background: #10b981;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary {
  background: #fff;
  border: 1px solid #cbd5e1;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 40px;
  color: #64748b;
}
</style>

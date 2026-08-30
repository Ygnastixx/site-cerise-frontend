<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import courseService from '@/services/courseService'
import SectionForm from '@/components/sections/editors/SectionForm.vue'

const route = useRoute()
const router = useRouter()
const isEditing = ref(!!route.params.id)

const templates = ref([])
const selectedTemplateId = ref('')

const form = ref({
  title: '',
  description: '',
  status: 'DRAFT',
  is_template: false,
  sections: [],
})

// Section en cours de création dans le modal/bloc
const newSection = ref({
  title: '',
  type: 'TEXT',
  content: {},
})

// Types de sections disponibles (synchronisés avec Django models.py)
const sectionTypes = [
  { value: 'TITLE', label: '📌 Titre / En-tête' },
  { value: 'TEXT', label: '📄 Paragraphe Texte' },
  { value: 'LIST', label: '📋 Liste à puces' },
  { value: 'IMAGE', label: '🖼️ Image avec légende' },
  { value: 'CODE', label: '💻 Extrait de code' },
  { value: 'CALLOUT', label: "⚠️ Encart d'attention" },
]

function addSectionLocal() {
  if (!newSection.value.title) return
  form.value.sections.push({
    tempId: Date.now(),
    title: newSection.value.title,
    type: newSection.value.type,
    content: { ...newSection.value.content },
    order: form.value.sections.length,
    children: [],
  })
  // Réinitialisation
  newSection.value = { title: '', type: 'TEXT', content: {} }
}

function removeSectionLocal(index) {
  form.value.sections.splice(index, 1)
}

// Application d'un modèle pré-existant
async function applyTemplate() {
  if (!selectedTemplateId.value) return
  try {
    const { data } = await courseService.getCourse(selectedTemplateId.value)
    form.value.description = data.description
    // Duplication des sections du modèle avec de nouveaux identifiants locaux
    form.value.sections = (data.sections || []).map((sec, idx) => ({
      tempId: Date.now() + idx,
      title: sec.title,
      type: sec.type,
      content: { ...sec.content },
      order: idx,
      children: sec.children || [],
    }))
  } catch (err) {
    alert('Erreur lors du chargement du modèle.')
  }
}

async function saveCourse() {
  try {
    if (isEditing.value) {
      await courseService.updateCourse(route.params.id, form.value)
    } else {
      await courseService.createCourse(form.value)
    }
    router.push('/courses')
  } catch (err) {
    alert('Erreur lors de la sauvegarde du cours.')
  }
}

onMounted(async () => {
  // Charger la liste des modèles pour le sélecteur
  try {
    const { data } = await courseService.getCourses()
    const allCourses = Array.isArray(data) ? data : data.results || []
    templates.value = allCourses.filter((c) => c.is_template)
  } catch (e) {}

  // Mode Édition
  if (isEditing.value) {
    const { data } = await courseService.getCourse(route.params.id)
    form.value = data
  }
})
</script>

<template>
  <div class="editor-container">
    <header class="editor-header">
      <div>
        <h1>{{ isEditing ? 'Édition du Cours' : "Création d'un Nouveau Cours" }}</h1>
        <p class="subtitle">Assemblez la structure de votre cours avant publication.</p>
      </div>
      <button class="btn-secondary" @click="router.push('/courses')">Annuler</button>
    </header>

    <form @submit.prevent="saveCourse" class="editor-grid">
      <!-- Colonne Principale : Informations & Sections -->
      <main class="main-panel">
        <section class="card">
          <h2>Informations Générales</h2>
          <div class="form-group">
            <label>Titre du cours *</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="ex: Algorithmique Avancée"
              required
            />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Présentation rapide du cours..."
            ></textarea>
          </div>
        </section>

        <!-- Liste des sections en cours -->
        <section class="card">
          <h2>Structure du Cours ({{ form.sections.length }} section(s))</h2>

          <div v-if="!form.sections.length" class="empty-builder">
            Aucune section ajoutée pour l'instant. Utilisez le formulaire ci-dessous.
          </div>

          <div v-else class="sections-list">
            <div
              v-for="(sec, idx) in form.sections"
              :key="sec.id || sec.tempId"
              class="section-item"
            >
              <div class="section-badge">{{ sec.type }}</div>
              <div class="section-info">
                <strong>{{ sec.title }}</strong>
              </div>
              <button type="button" class="btn-icon danger" @click="removeSectionLocal(idx)">
                🗑️
              </button>
            </div>
          </div>
        </section>

        <!-- Formulaire d'ajout de section -->
        <section class="card add-section-card">
          <h2>+ Ajouter une Section</h2>
          <div class="form-group">
            <label>Type de composant</label>
            <select v-model="newSection.type" @change="newSection.content = {}">
              <option v-for="t in sectionTypes" :key="t.value" :value="t.value">
                {{ t.label }}
              </option>
            </select>
          </div>

          <SectionForm v-model="newSection" />

          <button type="button" class="btn-secondary add-btn" @click="addSectionLocal">
            Ajouter cette section au cours
          </button>
        </section>
      </main>

      <!-- Sidebar : Options, Statut et Modèles -->
      <aside class="side-panel">
        <div class="card">
          <h3>Paramètres de Publication</h3>

          <div class="form-group">
            <label>Statut</label>
            <select v-model="form.status">
              <option value="DRAFT">📝 Brouillon</option>
              <option value="PUBLISHED">✅ Publié</option>
              <option value="TRASH">🗑️ Corbeille</option>
            </select>
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="form.is_template" />
              Enregistrer comme modèle
            </label>
            <small>Permettra d'utiliser ce cours comme base pour d'autres contenus.</small>
          </div>

          <button type="submit" class="btn-primary full-width">
            {{ isEditing ? 'Enregistrer les modifications' : 'Créer le cours' }}
          </button>
        </div>

        <!-- Charger depuis un modèle -->
        <div v-if="!isEditing && templates.length" class="card template-card">
          <h3>Charger un Modèle</h3>
          <p class="small-text">Préremplir la structure à partir d'un modèle existant :</p>
          <div class="form-group">
            <select v-model="selectedTemplateId">
              <option value="">-- Choisir un modèle --</option>
              <option v-for="tpl in templates" :key="tpl.id" :value="tpl.id">
                {{ tpl.title }}
              </option>
            </select>
          </div>
          <button
            type="button"
            class="btn-secondary full-width"
            :disabled="!selectedTemplateId"
            @click="applyTemplate"
          >
            Appliquer le modèle
          </button>
        </div>
      </aside>
    </form>
  </div>
</template>

<style scoped>
.editor-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.subtitle {
  color: #64748b;
  font-size: 0.9rem;
}

.editor-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}
@media (max-width: 900px) {
  .editor-grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}
.card h2,
.card h3 {
  font-size: 1.1rem;
  margin-bottom: 16px;
  color: #1e293b;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
.form-group-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.form-group-grid .col-full {
  grid-column: 1 / -1;
}

label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #334155;
}
input,
select,
textarea {
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;
  font-size: 0.92rem;
}
.code-font {
  font-family: monospace;
  background: #0f172a;
  color: #f8fafc;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.checkbox-group small {
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 2px;
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.section-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}
.section-badge {
  font-size: 0.7rem;
  font-weight: 700;
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
}
.section-info {
  flex: 1;
  font-size: 0.9rem;
}

.empty-builder {
  text-align: center;
  padding: 24px;
  color: #94a3b8;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  font-size: 0.9rem;
}

.add-section-card {
  border-top: 3px solid #10b981;
}
.add-btn {
  margin-top: 8px;
  width: 100%;
}

.btn-primary {
  background: #10b981;
  color: #fff;
  border: none;
  padding: 10px 16px;
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
.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}
.full-width {
  width: 100%;
}
</style>

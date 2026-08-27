<script setup>
import { computed, onMounted, ref } from 'vue'
import courseService from '@/services/courseService'

const courses = ref([])
const selected = ref(null)
const sections = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const formError = ref('')
const sectionError = ref('')
const showCourseForm = ref(false)
const showSectionForm = ref(false)
const editingCourse = ref(false)
const editingSection = ref(false)
const search = ref('')
const status = ref('')

const statuses = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PUBLISHED', label: 'Publié' },
  { value: 'TRASH', label: 'Corbeille' },
]
const types = [
  { value: 'TITLE', label: 'Titre' }, { value: 'TEXT', label: 'Texte' },
  { value: 'LIST', label: 'Liste' }, { value: 'IMAGE', label: 'Image' },
  { value: 'CODE', label: 'Code' }, { value: 'VIDEO', label: 'Vidéo' }, { value: 'LINK', label: 'Lien' },
]
const emptyCourse = () => ({ id: null, title: '', description: '', status: 'DRAFT', is_template: false })
const emptySection = () => ({ id: null, parent: null, title: '', type: 'TEXT', text: '', json: '{\n  "text": ""\n}', order: 0 })
const courseForm = ref(emptyCourse())
const sectionForm = ref(emptySection())

const flatSections = computed(() => {
  const out = []
  const walk = (nodes, depth = 0) => (nodes || []).forEach((n) => { out.push({ ...n, depth }); walk(n.children, depth + 1) })
  walk(sections.value)
  return out
})
const parentOptions = computed(() => flatSections.value.filter((s) => s.id !== sectionForm.value.id))
const typeLabel = (v) => types.find((t) => t.value === v)?.label || v
const statusLabel = (v) => statuses.find((s) => s.value === v)?.label || v
const errorMessage = (err, fallback) => {
  const data = err.response?.data
  if (!data) return fallback
  if (data.detail) return data.detail
  const first = Object.values(data)[0]
  return Array.isArray(first) ? first[0] : first || fallback
}

async function load() {
  loading.value = true; error.value = ''
  try {
    const { data } = await courseService.getAllCourses({ search: search.value || undefined, status: status.value || undefined })
    courses.value = data
    if (selected.value) {
      const fresh = data.find((c) => c.id === selected.value.id)
      if (fresh) selected.value = fresh
    }
  } catch (e) { error.value = errorMessage(e, 'Impossible de charger les cours.') }
  finally { loading.value = false }
}
async function openCourse(course) {
  try {
    const { data } = await courseService.getCourse(course.id)
    selected.value = data; sections.value = data.sections || []; sectionForm.value = emptySection(); editingSection.value = false
  } catch (e) { error.value = errorMessage(e, 'Impossible de charger le cours.') }
}
function newCourse() { courseForm.value = emptyCourse(); editingCourse.value = false; formError.value = ''; showCourseForm.value = true }
function editCourse(c) { courseForm.value = { id: c.id, title: c.title, description: c.description || '', status: c.status, is_template: !!c.is_template }; editingCourse.value = true; showCourseForm.value = true }
async function saveCourse() {
  formError.value = ''; if (!courseForm.value.title.trim()) { formError.value = 'Le titre est obligatoire.'; return }
  saving.value = true
  try {
    const payload = { title: courseForm.value.title.trim(), description: courseForm.value.description, status: courseForm.value.status, is_template: courseForm.value.is_template }
    const response = editingCourse.value ? await courseService.updateCourse(courseForm.value.id, payload) : await courseService.createCourse(payload)
    if (editingCourse.value) courses.value = courses.value.map((c) => c.id === response.data.id ? response.data : c)
    else { courses.value.unshift(response.data); await openCourse(response.data) }
    showCourseForm.value = false
  } catch (e) { formError.value = errorMessage(e, 'Enregistrement impossible.') }
  finally { saving.value = false }
}
async function removeCourse(c) {
  if (!confirm(`Supprimer définitivement « ${c.title} » ?`)) return
  try { await courseService.deleteCourse(c.id); courses.value = courses.value.filter((x) => x.id !== c.id); if (selected.value?.id === c.id) { selected.value = null; sections.value = [] } }
  catch (e) { alert(errorMessage(e, 'Suppression impossible.')) }
}
async function action(c, name) {
  try {
    const fn = { publish: courseService.publishCourse, trash: courseService.trashCourse, restore: courseService.restoreCourse }[name]
    const { data } = await fn(c.id)
    courses.value = courses.value.map((x) => x.id === data.id ? data : x)
    if (selected.value?.id === data.id) selected.value = { ...selected.value, ...data }
  } catch (e) { alert(errorMessage(e, 'Action impossible.')) }
}
async function duplicate(c) {
  try { const { data } = await courseService.duplicateCourse(c.id); courses.value.unshift(data); await openCourse(data) }
  catch (e) { alert(errorMessage(e, 'Duplication impossible.')) }
}
function newSection() { sectionForm.value = { ...emptySection(), order: flatSections.value.length }; editingSection.value = false; sectionError.value = ''; showSectionForm.value = true }
function editSection(s) {
  sectionForm.value = { id: s.id, parent: s.parent, title: s.title || '', type: s.type, text: s.content?.text || '', json: JSON.stringify(s.content || {}, null, 2), order: s.order }
  editingSection.value = true; sectionError.value = ''; showSectionForm.value = true
}
function contentPayload() {
  if (sectionForm.value.type === 'TEXT' || sectionForm.value.type === 'TITLE') return { text: sectionForm.value.text }
  if (sectionForm.value.type === 'LIST') return { items: sectionForm.value.text.split('\n').map((x) => x.trim()).filter(Boolean) }
  return JSON.parse(sectionForm.value.json || '{}')
}
async function saveSection() {
  sectionError.value = ''; if (!sectionForm.value.title.trim()) { sectionError.value = 'Le titre est obligatoire.'; return }
  saving.value = true
  try {
    const payload = { course: selected.value.id, parent: sectionForm.value.parent || null, title: sectionForm.value.title.trim(), type: sectionForm.value.type, content: contentPayload(), order: Number(sectionForm.value.order) || 0 }
    if (editingSection.value) await courseService.updateSection(sectionForm.value.id, payload)
    else await courseService.createSection(payload)
    await openCourse(selected.value); showSectionForm.value = false
  } catch (e) { sectionError.value = e instanceof SyntaxError ? 'Le contenu JSON est invalide.' : errorMessage(e, 'Enregistrement impossible.') }
  finally { saving.value = false }
}
async function removeSection(s) {
  if (!confirm(`Supprimer « ${s.title || s.type} » et ses sous-sections ?`)) return
  try { await courseService.deleteSection(s.id); await openCourse(selected.value) }
  catch (e) { alert(errorMessage(e, 'Suppression impossible.')) }
}

onMounted(load)
</script>

<template>
  <div class="course-page">
    <header class="page-header">
      <div><p class="eyebrow">MODULE COURSES</p><h1>Gestion des cours</h1><p class="subtitle">Cours, sections hiérarchiques et publication.</p></div>
      <button class="btn-primary" @click="newCourse">+ Nouveau cours</button>
    </header>

    <div class="toolbar">
      <input v-model="search" @keyup.enter="load" placeholder="Rechercher un cours..." />
      <select v-model="status" @change="load"><option value="">Tous les statuts</option><option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option></select>
      <button class="btn-secondary" @click="load">Actualiser</button>
    </div>
    <div v-if="error" class="alert">{{ error }}</div>
    <div v-if="loading" class="state">Chargement...</div>

    <div v-else class="layout">
      <section class="card">
        <div class="card-title"><h2>Cours</h2><span>{{ courses.length }}</span></div>
        <div v-if="!courses.length" class="empty">Aucun cours.</div>
        <article v-for="c in courses" :key="c.id" class="course-item" :class="{ selected: selected?.id === c.id }" @click="openCourse(c)">
          <h3>{{ c.title }}</h3><p>{{ c.description || 'Aucune description' }}</p>
          <div class="meta"><span class="status">{{ statusLabel(c.status) }}</span><span>{{ c.sections_count || 0 }} section(s)</span><span v-if="c.is_template">Modèle</span></div>
          <div class="actions" @click.stop>
            <button @click="editCourse(c)">Modifier</button><button @click="duplicate(c)">Dupliquer</button>
            <button v-if="c.status !== 'PUBLISHED'" @click="action(c, 'publish')">Publier</button><button v-if="c.status === 'PUBLISHED'" @click="action(c, 'trash')">Corbeille</button><button v-if="c.status === 'TRASH'" @click="action(c, 'restore')">Restaurer</button><button class="danger" @click="removeCourse(c)">Supprimer</button>
          </div>
        </article>
      </section>

      <section class="card editor">
        <template v-if="selected">
          <div class="card-title"><div><p class="eyebrow">COURS #{{ selected.id }}</p><h2>{{ selected.title }}</h2></div><button class="btn-primary" @click="newSection">+ Section</button></div>
          <div class="course-info"><p>{{ selected.description || 'Aucune description.' }}</p><div class="meta"><span class="status">{{ statusLabel(selected.status) }}</span><span>Auteur : {{ selected.author_username || selected.author_matricule }}</span></div></div>
          <div v-if="!flatSections.length" class="empty">Aucune section.</div>
          <article v-for="s in flatSections" :key="s.id" class="section-item">
            <div class="section-row" :style="{ paddingLeft: `${18 + s.depth * 24}px` }"><span>↕</span><div class="section-main"><strong>{{ s.title || '(sans titre)' }}</strong><small>{{ typeLabel(s.type) }} · ordre {{ s.order }}</small></div><div class="actions"><button @click="editSection(s)">Modifier</button><button class="danger" @click="removeSection(s)">Supprimer</button></div></div>
          </article>
        </template>
        <div v-else class="empty large">Sélectionnez un cours.</div>
      </section>
    </div>

    <div v-if="showCourseForm" class="backdrop" @click.self="showCourseForm = false"><div class="modal"><h2>{{ editingCourse ? 'Modifier le cours' : 'Nouveau cours' }}</h2><div v-if="formError" class="alert">{{ formError }}</div><form @submit.prevent="saveCourse"><label>Titre<input v-model="courseForm.title" maxlength="255" /></label><label>Description<textarea v-model="courseForm.description" rows="5" /></label><label>Statut<select v-model="courseForm.status"><option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option></select></label><label class="check"><input type="checkbox" v-model="courseForm.is_template" /> Utiliser comme modèle</label><div class="form-actions"><button type="button" class="btn-secondary" @click="showCourseForm=false">Annuler</button><button class="btn-primary" :disabled="saving">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button></div></form></div></div>

    <div v-if="showSectionForm" class="backdrop" @click.self="showSectionForm = false"><div class="modal wide"><h2>{{ editingSection ? 'Modifier la section' : 'Nouvelle section' }}</h2><div v-if="sectionError" class="alert">{{ sectionError }}</div><form @submit.prevent="saveSection"><label>Titre<input v-model="sectionForm.title" maxlength="255" /></label><div class="two"><label>Type<select v-model="sectionForm.type"><option v-for="t in types" :key="t.value" :value="t.value">{{ t.label }}</option></select></label><label>Ordre<input type="number" min="0" v-model.number="sectionForm.order" /></label></div><label>Section parente<select v-model="sectionForm.parent"><option :value="null">Aucune — racine</option><option v-for="p in parentOptions" :key="p.id" :value="p.id">{{ '— '.repeat(p.depth) }}{{ p.title || p.type }}</option></select></label><label v-if="sectionForm.type==='TEXT'||sectionForm.type==='TITLE'">Texte<textarea v-model="sectionForm.text" rows="8" /></label><label v-else-if="sectionForm.type==='LIST'">Un élément par ligne<textarea v-model="sectionForm.text" rows="8" /></label><label v-else>Contenu JSON<textarea v-model="sectionForm.json" rows="12" spellcheck="false" /></label><div class="form-actions"><button type="button" class="btn-secondary" @click="showSectionForm=false">Annuler</button><button class="btn-primary" :disabled="saving">{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</button></div></form></div></div>
  </div>
</template>

<style scoped>
.course-page{max-width:1500px;margin:auto;padding:28px}.page-header,.toolbar,.card-title,.meta,.form-actions,.two,.section-row{display:flex;align-items:center}.page-header{justify-content:space-between;gap:20px;margin-bottom:20px}.eyebrow{color:var(--color-cherry-red);font-size:.75rem;font-weight:800;letter-spacing:.08em}h1{font-size:2rem;margin:3px 0}.subtitle{color:var(--color-text-muted)}.toolbar{gap:10px;margin-bottom:18px}.toolbar input{flex:1}input,select,textarea{width:100%;border:1px solid #d8dde3;border-radius:8px;padding:10px 12px;background:#fff;font:inherit}button{border:0;border-radius:7px;padding:9px 12px}.btn-primary{background:var(--color-eni-green);color:#fff}.btn-secondary{background:#eef1f3}.layout{display:grid;grid-template-columns:minmax(350px,.85fr) minmax(500px,1.4fr);gap:18px;align-items:start}.card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.04);overflow:hidden}.card-title{justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid #edf0f2}.card-title>span{background:#f0f2f4;padding:3px 9px;border-radius:99px}.course-item{padding:16px 18px;border-bottom:1px solid #edf0f2;cursor:pointer}.course-item:hover,.course-item.selected{background:#f8faf9}.course-item p{color:var(--color-text-muted);font-size:.9rem;margin:4px 0 9px}.meta{gap:8px;flex-wrap:wrap;color:var(--color-text-muted);font-size:.78rem}.status{border-radius:99px;padding:3px 8px;font-weight:700;background:#eef1f3}.actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.actions button{background:#eef1f3;font-size:.76rem}.actions .danger{background:#fbe1e1;color:#9b111e}.editor{min-height:400px}.course-info{padding:18px 20px;border-bottom:1px solid #edf0f2}.section-item{border-bottom:1px solid #edf0f2}.section-row{min-height:64px;gap:10px;padding-top:10px;padding-bottom:10px;padding-right:18px}.section-main{flex:1}.section-main small{display:block;color:var(--color-text-muted)}.empty,.state{text-align:center;padding:30px;color:var(--color-text-muted)}.large{min-height:300px;display:grid;place-items:center}.alert{padding:11px 14px;border-radius:8px;margin-bottom:14px;background:#fff0f0;color:#a31616;border:1px solid #f2c1c1}.backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);display:grid;place-items:center;padding:20px;z-index:50}.modal{width:min(600px,100%);max-height:90vh;overflow:auto;background:#fff;border-radius:12px;padding:22px}.modal.wide{width:min(780px,100%)}.modal form{display:grid;gap:14px;margin-top:18px}.modal label{display:grid;gap:6px;font-weight:600}.check{display:flex!important;align-items:center}.check input{width:auto}.two{gap:12px}.two>*{flex:1}@media(max-width:950px){.layout{grid-template-columns:1fr}.page-header{align-items:flex-start;flex-direction:column}}@media(max-width:600px){.course-page{padding:14px}.toolbar,.two{flex-direction:column;align-items:stretch}}
</style>

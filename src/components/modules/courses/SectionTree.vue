<script setup>
defineProps({
  selectedCourse: Object,
  sections: Array,
})

defineEmits(['new-section', 'edit-section', 'remove-section'])

const types = [
  { value: 'TITLE', label: 'Titre' },
  { value: 'TEXT', label: 'Texte' },
  { value: 'LIST', label: 'Liste' },
  { value: 'IMAGE', label: 'Image' },
  { value: 'CODE', label: 'Code' },
  { value: 'VIDEO', label: 'Vidéo' },
  { value: 'LINK', label: 'Lien' },
]
const statuses = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PUBLISHED', label: 'Publié' },
  { value: 'TRASH', label: 'Corbeille' },
]

const typeLabel = (v) => types.find((t) => t.value === v)?.label || v
const statusLabel = (v) => statuses.find((s) => s.value === v)?.label || v
</script>

<template>
  <section class="card editor">
    <template v-if="selectedCourse">
      <div class="card-title">
        <div>
          <p class="eyebrow">COURS #{{ selectedCourse.id }}</p>
          <h2>{{ selectedCourse.title }}</h2>
        </div>
        <button class="btn-primary" @click="$emit('new-section')">+ Section</button>
      </div>

      <div class="course-info">
        <p>{{ selectedCourse.description || 'Aucune description.' }}</p>
        <div class="meta">
          <span class="status">{{ statusLabel(selectedCourse.status) }}</span>
          <span
            >Auteur : {{ selectedCourse.author_username || selectedCourse.author_matricule }}</span
          >
        </div>
      </div>

      <div v-if="!sections.length" class="empty">Aucune section.</div>

      <article v-for="s in sections" :key="s.id" class="section-item">
        <div class="section-row" :style="{ paddingLeft: `${18 + s.depth * 24}px` }">
          <span>↕</span>
          <div class="section-main">
            <strong>{{ s.title || '(sans titre)' }}</strong>
            <small>{{ typeLabel(s.type) }} · ordre {{ s.order }}</small>
          </div>
          <div class="actions">
            <button @click="$emit('edit-section', s)">Modifier</button>
            <button class="danger" @click="$emit('remove-section', s)">Supprimer</button>
          </div>
        </div>
      </article>
    </template>

    <div v-else class="empty large">Sélectionnez un cours.</div>
  </section>
</template>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.editor {
  min-height: 400px;
}
.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  border-bottom: 1px solid #edf0f2;
}
.eyebrow {
  color: var(--color-cherry-red);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}
.course-info {
  padding: 18px 20px;
  border-bottom: 1px solid #edf0f2;
}
.course-info p {
  margin-bottom: 8px;
}
.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-muted);
  font-size: 0.78rem;
}
.status {
  border-radius: 99px;
  padding: 3px 8px;
  font-weight: 700;
  background: #eef1f3;
}
.section-item {
  border-bottom: 1px solid #edf0f2;
}
.section-row {
  display: flex;
  align-items: center;
  min-height: 64px;
  gap: 10px;
  padding: 10px 18px 10px 18px;
}
.section-main {
  flex: 1;
}
.section-main small {
  display: block;
  color: var(--color-text-muted);
}
.actions {
  display: flex;
  gap: 6px;
}
.actions button {
  background: #eef1f3;
  font-size: 0.76rem;
  border: 0;
  border-radius: 7px;
  padding: 6px 10px;
  cursor: pointer;
}
.actions .danger {
  background: #fbe1e1;
  color: #9b111e;
}
.btn-primary {
  background: var(--color-eni-green);
  color: #fff;
  border: 0;
  border-radius: 7px;
  padding: 9px 12px;
  cursor: pointer;
}
.empty {
  text-align: center;
  padding: 30px;
  color: var(--color-text-muted);
}
.large {
  min-height: 300px;
  display: grid;
  place-items: center;
}
</style>

<script setup>
defineProps({
  course: Object,
  isSelected: Boolean,
})

defineEmits(['select', 'edit', 'duplicate', 'publish', 'trash', 'restore', 'remove'])

const statusLabel = (v) => {
  const map = { DRAFT: 'Brouillon', PUBLISHED: 'Publié', TRASH: 'Corbeille' }
  return map[v] || v
}
</script>

<template>
  <article class="course-item" :class="{ selected: isSelected }" @click="$emit('select', course)">
    <h3>{{ course.title }}</h3>
    <p>{{ course.description || 'Aucune description' }}</p>

    <div class="meta">
      <span class="status">{{ statusLabel(course.status) }}</span>
      <span>{{ course.sections_count || 0 }} section(s)</span>
      <span v-if="course.is_template">Modèle</span>
    </div>

    <div class="actions" @click.stop>
      <button @click="$emit('edit', course)">Modifier</button>
      <button @click="$emit('duplicate', course)">Dupliquer</button>
      <button v-if="course.status !== 'PUBLISHED'" @click="$emit('publish', course)">
        Publier
      </button>
      <button v-if="course.status === 'PUBLISHED'" @click="$emit('trash', course)">
        Corbeille
      </button>
      <button v-if="course.status === 'TRASH'" @click="$emit('restore', course)">Restaurer</button>
      <button class="danger" @click="$emit('remove', course)">Supprimer</button>
    </div>
  </article>
</template>

<style scoped>
.course-item {
  padding: 16px 18px;
  border-bottom: 1px solid #edf0f2;
  cursor: pointer;
}
.course-item:hover,
.course-item.selected {
  background: #f8faf9;
}
.course-item h3 {
  font-size: 1.05rem;
  font-weight: 600;
}
.course-item p {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin: 4px 0 9px;
}
.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: var(--color-text-muted);
  font-size: 0.78rem;
}
.status {
  border-radius: 99px;
  padding: 3px 8px;
  font-weight: 700;
  background: #eef1f3;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
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
</style>

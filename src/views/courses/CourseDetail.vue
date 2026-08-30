<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import courseService from '@/services/courseService'
import SectionRenderer from '@/components/sections/SectionRenderer.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const course = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await courseService.getCourse(route.params.id)
    course.value = data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="course-detail-container">
    <div v-if="loading" class="state-card">Chargement de la leçon...</div>

    <article v-else-if="course" class="course-card">
      <header class="course-header">
        <div>
          <span class="badge">COURS & LEÇONS</span>
          <h1>{{ course.title }}</h1>
          <p class="description">{{ course.description }}</p>
        </div>
        <RouterLink
          v-if="authStore.isStaffOrAdmin"
          :to="`/courses/${course.id}/edit`"
          class="btn-edit"
        >
          ✏️ Modifier
        </RouterLink>
      </header>

      <hr class="separator" />

      <main class="course-body">
        <SectionRenderer v-for="section in course.sections" :key="section.id" :section="section" />
      </main>
    </article>
  </div>
</template>

<style scoped>
.course-detail-container {
  max-width: 860px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.state-card {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  color: var(--color-text-muted);
}

.course-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  padding: 2.5rem 3rem;
  border: 1px solid var(--color-border);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.badge {
  display: inline-block;
  background: var(--color-bg-subtle);
  color: var(--color-eni-green);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

h1 {
  font-size: 2.1rem;
  color: var(--color-text-dark);
  line-height: 1.25;
}

.description {
  font-size: 1.05rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}

.btn-edit {
  background: var(--color-cherry-red);
  color: white;
  padding: 0.6rem 1.1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: background 0.2s ease;
}

.btn-edit:hover {
  background: var(--color-cherry-red-hover);
}

.separator {
  border: 0;
  height: 1px;
  background: var(--color-border);
  margin: 2rem 0;
}

.course-body {
  font-size: 1rem;
  line-height: 1.7;
}
</style>

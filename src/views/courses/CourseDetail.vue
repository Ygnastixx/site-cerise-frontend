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
  <div v-if="loading" class="state">Chargement du cours...</div>
  <div v-else-if="course" class="course-detail">
    <header>
      <div>
        <h1>{{ course.title }}</h1>
        <p class="description">{{ course.description }}</p>
      </div>
      <RouterLink
        v-if="authStore.isStaffOrAdmin"
        :to="`/courses/${course.id}/edit`"
        class="btn-edit"
      >
        Modifier
      </RouterLink>
    </header>
    <hr />
    <main>
      <SectionRenderer v-for="section in course.sections" :key="section.id" :section="section" />
    </main>
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}
.btn-edit {
  background: var(--color-cherry-red);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
}
</style>

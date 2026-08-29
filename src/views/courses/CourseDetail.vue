<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import courseService from '@/services/courseService'
import SectionRenderer from '@/components/sections/SectionRenderer.vue'

const route = useRoute()
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
      <h1>{{ course.title }}</h1>
      <p class="description">{{ course.description }}</p>
    </header>
    <hr />
    <main>
      <SectionRenderer v-for="section in course.sections" :key="section.id" :section="section" />
    </main>
  </div>
</template>

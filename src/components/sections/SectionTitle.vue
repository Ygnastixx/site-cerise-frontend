<script setup>
defineProps({
  title: String,
  content: Object,
})
</script>

<template>
  <component :is="content?.level || 'h2'" class="section-title">{{ title }}</component>
</template>

<style scoped>
.section-title {
  color: #1e293b;
  margin: 1.5rem 0 0.75rem;
}
</style>

<script setup>
defineProps({ content: Object })
</script>

<template>
  <ul class="section-list">
    <li v-for="(item, idx) in content?.items || []" :key="idx">{{ item }}</li>
  </ul>
</template>

<style scoped>
.section-list {
  padding-left: 1.4rem;
  line-height: 1.6;
}
</style>

<script setup>
defineProps({ content: Object })
</script>

<template>
  <div class="section-callout">⚠️ {{ content?.text }}</div>
</template>

<style scoped>
.section-callout {
  background: #fff7e6;
  border-left: 4px solid #f0a500;
  padding: 0.9rem 1.1rem;
  border-radius: 6px;
  color: #7a5200;
}
</style>

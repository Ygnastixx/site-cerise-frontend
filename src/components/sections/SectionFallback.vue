<script setup>
defineProps({ type: String, content: Object })
</script>

<template>
  <div class="section-fallback">
    <small
      >Type de section : <strong>{{ type }}</strong></small
    >
    <pre>{{ JSON.stringify(content, null, 2) }}</pre>
  </div>
</template>

<style scoped>
.section-fallback {
  background: #f4f5f7;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #ccc;
}
pre {
  margin-top: 6px;
  font-size: 0.82rem;
  overflow-x: auto;
}
</style>

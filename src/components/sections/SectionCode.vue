<script setup>
defineProps({ content: Object })
</script>

<template>
  <div class="section-code-block">
    <span v-if="content?.language" class="lang-badge">{{ content.language }}</span>
    <pre class="section-code"><code>{{ content?.code }}</code></pre>
  </div>
</template>

<style scoped>
.section-code-block {
  position: relative;
}
.lang-badge {
  position: absolute;
  top: 6px;
  right: 10px;
  font-size: 0.7rem;
  color: #a6adc8;
  text-transform: uppercase;
}
.section-code {
  background: #1e1e2e;
  color: #cdd6f4;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.88rem;
  line-height: 1.5;
}
</style>

<script setup>
defineProps({ content: Object })
</script>

<template>
  <div class="section-text">
    <p>{{ content?.text }}</p>
  </div>
</template>

<script setup>
defineProps({ content: Object })
</script>

<template>
  <figure class="section-image">
    <img :src="content?.url" :alt="content?.caption || 'Illustration'" />
    <figcaption v-if="content?.caption">{{ content.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.section-image {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centre l'image ET la légende sur l'axe horizontal */
  margin: 1.5rem 0;
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

figcaption {
  font-size: 0.85rem;
  color: #666;
  text-align: center;
  margin-top: 8px;
}
</style>

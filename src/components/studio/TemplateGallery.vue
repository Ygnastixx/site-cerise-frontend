<template>
  <div>

    <div v-if="loading">
      Chargement des templates...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="gallery">

      <TemplateCard
        v-for="template in templates"
        :key="template.id"
        :template="template"
        @select="$emit('select', $event)"
      />

    </div>

  </div>
</template>

<script setup>
import TemplateCard from "./TemplateCard.vue";

defineProps({
  templates: {
    type: Array,
    default: () => [],
  },

  loading: {
    type: Boolean,
    default: false,
  },

  error: {
    type: String,
    default: "",
  },
});

defineEmits(["select"]);
</script>

<style scoped>
.gallery {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(250px, 1fr)
  );

  gap: 1.5rem;
}

.error {
  color: var(--color-cherry-red);
}
</style>
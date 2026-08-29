<template>
  <div class="template-card">

    <div class="preview">
      <img
        v-if="template.preview_url"
        :src="template.preview_url"
        :alt="template.name"
      />

      <div v-else>
        Aperçu
      </div>
    </div>

    <h3>{{ template.name }}</h3>

    <p v-if="template.description">
      {{ template.description }}
    </p>

    <button @click="$emit('select', template)">
      Utiliser ce template
    </button>

  </div>
</template>

<script setup>
defineProps({
  template: {
    type: Object,
    required: true,
  },
});

defineEmits(["select"]);
</script>

<style scoped>
.template-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}

.preview {
  height: 150px;
  background: #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

button {
  background: var(--color-cherry-red);
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}
</style>
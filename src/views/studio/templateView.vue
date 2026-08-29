<template>
  <div class="template-page">

    <button @click="$router.back()">
      ← Retour
    </button>

    <h1>Template</h1>

    <div v-if="template">
      <h2>{{ template.name }}</h2>

      <p>
        {{ template.description }}
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

const template = ref(null);
</script>

<style scoped>
.template-page {
  padding: 2rem;
}
</style>
<template>
  <div class="slide-preview">

    <h2>Prévisualisation</h2>

    <div class="slide">

      <h1>
        {{ slide?.title || "Titre de la présentation" }}
      </h1>

      <p>
        {{ slide?.content || "Contenu de la présentation" }}
      </p>

    </div>

  </div>
</template>

<script setup>
defineProps({
  slide: {
    type: Object,
    default: null,
  },
});
</script>

<style scoped>
.slide-preview {
  margin-top: 2rem;
}

.slide {
  width: 100%;
  min-height: 350px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 2rem;
  box-sizing: border-box;
}

.slide h1 {
  color: var(--color-eni-green);
}
</style>
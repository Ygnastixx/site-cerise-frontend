<script setup>
import { computed } from 'vue'
import SectionText from './SectionText.vue'
import SectionImage from './SectionImage.vue'
import SectionFallback from './SectionFallback.vue'

const props = defineProps({
  section: { type: Object, required: true },
})

const componentsMap = {
  TEXT: SectionText,
  TITLE: SectionText,
  IMAGE: SectionImage,
}

const activeComponent = computed(() => componentsMap[props.section.type] || SectionFallback)
</script>

<template>
  <div class="section-wrapper" :style="{ paddingLeft: `${section.depth * 20}px` }">
    <h3 v-if="section.title">{{ section.title }}</h3>
    <component :is="activeComponent" :type="section.type" :content="section.content" />

    <!-- Rendu récursif des enfants -->
    <template v-if="section.children && section.children.length">
      <SectionRenderer
        v-for="child in section.children"
        :key="child.id || child.tempId"
        :section="child"
      />
    </template>
  </div>
</template>

<style scoped>
.section-wrapper {
  margin-bottom: 18px;
}
h3 {
  font-size: 1.2rem;
  margin-bottom: 6px;
  color: #1e293b;
}
</style>

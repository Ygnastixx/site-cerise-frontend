<script setup>
import { computed } from 'vue'
import SectionText from './SectionText.vue'
import SectionTitle from './SectionTitle.vue'
import SectionImage from './SectionImage.vue'
import SectionList from './SectionList.vue'
import SectionCode from './SectionCode.vue'
import SectionCallout from './SectionCallout.vue'
import SectionFallback from './SectionFallback.vue'

const props = defineProps({
  section: { type: Object, required: true },
})

const componentsMap = {
  TEXT: SectionText,
  TITLE: SectionTitle,
  IMAGE: SectionImage,
  LIST: SectionList,
  CODE: SectionCode,
  CALLOUT: SectionCallout,
}

const activeComponent = computed(() => componentsMap[props.section.type] || SectionFallback)

// Seule une section TITLE a besoin de son .title comme contenu affiché
const extraProps = computed(() =>
  props.section.type === 'TITLE' ? { title: props.section.title } : {},
)
</script>

<template>
  <div
    class="section-wrapper"
    :class="{ 'is-nested': section.depth > 0 }"
    :style="{ '--depth-offset': `${section.depth * 1.25}rem` }"
  >
    <component
      :is="activeComponent"
      :type="section.type"
      :content="section.content"
      v-bind="extraProps"
    />

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

.is-nested {
  margin-left: var(--depth-offset, 1.25rem);
  padding-left: 1rem;
  border-left: 2px solid var(--color-border);
}
</style>

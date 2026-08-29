<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue'])

const localSection = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function updateContent(field, val) {
  localSection.value.content = {
    ...localSection.value.content,
    [field]: val,
  }
}
</script>

<template>
  <div class="section-form-body">
    <div class="form-group">
      <label>Titre de la section</label>
      <input
        v-model="localSection.title"
        type="text"
        placeholder="ex: Introduction au HTML"
        required
      />
    </div>

    <!-- Champs selon le type -->
    <div v-if="localSection.type === 'TITLE'" class="form-group">
      <label>Niveau de titre</label>
      <select
        :value="localSection.content.level || 'h2'"
        @change="updateContent('level', $event.target.value)"
      >
        <option value="h1">Titre principal (H1)</option>
        <option value="h2">Sous-titre (H2)</option>
        <option value="h3">Titre de section (H3)</option>
      </select>
    </div>

    <div v-else-if="localSection.type === 'TEXT'" class="form-group">
      <label>Contenu du paragraphe</label>
      <textarea
        :value="localSection.content.text || ''"
        rows="4"
        placeholder="Rédigez le texte ici..."
        @input="updateContent('text', $event.target.value)"
      ></textarea>
    </div>

    <div v-else-if="localSection.type === 'LIST'" class="form-group">
      <label>Éléments de la liste (un par ligne)</label>
      <textarea
        :value="(localSection.content.items || []).join('\n')"
        rows="4"
        placeholder="Premier point&#10;Deuxième point"
        @input="updateContent('items', $event.target.value.split('\n'))"
      ></textarea>
    </div>

    <div v-else-if="localSection.type === 'IMAGE'" class="form-group-grid">
      <div class="form-group">
        <label>URL de l'image</label>
        <input
          :value="localSection.content.url || ''"
          type="url"
          placeholder="https://..."
          @input="updateContent('url', $event.target.value)"
        />
      </div>
      <div class="form-group">
        <label>Légende</label>
        <input
          :value="localSection.content.caption || ''"
          type="text"
          placeholder="Description de l'image"
          @input="updateContent('caption', $event.target.value)"
        />
      </div>
    </div>

    <div v-else-if="localSection.type === 'CODE'" class="form-group-grid">
      <div class="form-group">
        <label>Langage</label>
        <input
          :value="localSection.content.language || 'python'"
          type="text"
          placeholder="python, javascript, html..."
          @input="updateContent('language', $event.target.value)"
        />
      </div>
      <div class="form-group col-full">
        <label>Code source</label>
        <textarea
          :value="localSection.content.code || ''"
          rows="5"
          class="code-font"
          @input="updateContent('code', $event.target.value)"
        ></textarea>
      </div>
    </div>

    <div v-else-if="localSection.type === 'CALLOUT'" class="form-group-grid">
      <div class="form-group">
        <label>Style de l'encart</label>
        <select
          :value="localSection.content.variant || 'info'"
          @change="updateContent('variant', $event.target.value)"
        >
          <option value="info">Information (Bleu)</option>
          <option value="warning">Avertissement (Jaune)</option>
          <option value="danger">Important (Rouge)</option>
        </select>
      </div>
      <div class="form-group col-full">
        <label>Message</label>
        <textarea
          :value="localSection.content.message || ''"
          rows="3"
          @input="updateContent('message', $event.target.value)"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ref } from 'vue'
import api from '@/services/api'

const uploading = ref(false)
const uploadError = ref('')

async function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''
  try {
    const formData = new FormData()
    formData.append('image', file)
    const { data } = await api.post('/courses/sections/upload-image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    updateContent('url', data.url)
  } catch (err) {
    console.error(err)
    uploadError.value = "Échec de l'envoi de l'image."
  } finally {
    uploading.value = false
  }
}

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
      <div class="form-group col-full">
        <label>Image</label>
        <input type="file" accept="image/*" @change="handleImageUpload" />
        <small v-if="uploading">Envoi en cours...</small>
        <small v-if="uploadError" class="upload-error">{{ uploadError }}</small>
        <img v-if="localSection.content.url" :src="localSection.content.url" class="image-preview" />
      </div>
      <div class="form-group col-full">
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

    <div v-else-if="localSection.type === 'CALLOUT'" class="form-group">
      <label>Message de l'encart</label>
      <textarea
        :value="localSection.content.text || ''"
        rows="3"
        placeholder="Message à mettre en avant..."
        @input="updateContent('text', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>

<style scoped>
.section-form-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.col-full {
  grid-column: 1 / -1;
}

.image-preview {
  max-width: 200px;
  margin-top: 8px;
  border-radius: 6px;
}
.upload-error {
  color: #c0392b;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #1f2937;
  background-color: #fafafa;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-cherry-red, #c0392b);
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.15);
  background-color: #ffffff;
}

textarea.code-font {
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  background-color: #1e1e2e;
  color: #a6adc8;
  border-color: #313244;
  line-height: 1.4;
}

textarea.code-font:focus {
  background-color: #1e1e2e;
  color: #cdd6f4;
}
</style>

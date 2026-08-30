<template>
  <form class="session-form-card" @submit.prevent="submit">
    <div class="form-header">
      <h2>📅 Nouvelle Session</h2>
      <p>Organisez une nouvelle rencontre ou un atelier pour le club.</p>
    </div>

    <div class="form-grid">
      <div class="form-group col-full">
        <label>Thème de la session</label>
        <input
          v-model="form.theme"
          type="text"
          placeholder="ex: Atelier Robotique & Arduino"
          required
        />
      </div>

      <div class="form-group">
        <label>Date et heure</label>
        <input v-model="form.date" type="datetime-local" required />
      </div>

      <div class="form-group">
        <label>Lieu / Salle</label>
        <input v-model="form.location" type="text" placeholder="ex: Labo ENI / Salle 102" />
      </div>

      <div class="form-group col-full">
        <label>Cours associé</label>
        <select v-model="form.course_id">
          <option :value="null">-- Aucun cours associé --</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.title }}
          </option>
        </select>
      </div>

      <div class="form-group col-full">
        <label>Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="Précisez le programme ou les objectifs de la séance..."
        ></textarea>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-cancel" @click="$emit('cancel')">Annuler</button>
      <button type="submit" class="btn-submit">Créer la session</button>
    </div>
  </form>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import courseService from '@/services/courseService'

const emit = defineEmits(['submit', 'cancel'])
const courses = ref([])

const form = reactive({
  theme: '',
  date: '',
  location: '',
  description: '',
  course_id: null,
})

const submit = () => {
  emit('submit', {
    ...form,
    date: form.date ? new Date(form.date).toISOString() : '',
  })
}

onMounted(async () => {
  try {
    const { data } = await courseService.getAllCourses()
    courses.value = Array.isArray(data) ? data : data.results || []
  } catch (err) {
    console.error(err)
  }
})
</script>

<style scoped>
.session-form-card {
  background: white;
  padding: 2rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
}

.form-header h2 {
  color: var(--color-eni-green);
  font-size: 1.35rem;
  margin-bottom: 0.25rem;
}

.form-header p {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.col-full {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: var(--color-text-dark);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

button {
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
}

.btn-submit {
  background: var(--color-cherry-red);
  color: white;
}

.btn-submit:hover {
  background: var(--color-cherry-red-hover);
}

.btn-cancel {
  background: var(--color-bg-subtle);
  color: var(--color-text-muted);
}

.btn-cancel:hover {
  background: #e5e7eb;
}
</style>

<template>
  <form class="session-form" @submit.prevent="submit">
    <h2>Nouvelle session</h2>

    <div>
      <label>Thème</label>
      <input v-model="form.theme" type="text" required />
    </div>

    <div>
      <label>Date et heure</label>
      <input v-model="form.date" type="datetime-local" required />
    </div>

    <div>
      <label>Lieu</label>
      <input v-model="form.location" type="text" />
    </div>

    <div>
      <label>Description</label>
      <textarea v-model="form.description" rows="3"></textarea>
    </div>

    <div>
      <label>Cours associé</label>
      <select v-model="form.course_id">
        <option :value="null">Aucun</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>
    </div>

    <button type="submit">Créer la session</button>
    <button type="button" class="cancel" @click="$emit('cancel')">Annuler</button>
  </form>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import courseService from "@/services/courseService";

const emit = defineEmits(["submit", "cancel"]);

const courses = ref([]);

const form = reactive({
  theme: "",
  date: "",
  location: "",
  description: "",
  course_id: null,
});

const submit = () => {
  emit("submit", {
    ...form,
    date: form.date ? new Date(form.date).toISOString() : "",
  });
};

onMounted(async () => {
  try {
    const { data } = await courseService.getAllCourses();
    courses.value = Array.isArray(data) ? data : data.results || [];
  } catch (err) {
    console.error(err);
  }
});
</script>

<style scoped>
.session-form {
  background: white;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.session-form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.7rem;
  box-sizing: border-box;
}

button {
  padding: 0.6rem 1rem;
  background: var(--color-cherry-red);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.cancel {
  background: #777;
}
</style>

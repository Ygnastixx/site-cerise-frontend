<template>
  <form class="session-form" @submit.prevent="submit">

    <h2>Nouvelle session</h2>

    <div>
      <label>Titre</label>
      <input
        v-model="form.title"
        type="text"
        required
      />
    </div>

    <div>
      <label>Date</label>
      <input
        v-model="form.date"
        type="date"
        required
      />
    </div>

    <div>
      <label>Heure</label>
      <input
        v-model="form.start_time"
        type="time"
      />
    </div>

    <div>
      <label>Lieu</label>
      <input
        v-model="form.location"
        type="text"
      />
    </div>

    <button type="submit">
      Créer la session
    </button>

    <button
      type="button"
      class="cancel"
      @click="$emit('cancel')"
    >
      Annuler
    </button>

  </form>
</template>

<script setup>
import { reactive } from "vue";

const emit = defineEmits(["submit", "cancel"]);

const form = reactive({
  title: "",
  date: "",
  start_time: "",
  location: "",
});

const submit = () => {
  emit("submit", { ...form });
};
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
<script setup>
import { onMounted, ref } from 'vue'
import { getPendingUsers, approveUser, changeUserRole } from '@/services/userService'

const users = ref([])
const loading = ref(false)
const error = ref('')
const roles = ['MEMBER', 'STAFF', 'ADMIN']

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    users.value = await getPendingUsers()
  } catch (err) {
    console.error(err)
    error.value = 'Impossible de charger les inscriptions en attente.'
  } finally {
    loading.value = false
  }
}

const handleApprove = async (user) => {
  try {
    await approveUser(user.matricule)
    users.value = users.value.filter((u) => u.matricule !== user.matricule)
  } catch (err) {
    console.error(err)
    error.value = `Impossible d'approuver ${user.username}.`
  }
}

const handleRoleChange = async (user, event) => {
  const role = event.target.value
  try {
    await changeUserRole(user.matricule, role)
    user.role = role
  } catch (err) {
    console.error(err)
    error.value = `Impossible de changer le rôle de ${user.username}.`
  }
}

onMounted(load)
</script>

<template>
  <div class="pending-page">
    <h1>Validations en attente</h1>

    <div v-if="error" class="alert">{{ error }}</div>
    <div v-if="loading">Chargement...</div>
    <div v-else-if="users.length === 0" class="message">Aucune inscription en attente.</div>

    <table v-else class="pending-table">
      <thead>
        <tr>
          <th>Matricule</th>
          <th>Nom d'utilisateur</th>
          <th>Email</th>
          <th>Rôle</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.matricule">
          <td>{{ user.matricule }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <select :value="user.role" @change="handleRoleChange(user, $event)">
              <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
            </select>
          </td>
          <td>
            <button class="btn-primary" @click="handleApprove(user)">Approuver</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.pending-page {
  padding: 2rem;
}
.pending-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.pending-table th,
.pending-table td {
  text-align: left;
  padding: 0.6rem;
  border-bottom: 1px solid #eee;
}
.btn-primary {
  background: var(--color-eni-green);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}
.alert {
  padding: 10px;
  border-radius: 8px;
  background: #fff0f0;
  color: #a31616;
  border: 1px solid #f2c1c1;
  margin-bottom: 12px;
}
.message {
  padding: 2rem;
  text-align: center;
  color: #666;
}
</style>

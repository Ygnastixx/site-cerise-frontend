<script setup>
import { onMounted, ref } from 'vue'
import EquipmentList from '@/components/inventory/EquipmentList.vue'
import EquipmentForm from '@/components/inventory/EquipmentForm.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import {
  getInventory,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from '@/services/inventoryService'

const equipment = ref([])
const loading = ref(false)
const error = ref('')

const showModal = ref(false)
const editingEquipment = ref(null)

const loadEquipment = async () => {
  loading.value = true
  error.value = ''
  try {
    equipment.value = await getInventory()
  } catch (err) {
    console.error(err)
    error.value = 'Impossible de charger le matériel.'
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  editingEquipment.value = null
  showModal.value = true
}

const openEdit = (item) => {
  editingEquipment.value = item
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingEquipment.value = null
}

const handleSubmit = async (payload) => {
  try {
    if (editingEquipment.value) {
      await updateEquipment(editingEquipment.value.id, payload)
    } else {
      await createEquipment(payload)
    }
    closeModal()
    await loadEquipment()
  } catch (err) {
    console.error(err)
    error.value = "Impossible d'enregistrer ce matériel."
  }
}

const handleDelete = async (item) => {
  if (!confirm(`Supprimer « ${item.name} » ?`)) return
  try {
    await deleteEquipment(item.id)
    await loadEquipment()
  } catch (err) {
    console.error(err)
    error.value = 'Impossible de supprimer ce matériel.'
  }
}

onMounted(loadEquipment)
</script>

<template>
  <div class="inventory-page">
    <header class="page-header">
      <h1>Inventaire du matériel</h1>
      <button class="btn-primary" @click="openCreate">+ Ajouter du matériel</button>
    </header>

    <EquipmentList
      :equipment="equipment"
      :loading="loading"
      :error="error"
      @edit="openEdit"
      @delete="handleDelete"
    />

    <BaseModal
      :show="showModal"
      :title="editingEquipment ? 'Modifier le matériel' : 'Ajouter un matériel'"
      @close="closeModal"
    >
      <EquipmentForm :equipment="editingEquipment" @submit="handleSubmit" @cancel="closeModal" />
    </BaseModal>
  </div>
</template>

<style scoped>
.inventory-page {
  padding: 2rem;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.btn-primary {
  background: var(--color-cherry-red);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
</style>

import api from './api'

export const getInventory = async () => {
  const response = await api.get('/inventory/equipments/')
  return response.data
}

export const createEquipment = async (equipment) => {
  const response = await api.post('/inventory/equipments/', equipment)
  return response.data
}

export const updateEquipment = async (id, equipment) => {
  const response = await api.put(`/inventory/equipments/${id}/`, equipment)
  return response.data
}

export const deleteEquipment = async (id) => {
  await api.delete(`/inventory/equipments/${id}/`)
}

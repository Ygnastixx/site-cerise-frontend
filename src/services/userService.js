import api from './api'

export const getPendingUsers = async () => {
  const response = await api.get('/users/pending/')
  return response.data
}

export const approveUser = async (matricule) => {
  const response = await api.patch(`/users/${matricule}/approve/`, { is_approved: true })
  return response.data
}

export const changeUserRole = async (matricule, role) => {
  const response = await api.patch(`/users/${matricule}/role/`, { role })
  return response.data
}

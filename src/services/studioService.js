import api from './api'

export const getTemplates = async () => {
  const response = await api.get('/studio/templates/')
  return response.data
}

export const generateSlides = async (data) => {
  const response = await api.post('/studio/generate-slides/', data)
  return response.data
}

export const generatePoster = async (data) => {
  const response = await api.post('/studio/generate-poster/', data)
  return response.data
}

export const generateSocialPost = async (data) => {
  const response = await api.post('/studio/generate-social-post/', data)
  return response.data
}

import api from './api'

export default {
  getAllCourses(params = {}) {
    return api.get('/courses/', { params })
  },
  getCourse(id) {
    return api.get(`/courses/${id}/`)
  },
  createCourse(payload) {
    return api.post('/courses/', payload)
  },
  updateCourse(id, payload) {
    return api.put(`/courses/${id}/`, payload)
  },
  patchCourse(id, payload) {
    return api.patch(`/courses/${id}/`, payload)
  },
  deleteCourse(id) {
    return api.delete(`/courses/${id}/`)
  },
  publishCourse(id) {
    return api.post(`/courses/${id}/publish/`)
  },
  trashCourse(id) {
    return api.post(`/courses/${id}/trash/`)
  },
  restoreCourse(id) {
    return api.post(`/courses/${id}/restore/`)
  },
  duplicateCourse(id) {
    return api.post(`/courses/${id}/duplicate/`)
  },

  getSections(params = {}) {
    return api.get('/courses/sections/', { params })
  },
  getSectionTree(courseId) {
    return api.get('/courses/sections/tree/', { params: { course: courseId } })
  },
  createSection(payload) {
    return api.post('/courses/sections/', payload)
  },
  updateSection(id, payload) {
    return api.put(`/courses/sections/${id}/`, payload)
  },
  patchSection(id, payload) {
    return api.patch(`/courses/sections/${id}/`, payload)
  },
  deleteSection(id) {
    return api.delete(`/courses/sections/${id}/`)
  },
  reorderSections(items) {
    return api.post('/courses/sections/reorder/', { items })
  },
}

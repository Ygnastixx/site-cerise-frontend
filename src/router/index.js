import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },

  // AUTH
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },

  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
  },

  {
    path: '/admin/pending',
    name: 'pending-users',
    component: () => import('@/views/admin/PendingUsersView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  // COURSES
  {
    path: '/courses',
    name: 'course-list',
    component: () => import('@/views/courses/CourseList.vue'),
  },

  {
    path: '/courses/new',
    name: 'course-create',
    component: () => import('@/views/courses/CourseEditor.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/courses/:id',
    name: 'course-detail',
    component: () => import('@/views/courses/CourseDetail.vue'),
  },

  {
    path: '/courses/:id/edit',
    name: 'course-edit',
    component: () => import('@/views/courses/CourseEditor.vue'),
    meta: { requiresAuth: true },
  },

  // INVENTORY
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/inventory/InventoryView.vue'),
  },

  {
    path: '/inventory/:id',
    name: 'EquipmentDetail',
    component: () => import('../views/inventory/EquipmentDetailView.vue'),
  },

  // SESSIONS
  {
    path: '/sessions',
    name: 'Sessions',
    component: () => import('../views/sessions_app/sessionsView.vue'),
  },

  {
    path: '/sessions/:id',
    name: 'SessionDetail',
    component: () => import('../views/sessions_app/sessionDetailView.vue'),
  },

  // STUDIO
  {
    path: '/studio',
    name: 'Studio',
    component: () => import('../views/studio/StudioView.vue'),
  },

  {
    path: '/studio/template/:id',
    name: 'Template',
    component: () => import('../views/studio/templateView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (requiresAdmin && !authStore.isAdmin) {
    next({ name: 'course-list' })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'course-list' })
  } else {
    next()
  }
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/*
 * ─────────────────────────────────────────────
 * ROUTES
 * ─────────────────────────────────────────────
 *
 * Permissions disponibles :
 *
 * requiresAuth
 *   → l'utilisateur doit être connecté
 *
 * requiresStaffOrAdmin
 *   → l'utilisateur doit être STAFF ou ADMIN
 *
 * requiresAdmin
 *   → l'utilisateur doit être ADMIN
 */

const routes = [
  // ───────────────────────────────────────────
  // AUTHENTIFICATION
  // ───────────────────────────────────────────

  {
    path: '/',
    redirect: '/login',
  },

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

  // ───────────────────────────────────────────
  // ADMINISTRATION
  // ───────────────────────────────────────────

  {
    path: '/admin/pending',
    name: 'pending-users',
    component: () => import('@/views/admin/PendingUsersView.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },

  // ───────────────────────────────────────────
  // COURS
  // ───────────────────────────────────────────

  {
    path: '/courses',
    name: 'course-list',
    component: () => import('@/views/courses/CourseList.vue'),
  },

  {
    path: '/courses/new',
    name: 'course-create',
    component: () => import('@/views/courses/CourseEditor.vue'),
    meta: {
      requiresAuth: true,
      requiresStaffOrAdmin: true,
    },
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
    meta: {
      requiresAuth: true,
      requiresStaffOrAdmin: true,
    },
  },

  // ───────────────────────────────────────────
  // MATÉRIEL / INVENTAIRE
  // ───────────────────────────────────────────

  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../views/inventory/InventoryView.vue'),
    meta: {
      requiresAuth: true,
      requiresStaffOrAdmin: true,
    },
  },

  {
    path: '/inventory/:id',
    name: 'EquipmentDetail',
    component: () => import('../views/inventory/EquipmentDetailView.vue'),
    meta: {
      requiresAuth: true,
      requiresStaffOrAdmin: true,
    },
  },

  // ───────────────────────────────────────────
  // SÉANCES
  // ───────────────────────────────────────────

  {
    path: '/sessions',
    name: 'Sessions',
    component: () => import('../views/sessions_app/sessionsView.vue'),
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: '/sessions/:id',
    name: 'SessionDetail',
    component: () => import('../views/sessions_app/sessionDetailView.vue'),
    meta: {
      requiresAuth: true,
    },
  },

  // ───────────────────────────────────────────
  // STUDIO
  // ───────────────────────────────────────────

  {
    path: '/studio',
    name: 'Studio',
    component: () => import('../views/studio/StudioView.vue'),
    meta: {
      requiresAuth: true,
      requiresStaffOrAdmin: true,
    },
  },

  {
    path: '/studio/template/:id',
    name: 'Template',
    component: () => import('../views/studio/templateView.vue'),
    meta: {
      requiresAuth: true,
      requiresStaffOrAdmin: true,
    },
  },
]

/*
 * ─────────────────────────────────────────────
 * ROUTER
 * ─────────────────────────────────────────────
 */

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/*
 * ─────────────────────────────────────────────
 * NAVIGATION GUARD
 * ─────────────────────────────────────────────
 */

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth)

  const requiresAdmin = to.matched.some((route) => route.meta.requiresAdmin)

  const requiresStaffOrAdmin = to.matched.some((route) => route.meta.requiresStaffOrAdmin)

  // 1. Route réservée aux utilisateurs connectés
  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }

  // 2. Route réservée aux administrateurs
  if (requiresAdmin && !authStore.isAdmin) {
    return next({ name: 'course-list' })
  }

  // 3. Route réservée au staff et aux administrateurs
  if (requiresStaffOrAdmin && !authStore.isStaffOrAdmin) {
    return next({ name: 'course-list' })
  }

  // 4. Un utilisateur déjà connecté n'a pas besoin de revenir au login
  if (to.name === 'login' && authStore.isAuthenticated) {
    return next({ name: 'course-list' })
  }

  // 5. Navigation autorisée
  next()
})

export default router

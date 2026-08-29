import {
  createRouter,
  createWebHistory,
} from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/courses",
  },

  // AUTH
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },

  // COURSES
  {
    path: "/courses",
    name: "course-list",
    component: () => import("@/views/courses/CourseList.vue"),
  },

  {
    path: "/courses/new",
    name: "course-create",
    component: () => import("@/views/courses/CourseEditor.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/courses/:id",
    name: "course-detail",
    component: () => import("@/views/courses/CourseDetail.vue"),
  },

  {
    path: "/courses/:id/edit",
    name: "course-edit",
    component: () => import("@/views/courses/CourseEditor.vue"),
    meta: { requiresAuth: true },
  },

  // INVENTORY
  {
    path: "/inventory",
    name: "Inventory",
    component: () =>
      import("../views/inventory/InventoryView.vue"),
  },

  {
    path: "/inventory/:id",
    name: "EquipmentDetail",
    component: () =>
      import("../views/inventory/EquipmentDetailView.vue"),
  },

  // SESSIONS
  {
    path: "/sessions",
    name: "Sessions",
    component: () =>
      import("../views/sessions_app/sessionsView.vue"),
  },

  {
    path: "/sessions/:id",
    name: "SessionDetail",
    component: () =>
      import("../views/sessions_app/sessionDetailView.vue"),
  },

  // STUDIO
  {
    path: "/studio",
    name: "Studio",
    component: () =>
      import("../views/studio/StudioView.vue"),
  },

  {
    path: "/studio/template/:id",
    name: "Template",
    component: () =>
      import("../views/studio/templateView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("access_token");
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // 1. Redirige vers la page de login si la route exige une authentification et qu'aucun token n'existe
  if (requiresAuth && !token) {
    next({ name: "login" });
  }
  // 2. Si l'utilisateur est déjà connecté et tente d'aller sur /login, on le ramène sur /courses
  else if (to.name === "login" && token) {
    next({ name: "course-list" });
  }
  // 3. Navigation autorisée
  else {
    next();
  }
});

export default router;
import {
  createRouter,
  createWebHistory,
} from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/inventory",
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
  history: createWebHistory(),
  routes,
});

export default router;
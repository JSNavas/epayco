import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: RouteRecordRaw[] = [
  {
    path: 'register',
    name: 'register',
    component: () => import('src/pages/RegisterPage.vue'),
    meta: {
      title: 'Registro',
      requiresAuth: false
    }
  }
];

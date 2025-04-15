import type { RouteRecordRaw } from 'vue-router';

export const walletRoutes: RouteRecordRaw[] = [
  {
    path: 'wallet',
    name: 'wallet',
    component: () => import('src/pages/WalletPage.vue'),
    meta: {
      title: 'Billetera',
      requiresAuth: true
    }
  },
  {
    path: 'confirm',
    name: 'confirm-payment',
    component: () => import('src/pages/ConfirmPaymentPage.vue'),
    meta: {
      title: 'Confirmar Pago',
      requiresAuth: true
    }
  }
];

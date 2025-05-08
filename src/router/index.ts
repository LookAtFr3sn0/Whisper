import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/inbox',
      name: 'inbox',
      component: () => import('../views/Inbox.view.vue'),
    },
    {
      path: '/',
      name: 'welcome',
      component: () => import('../views/Welcome.view.vue'),
    }
  ],
});

export default router;

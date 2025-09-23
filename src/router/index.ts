import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChordsView from '@/views/ChordsView.vue';
import basePage from '@/views/base/basePage.vue';
import SequencyNotesView from '@/views/SequencyNotesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: basePage,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: '/chords',
          name: 'chords',
          component: ChordsView,
        },
        {
          path: '/sequency_notes',
          name: 'sequency_notes',
          component: SequencyNotesView,
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
});

export default router;

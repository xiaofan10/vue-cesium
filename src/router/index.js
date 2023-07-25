import { createRouter, createWebHistory } from 'vue-router'
import World from '../views/World.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: World
    },
    {
      path: '/ArcGis',
      name: 'ArcGis',
      // route level code-splitting
      // this generates a separate chunk (ArcGis.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ArcGis.vue')
    }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import World from '../views/World.vue'

export const getRoutes = () => [
  {
    path: '/',
    name: 'World',
    title: 'World',
    component: World
  },
  {
    path: '/ArcGis',
    name: 'ArcGis',
    title: 'ArcGis',
    // route level code-splitting
    // this generates a separate chunk (ArcGis.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/ArcGis.vue')
  }
  ,
  {
    path: '/LonOrLat',
    name: 'LonOrLat',
    title: 'LonOrLat',
    component: () => import('../views/LonOrLat.vue')
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: getRoutes()
})

export default router

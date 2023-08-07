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
  },
  {
    path: '/LonOrLat', // 经纬度转换
    name: 'LonOrLat',
    title: 'LonOrLat',
    component: () => import('../views/LonOrLat.vue')
  },
  {
    path: '/PointLineArea', // 点线面制作
    name: 'PointLineArea',
    title: 'PointLineArea',
    component: () => import('../views/PointLineArea.vue')
  },
  {
    path: '/TilesCar', // 点线面制作
    name: 'TilesCar',
    title: 'TilesCar',
    component: () => import('../views/tiles/TilesCar.vue')
  },
  {
    path: '/Lession', // 课程
    name: 'Lession',
    title: 'Lession',
    component: () => import('../views/lession/Lession.vue')
  },
  {
    path: '/GroupEntities', // 组合广告牌
    name: 'GroupEntities',
    title: 'GroupEntities',
    component: () => import('../views/GroupEntities.vue')
  },
  {
    path: '/Water', // 水波纹特效
    name: 'Water',
    title: 'Water',
    component: () => import('../views/Water.vue')
  },
  {
    path: '/Trajectory', // 轨迹
    name: 'Trajectory',
    title: 'Trajectory',
    component: () => import('../views/Trajectory.vue')
  },
  {
    path: '/TrajectoryCZML', // czml轨迹
    name: 'TrajectoryCZML',
    title: 'TrajectoryCZML',
    component: () => import('../views/TrajectoryCZML.vue')
  },
  {
    path: '/TrajectoryCZMLModel', // czml轨迹
    name: 'TrajectoryCZMLModel',
    title: 'TrajectoryCZMLModel',
    component: () => import('../views/TrajectoryCZMLModel.vue')
  },
  {
    path: '/Polyline', // 多线段
    name: 'Polyline',
    title: 'Polyline',
    component: () => import('../views/Polyline.vue')
  },
  {
    path: '/Camera', // 相机
    name: 'Camera',
    title: 'Camera',
    component: () => import('../views/Camera.vue')
  },
  {
    path: '/Billboard', // 广告牌
    name: 'Billboard',
    title: 'Billboard',
    component: () => import('../views/Billboard.vue')
  },
  {
    path: '/Primitive', // 广告牌
    name: 'Primitive',
    title: 'Primitive',
    component: () => import('../views/Primitive.vue')
  },
  {
    path: '/Terrain', // 地形
    name: 'Terrain',
    title: 'Terrain',
    component: () => import('../views/Terrain.vue')
  },
  {
    path: '/Tools', // map经纬度路径获取
    name: 'Tools',
    title: 'Tools',
    component: () => import('../views/Tools.vue')
  },
  {
    path: '/Weather', // map经纬度路径获取
    name: 'Weather',
    title: 'Weather',
    component: () => import('../views/Weather.vue')
  },
  {
    path: '/Fog', // map经纬度路径获取
    name: 'Fog',
    title: 'Fog',
    component: () => import('../views/weather/Fog.vue')
  },
  {
    path: '/MaterialRadarLine', // 雷达图
    name: 'MaterialRadarLine',
    title: 'MaterialRadarLine',
    component: () => import('../views/lession/MaterialRadarLine.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: getRoutes()
})

export default router

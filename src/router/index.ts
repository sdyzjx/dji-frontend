import { createRouter, createWebHistory } from 'vue-router'
import LiveView from '../views/LiveView.vue'
import WaypointView from '../views/WaypointView.vue'
import ManagementView from '../views/ManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'live',
      component: LiveView,
    },
    {
      path: '/waypoints',
      name: 'waypoints',
      component: WaypointView,
    },
    {
      path: '/management',
      name: 'management',
      component: ManagementView,
    },
  ],
})

export default router
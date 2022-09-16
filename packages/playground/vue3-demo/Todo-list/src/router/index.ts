import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('../components/Home.vue'), alias: '/home'},
  { path: '/add', component: () => import('../components/Add.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router

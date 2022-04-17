import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  { path: '/add', component: () => import('../components/Add.vue') },
  { path: '/edit', component: () => import('../components/Edit.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router

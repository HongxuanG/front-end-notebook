import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('../components/Home.vue'), alias: '/home'},
  { path: '/add', component: () => import('../components/Add.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to,from,savedPosition){
    console.log('scrollBehavior to===>', to)
    console.log('scrollBehavior from===>', from)
    console.log('scrollBehavior savedPosition===>', savedPosition)
    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})
export default router

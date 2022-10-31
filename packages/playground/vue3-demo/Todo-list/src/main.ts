import { createApp } from 'vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


import './assets/css/normalize.css'

import App from './App.vue'
import { createPinia } from 'pinia'
import storagePiniaPlugin from './stores/plugins/storagePlugin'

console.log('App==>', App)

const app = createApp(App)
console.log('app==>', app)
const pinia = createPinia()
pinia.use(storagePiniaPlugin({
  key: 'pinia',
  needKeepIds: ['todolist']
}))
app.use(pinia)
app.use(router)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })

app.mount('#app')


// import { createRenderer, render } from 'vue'

// const renderer = createRenderer({
//   insert(el, parent) {
//     console.log(el, parent)
//   },
//   createElement(type) {
//     console.log(type)
//     const element = document.createElement(type)
//     return element
//   },
//   patchProp: function (
//     el,
//     key: string,
//     prevValue: any,
//     nextValue: any,
//     isSVG?: boolean,
//     prevChildren?,
//     parentComponent?,
//     parentSuspense?,
//     unmountChildren?
//   ): void {
//     throw new Error('Function not implemented.')
//   },
//   remove: function (el): void {
//     throw new Error('Function not implemented.')
//   },
//   createText: function (text: string) {
//     throw new Error('Function not implemented.')
//   },
//   createComment: function (text: string) {
//     throw new Error('Function not implemented.')
//   },
//   setText: function (node, text: string): void {
//     throw new Error('Function not implemented.')
//   },
//   setElementText: function (node, text: string): void {
//     console.log('node', node, 'text', text)
//     throw new Error('Function not implemented.')
//   },
//   parentNode: function (node) {
//     throw new Error('Function not implemented.')
//   },
//   nextSibling: function (node) {
//     throw new Error('Function not implemented.')
//   },
// })
// console.log('renderer===>', renderer)
// console.log('App==>',App)
// renderer.createApp(App).mount(document.querySelector('#app'))

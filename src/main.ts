// import { ViteSSG } from 'vite-ssg'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { createHead } from '@vueuse/head'
import { routes } from 'vue-router/auto-routes'
import { addCollection } from '@iconify/vue'
import App from './App.vue'
import type { UserModule } from './types'
import iconSet from '@/assets/iconify.json'
import { menus } from '@/config/menus'

import '@unocss/reset/tailwind.css'
import './styles/main.scss'
import 'uno.css'

addCollection(iconSet) // 本地图标库

const routeList = setupLayouts(routes)

// vite-ssg, 如需使用可手工开启
// https://github.com/antfu/vite-ssg
// export const createApp = ViteSSG(
//   App,
//   { routes, base: import.meta.env.BASE_URL },
//   (ctx) => {
//     // install all modules under `modules/`
//     Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
//       .forEach(i => i.install?.(ctx))
//   },
// )

// 不使用ssg
const app = createApp(App)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeList,
})
app.use(router)

const head = createHead()
app.use(head)

Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
  .forEach(i => i.install?.({ isClient: typeof window !== 'undefined', app, router }))

useSideMenuStore().setMenus(menus)

app.mount('#app')

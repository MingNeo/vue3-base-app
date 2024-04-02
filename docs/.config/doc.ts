import { ViteSSG } from 'vite-ssg'
// import { createApp } from 'vue'
import { RouteRecord, createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
// import Previewer from 'virtual:vue-component-preview'
// import { createHead } from '@vueuse/head'
import App from '~/App.vue'
import type { UserModule } from '~/src/types'
import generatedRoutes from '~pages'
import { useSideMenuStore } from '~/stores/sideMenu'
import MdDemo from './demo.vue'
import '~/styles/markdown.css'

// tailwind reset会使antdv的样式错乱，所以去除掉，如需使用可自行引入并处理兼容
// import '@unocss/reset/tailwind.css'

import '~/styles/main.scss'
import 'uno.css'

const routes = setupLayouts(generatedRoutes)

const routesMap = arrayToObject(generatedRoutes, 'path')

// vite-ssg这个包与antdv有冲突，会造成打包生产文件失败，如需使用可手工开启
// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL || '/' },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install: UserModule }>('~/modules/*.ts', { eager: true }))
      .forEach(i => i.install?.(ctx))
    // ctx.app.use(Previewer)
    ctx.app.component('Demo', MdDemo)
    useSideMenuStore().setMenus(generatedMenus(routes))
  },
)

// 根据route自动生成菜单，包含children
function generatedMenus(routes: RouteRecord[]) {
  const menus: any[] = [{
    path: '/docs',
    key: '/docs',
    title: '文档',
    children: [{
      path: '/list_page',
      key: '/list_page',
      title: '快速编写列表页',
    }, {
      path: '/detail_page',
      key: '/detail_page',
      title: '快速编写详情页',
    }, {
      path: '/detail_modal',
      key: '/detail_modal',
      title: '快速编写弹窗',
    }]
  }, {
    path: '/common/',
    key: '/common',
    title: '通用组件',
    children: []
  }, {
    path: '/business/',
    key: '/business',
    title: '通用业务组件',
    children: []
  }, {
    path: '/composables/',
    key: '/composables',
    title: '通用composables',
    children: []
  }]
  routes.sort((a, b) => {
    // 按字母顺序排序
    return a.path.localeCompare(b.path)
  })
    .forEach((v) => {
      if (/^\/common/.test(v.path)) {
        const title = routesMap[v.path]?.name?.replace(/(common)-/, '').replace(/-readme/ig, '')
        const path = v.path
        menus[1].children.push({ path, key: path, title })
      } else if (/^\/business/.test(v.path)) {
        const title = routesMap[v.path]?.name?.replace(/(business)-/, '').replace(/-readme/ig, '')
        const path = v.path
        menus[2].children.push({ path, key: path, title })
      } else if (/^\/composables/.test(v.path)) {
        const title = routesMap[v.path]?.name?.replace(/(composables)-/, '').replace(/-readme/ig, '')
        const path = v.path
        menus[3].children.push({ path, key: path, title })
      }
    })

  return menus
}

// 不使用ssg
// const app = createApp(App)

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes,
// })

// app.use(router)

// const head = createHead()
// app.use(head)

// Object.values(import.meta.glob<{ install: UserModule }>('~/modules/*.ts', { eager: true }))
//   .forEach(i => i.install?.({ isClient: typeof window !== 'undefined', app, router }))

// useSideMenuStore().setMenus(routes.map((v) => {
//   const title = routesMap[v.path]?.name?.replace(/(common|business)-/, '').replace(/-readme/ig, '')
//   return ({ path: v.path, key: v.path, title })
// }))

// app.mount('#app')

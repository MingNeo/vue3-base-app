// import { type ViteSSGContext } from 'vite-ssg'
// export type UserModule<T = ViteSSGContext> = (ctx: T) => void

import type { HeadClient } from '@vueuse/head'
import type { App } from 'vue-demi'
// 如果使用ViteSSG则使用上面的
import type { Router } from 'vue-router'

interface Context {
  app: App<Element>
  router: Router
  head?: HeadClient
  isClient: boolean
}

export type UserModule<T = Context> = (ctx: T) => void

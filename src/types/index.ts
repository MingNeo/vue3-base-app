// import { type ViteSSGContext } from 'vite-ssg'
// export type UserModule<T = ViteSSGContext> = (ctx: T) => void

import type { VueHeadClient } from '@unhead/vue'
import type { App } from 'vue'
// 如果使用ViteSSG则使用上面的
import type { Router } from 'vue-router'

interface Context {
  app: App<Element>
  router: Router
  head?: VueHeadClient<any>
  isClient: boolean
}

export type UserModule<T = Context> = (ctx: T) => void

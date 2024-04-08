import { createPinia } from 'pinia'
import { type UserModule } from '~/types'

// https://pinia.vuejs.org/
export const install: UserModule = ({ app }) => {
  const pinia = createPinia()
  app.use(pinia)

  // vite-ssg 如需使用可手工开启
  // https://github.com/antfu/vite-ssg/blob/main/README.md#state-serialization
  // if (isClient)
  //   pinia.state.value = (initialState.pinia) || {}

  // else
  //   initialState.pinia = pinia.state.value
}

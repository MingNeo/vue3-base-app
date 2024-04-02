import type { UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (!isClient)
    return

  router.beforeEach(async (to, from, next) => {
    // 设置文档标题
    if (to.meta && typeof to.meta.title !== 'undefined')
      document.title = `${to.meta.title} - `
    else
      document.title = ''

    const { setSelectedKeysByRoute } = useSideMenuStore()

    setSelectedKeysByRoute(to)

    next()
  })
}

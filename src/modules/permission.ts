import type { UserModule } from '~/types'
import { whiteList } from '~/config/permission'
import { usePermissionStore } from '~/stores/permission'
import { useUserStore } from '~/stores/user'
import { openRedirectLogin, saveLoginToken } from '~/config'
import localAccessToken from '~/utils/accessToken'

declare module 'vue' {
  interface ComponentCustomProperties {
    $hasAuth: (permission: string) => boolean
  }
}

// 登录页的路由路径
const loginPath = '/login'

export const install: UserModule = ({ isClient, router, app }) => {
  if (!isClient || process.env.DISABLED_PERMISSSION)
    return

  const redirectUrl = ref<string>()

  router.beforeEach(async (to, from, next) => {
    // 获取权限仓库和用户仓库
    const permissionStore = usePermissionStore()
    const userStore = useUserStore()

    const token = saveLoginToken ? userStore.token : localAccessToken.get()
    let isLogin = !!token

    // 如果用户信息未加载，则获取用户信息
    if (to.path !== loginPath && (!isLogin || !userStore?.info?.userId)) {
      try {
        await userStore.getInfo()
      }
      catch (error: any) {
        if (error?.response?.status === 401)
          isLogin = false
      }
    }

    // 检查用户是否具有所需的权限
    if ((to.meta?.permission || to.meta?.role) && !permissionStore.checkHasAuth(to.meta)) {
      ElMessage.error('您没有访问此页面的权限')
      next()
      return
    }

    // 如果在查询参数中提供了重定向URL，则在登录后重定向到指定的URL
    if (to.path === loginPath && from.query.redirect)
      redirectUrl.value = decodeURIComponent(from.query.redirect as string)

    // 如果用户具有所需的权限，则重定向到指定的URL
    if (redirectUrl.value) {
      next({ path: redirectUrl.value })
      redirectUrl.value = undefined
      return
    }

    // 如果用户未登录且未在白名单中，则重定向到登录页面
    if (!isLogin && !whiteList.some(route => to.path.match(route))) {
      if (!openRedirectLogin) {
        ElMessage.error('未登录！')
        next()
      }
      else {
        next({ path: loginPath, query: { redirect: to.fullPath } })
      }

      return
    }

    next()
  })

  app.use(plugin)
}

/**
 * 按钮级权限注入
 * <el-button v-if="$hasAuth('demoList:del')">Button</el-button>
 */
function plugin(app: any) {
  app.config.globalProperties.$hasAuth = (permission: string | string[]) => {
    const permissionStore = usePermissionStore()
    return !!permissionStore.checkHasPermission(permission)
  }
}

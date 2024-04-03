import { acceptHMRUpdate, defineStore } from 'pinia'
import { debounce } from 'lodash-es'
import * as api from '~/api/user'
import { saveLoginToken } from '~/config'
import localAccessToken from '~/utils/accessToken'

export const useUserStore = defineStore('user', () => {
  const token = ref(localAccessToken.get())
  const info = ref<Record<string, any>>({})

  // 登录
  const login = async (params: any) => {
    const result = await api.login(params)
    const { token: newToken, expireTime } = result as any
    if (saveLoginToken) {
      token.value = newToken
      localAccessToken.set(newToken, expireTime * 1000)
    }
    else {
      token.value = newToken
    }
  }

  const getCaptcha = async () => {
    return await api.getCaptcha()
  }

  // 获取用户信息
  const getInfo = debounce(async () => {
    const permissionStore = usePermissionStore()
    try {
      // 请求后端获取用户信息
      const result: any = await api.getInfo()
      let roles
      let permissions
      if (result?.roles?.length > 0) {
        roles = [...result.roles]
        permissionStore.setRoles(roles)
      }
      if (result?.permissions?.length > 0) {
        permissions = [...result.permissions]
        permissionStore.setPermissions(permissions)
      }
      info.value = result
      return { ...result, roles }
    }
    catch (error) {
      return Promise.reject(error)
    }
  }, 500, { leading: true, trailing: false })

  // 登出
  const logout = async () => {
    try {
      await api.logout(token.value)
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log('logout fail:', error)
    }
    token.value = ''
    localAccessToken.remove()
    info.value = {}
    const permissionStore = usePermissionStore()
    permissionStore.setRoles([])
  }

  const updateUserInfo = (value: any) => {
    info.value = value
  }

  return {
    token,
    info,
    login,
    getInfo,
    logout,
    getCaptcha,
    updateUserInfo,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore as any, import.meta.hot))

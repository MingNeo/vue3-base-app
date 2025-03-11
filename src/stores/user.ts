import * as api from '@/api/user'
import { saveLoginToken } from '@/config'
import localAccessToken from '@/utils/accessToken'
import { debounce } from 'lodash-es'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref(localAccessToken.get())
  const info = ref<Record<string, any>>({})

  // 登录
  const login = async (params: any) => {
    const result = await api.login(params)
    const { token: newToken, expireTime } = result as any
    if (saveLoginToken) {
      token.value = newToken
      // @ts-expect-error-next-line
      localAccessToken.set(newToken, expireTime * 1000)
    }
    else {
      token.value = newToken
    }
  }

  const getCaptcha = async (phone: string) => {
    return await api.getCaptcha(phone)
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

  const clearLogin = () => {
    token.value = ''
    localAccessToken.remove()
    info.value = {}
    const permissionStore = usePermissionStore()
    permissionStore.setRoles([])
  }

  // 登出
  const logout = async () => {
    try {
      await api.logout(token.value)
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log('logout fail:', error)
    }
    clearLogin()
  }

  const updateUserInfo = (value: any) => {
    info.value = value
  }

  const quickLogin = async (params: any) => {
    return await api.quickLogin(params)
  }

  return {
    token,
    info,
    login,
    quickLogin,
    getInfo,
    logout,
    clearLogin,
    getCaptcha,
    updateUserInfo,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore as any, import.meta.hot))

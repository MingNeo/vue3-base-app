import { acceptHMRUpdate, defineStore } from 'pinia'

interface RouterMeta {
  permission?: string | string[]
  role?: string | string[]
  [x: string]: any
}

export const usePermissionStore = defineStore('permission', () => {
  const roles = ref<string[]>(['admin']) // 所有角色
  const permissions = ref<string[]>([]) // 所有权限

  // 设置角色
  function setRoles(newRoles: string[]): void {
    roles.value = newRoles
  }

  // 设置权限
  function setPermissions(newPermissions: string[]): void {
    permissions.value = newPermissions
  }

  // 验证权限
  const checkHasPermission = (permission?: string | string[]): boolean => {
    if (!permission)
      return false
    return permission === 'string' ? permissions.value.includes(permission) : permissions.value.some(item => permission.includes(item))
  }

  // 验证权限
  const checkHasRole = (role?: string | string[]): boolean => {
    if (!role)
      return false
    return role === 'string' ? roles.value.includes(role) : roles.value.some(item => role.includes(item))
  }

  const checkHasAuth = (meta: RouterMeta) => {
    return (!meta.role && !meta.permission) || checkHasPermission(meta.permission) || checkHasRole(meta.role)
  }

  return { roles, permissions, setRoles, setPermissions, checkHasPermission, checkHasRole, checkHasAuth }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePermissionStore, import.meta.hot))

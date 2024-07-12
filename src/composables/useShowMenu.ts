import type { MenuItem } from '@/utils/menu'
import { usePermissionStore } from '@/stores/permission'

export function useShowMenu(menus: MenuItem[]) {
  const permissionStore = usePermissionStore()
  return generateShowMenu(menus, permissionStore.checkHasAuth)
}

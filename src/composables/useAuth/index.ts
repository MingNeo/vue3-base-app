import { usePermissionStore } from '@/stores/permission'

export default function useAuth() {
  const permissionStore = usePermissionStore()
  return (permission: string | string[]) => !!permissionStore.checkHasPermission(permission)
}

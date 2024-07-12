import { acceptHMRUpdate, defineStore } from 'pinia'

export const useSideMenuStore = defineStore('sideMenu', () => {
  const collapsed = ref(false)
  const currrentRoute = ref()
  const selectedKey = ref<string>()
  const openKeys = ref([''])
  const preOpenKeys = ref([''])
  const menus = ref<any[]>([])
  const permissionStore = usePermissionStore()

  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value
  }

  const showMenus = computed(() => generateShowMenu(menus.value, permissionStore.checkHasAuth))

  watch(currrentRoute, (val: string) => {
    const newSelectedKey = showMenus.value.reduce((prev: any[], cur: any) => ([...prev, cur, ...(cur.children || [])]), []).find(item => item.path === val)?.key
    if (newSelectedKey)
      selectedKey.value = newSelectedKey
  }, { deep: true, immediate: true })

  // 设置当前所选菜单项的键
  const setselectedKeyByRoute = (route: any) => {
    currrentRoute.value = route?.path ?? currrentRoute.value
  }

  const setMenus = (newMenus: any[]) => menus.value = newMenus

  return { menus, setMenus, showMenus, collapsed, selectedKey, setselectedKeyByRoute, openKeys, preOpenKeys, toggleCollapsed }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSideMenuStore, import.meta.hot))

import { pathToRegexp } from 'path-to-regexp'
import { generateMenuByAuth } from '~/config'
import routes from '~pages'

export interface MenuItem {
  key: string
  title: string
  path?: string
  children?: MenuItem[]
  role?: string[]
  permission?: string[]
}

export function generateShowMenu(menus: MenuItem[], hasAuth: (meta: any) => boolean) {
  if (!generateMenuByAuth)
    return menus

  const showMenu: MenuItem[] = []

  menus.forEach((menu) => {
    const item = { ...menu }
    if (item.path) {
      const route = routes.find(r => item.path && pathToRegexp(r.path).test(item.path))
      if (route?.meta && hasAuth(route.meta)) {
        item.role = route.meta?.role as any
        item.permission = route.meta?.permission as any
        showMenu.push(item)
      }
    }
    else if (item.children) {
      const children = generateShowMenu(item.children, hasAuth)
      if (children.length > 0) {
        item.children = children
        item.role = children.some(child => !child.role) ? children.filter(child => !child.role).map(child => child.role).flat() : undefined as any
        item.permission = children.some(child => !child.permission) ? children.filter(child => !child.permission).map(child => child.permission).flat() : undefined as any
        showMenu.push(item)
      }
    }
  })
  return showMenu
}

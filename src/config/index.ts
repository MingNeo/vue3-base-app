export * from './constants'

// 是否前端管理accessToken, 当为true时，使用常规由前端存储、管理令牌。
// 否则则通过请求response的cookie自动管理，仅根据cookie的key获取token
export const saveLoginToken = true

// accessToken存储类型，可选cookie，localStorage，sessionStorage
export const accessTokenSaveBy = 'localStorage'

// 是否开启根据权限筛选menu
export const generateMenuByAuth = false

// 是否开启未登录自动跳转登录页
export const openRedirectLogin = true

export const imageEnums = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'bmp', 'tiff', 'webp', 'heif']

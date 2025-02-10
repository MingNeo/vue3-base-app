import { ACCESS_TOKEN_SAVE_KEY, accessTokenSaveBy } from '@/config'
import cookie from 'js-cookie'

const localAccessTokens = {
  localStorage: {
    get: (key?: string) => localStorage.getItem(key || ACCESS_TOKEN_SAVE_KEY),
    set: (accessToken: string) => localStorage.setItem(ACCESS_TOKEN_SAVE_KEY, accessToken),
    remove: () => localStorage.removeItem(ACCESS_TOKEN_SAVE_KEY),
  },
  sessionStorage: {
    get: (key?: string) => sessionStorage.getItem(key || ACCESS_TOKEN_SAVE_KEY),
    set: (accessToken: string) => sessionStorage.setItem(ACCESS_TOKEN_SAVE_KEY, accessToken),
    remove: () => sessionStorage.clear(),
  },
  cookie: {
    get: (key?: string) => cookie.get(key || ACCESS_TOKEN_SAVE_KEY),
    set: (accessToken: string, expireTime?: number) => {
      // 此处过期时间为毫秒
      if (expireTime) {
        const expires = new Date(Date.now() + expireTime)
        cookie.set(ACCESS_TOKEN_SAVE_KEY, accessToken, { expires })
      }
      else {
        cookie.set(ACCESS_TOKEN_SAVE_KEY, accessToken)
      }
    },
    remove: () => cookie.remove(ACCESS_TOKEN_SAVE_KEY),
  },
}

const localAccessToken = localAccessTokens[accessTokenSaveBy || 'localStorage']

export default localAccessToken

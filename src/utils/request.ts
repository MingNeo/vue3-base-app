import type { CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios'
import { REQUEST_ACCESS_TOKEN_KEY, saveLoginToken } from '@/config'
import axios from 'axios'
import { isObject } from 'lodash-es'
import localAccessToken from './accessToken'

interface RequestConfig extends InternalAxiosRequestConfig {
  formatData?: boolean
  quiet?: boolean
}

interface ResponseData {
  code?: number
  result?: any
  type: 'success' | 'error'
}

const baseUrl = ''

/**
 * 创建axios实例的工厂函数
 * @param config axios配置
 */
export function createRequest(config: CreateAxiosDefaults<any>) {
  const instance = axios.create(config)
  // request 拦截
  instance.interceptors.request.use((config) => {
    const userStore = useUserStore()
    if (REQUEST_ACCESS_TOKEN_KEY) {
      const token = saveLoginToken ? userStore.token : localAccessToken.get()
      // 如果 token 存在, 让每个请求携带自定义 token
      if (token)
        config.headers[REQUEST_ACCESS_TOKEN_KEY] = token.includes('Bearer') ? token : `Bearer ${token}`
    }

    return config
  }, (error: any) => {
    // 取消请求不进行报错处理
    if (error.message === 'canceled')
      return Promise.reject

    // 常见request报错处理
    if (error.message === 'Network Error')
      error.message = '网络异常'

    if (error.message.includes('timeout') || [504, 499, 'ECONNABORTED'].includes(error.code))
      error.message = '数据处理中，请稍后重试'

    message.error(error.message || '接口异常')

    return Promise.reject(error)
  })

  // response 拦截
  instance.interceptors.response.use((res) => {
    const status = Number(res.status) || 200

    if (status !== 200)
      return Promise.reject(res)

    const { responseType = 'json', formatData = true, quiet } = res.config as RequestConfig

    if (responseType === 'json') {
      if (res.data.error_code) {
        if (res.data.error_code === 401)
          return unLoginHandler(res.data.message)

        quiet || message.error(res.data.message)
        return Promise.reject(new Error(res.data.message))
      }
      if (formatData && res.data && isObject(res.data)) {
        res.data = res.data as ResponseData
        return res.data.data ?? res.data.result
      }
      return res.data
    }
    else { return res }
  }, (error: any) => {
    // response 非200报错处理
    if (error.response) {
      const { data, status } = error.response
      const { quiet } = error.config || {} as RequestConfig
      if (status === 401)
        unLoginHandler(error.message || '无权限, 请登录')

      else quiet || message.error(data?.message || '接口异常')

      return Promise.reject(error)
    }

    message.error(error.message || '接口异常')

    return Promise.reject(error)
  })

  return instance
}

export function unLoginHandler(errorMessage: string) {
  message.error('无权限, 请登录')
  const userStore = useUserStore()
  userStore.clearLogin()
  return Promise.reject(new Error(errorMessage))
}

export default createRequest({
  baseURL: baseUrl,
  timeout: 10000, // 请求超时时间
  withCredentials: true, // 是否允许携带cookie
  headers: {
    post: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
    },
  },
})

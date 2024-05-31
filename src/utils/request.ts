import type { CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { isObject } from 'lodash-es'
import localAccessToken from './accessToken'
import { REQUEST_ACCESS_TOKEN_KEY, saveLoginToken } from '~/config'

interface RequestConfig extends InternalAxiosRequestConfig {
  checkResultSuccess?: boolean
  formatData?: boolean
  quiet?: boolean
}

const baseUrl = import.meta.env.BASE_API_URL || ''

// response异常拦截处理器
function responseErrorHandler(error: any) {
  const { data, status } = error.response
  if (status === 401)
    ElMessage.error('无权限, 请登录')
  // TODO 登录token处理，根据项目实际情况决定是否需注释
  // const userStore = useUserStore()
  // const token = saveLoginToken ? userStore.token : localAccessToken.get()
  // if (token) {
  //   userStore.logout().then(() => {
  //     setTimeout(() => {
  //       window.location.reload()
  //     }, 1500)
  //   })
  // }
  else
    ElMessage.error(data.error || '接口异常')

  return Promise.reject(error)
}

// request异常拦截处理器
function errorHandler(error: any) {
  // response 报错处理
  if (error.response)
    return responseErrorHandler(error)

  // 常见request报错处理
  if (error.message === 'Network Error')
    error.message = '网络异常'

  if (error.ElMessage.includes('timeout') || [504, 499, 'ECONNABORTED'].includes(error.code))
    error.message = '数据处理中，请稍后重试'

  ElMessage.error(error.message || '接口异常')

  return Promise.reject(error)
}

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
      // 如果 token 存在, 让每个请求携带自定义 token, 请根据实际情况自行修改
      if (token)
        config.headers[REQUEST_ACCESS_TOKEN_KEY] = token.includes('Bearer') ? token : `Bearer ${token}`
    }

    return config
  }, errorHandler)

  // response 拦截
  instance.interceptors.response.use((res) => {
    const status = Number(res.status) || 200

    if (status !== 200)
      return Promise.reject(res)

    const { data, config } = res as { data: any, config: RequestConfig }
    const { responseType = 'json', formatData = true } = config

    // 如果服务端统一http响应码都是200，返回数据中包含错误码等信息，则单独处理
    // 请求中手工指定checkResultSuccess为false时，不进行错误处理。用于部分接口比如图片上传, 返回接口里没有success字段
    // 当前后端返回格式为：http响应码都是200，数据包含错误码等信息
    // TODO: 根据项目后端接口实际情况自行处理
    // if (status === 200 && !data?.success && config?.checkResultSuccess) {
    //   const { error, message, code } = data || {}
    //   const errorMessage = error || message
    //   const newError: any = new Error(errorMessage)
    //   const currentStatus = Number(code)
    //   newError.response = {
    //     status: currentStatus,
    //     data: { status: currentStatus, error: errorMessage },
    //   }
    //   return config?.quiet ? Promise.reject(newError) : responseErrorHandler(newError)
    // }

    // 对json格式数据进行预处理，请求中手工指定formatData为false时不处理data返回值。
    // TODO: 根据后端接口实际情况自行处理
    if (responseType === 'json' && (formatData && isObject(data) && data !== null))
      return (data as any).data ?? (data as any)?.result ?? (data as any).res

    return data
  }, errorHandler)

  return instance
}

export default createRequest({
  baseURL: baseUrl,
  timeout: 10000, // 请求超时时间
  withCredentials: true, // 是否允许携带cookie
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Credentials': 'true',
  },
})

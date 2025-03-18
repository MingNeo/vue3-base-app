import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'

const apiUrl = import.meta.env.VITE_APP_BASE_URL

export interface FetchEventOption {
  url: string
  data?: any
  method?: string
  headers?: any
  signal?: AbortSignal
  beforeRequest?: () => void
  afterRequest?: () => void
  onMessage?: (e: any) => void
  isEnd?: (result: any) => boolean
}

export class RetriableError extends Error { }
export class NoAuthError extends Error { }
export class LoginError extends Error { }
export class FatalError extends Error { }
export class DoneState extends Error { }

export async function fetchEvent(
  {
    url,
    data,
    method = 'post',
    headers = {},
    onMessage,
    signal,
    isEnd = result => result.data?.is_end,
  }: FetchEventOption,
) {
  // const useStore = useUserStore()
  try {
    await fetchEventSource(`${apiUrl || ''}${url}`, {
      signal: signal as AbortSignal,
      method,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${useStore.token}`,
        'Authorization': getLoginToken(),
        ...headers,
      },
      body: JSON.stringify(data),
      async onopen(response: any) {
        if (response.ok && response.headers.get('content-type')?.includes(EventStreamContentType)) {
          // everything's good
        }
        else if (response.status === 401) {
          throw new LoginError('登录过期')
        }
        else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new FatalError()
        }
        else {
          const errorInfo = await response.json()

          if (errorInfo.error_code === 401) {
            throw new LoginError('登录过期')
          }
          console.warn('请求失败', errorInfo)
          throw new RetriableError(errorInfo?.data || '请求失败')
        }
      },
      onmessage(e: any) {
        const res = JSON.parse(e.data || '{}')

        if (res.error_code) {
          message.error(res.data?.error_msg || '生成出错了！')
        }

        // 请求结束
        if (isEnd(res))
          throw new DoneState(res)

        onMessage?.(res)
      },
      onclose() {
        const msg = '连接已关闭'
        throw new DoneState(msg)
      },
      onerror(error: any) {
        if (error instanceof LoginError)
          unLoginRedirect(error.message)
        if (!(error instanceof FatalError || error instanceof DoneState))
          console.warn('sse异常中断')
        throw error
      },
      openWhenHidden: true, // 回到页面时，不重新连接
    })
  }
  catch (error) {
    if (error instanceof DoneState) {
      return Promise.resolve(error.message)
    }
    if (error instanceof RetriableError) {
      return Promise.reject(error)
    }

    console.warn(error)

    return Promise.reject(error)
  }
}

import type { Ref, ShallowRef } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'
import { until } from '@vueuse/shared'

interface RequestReturn<T> {
  data: Ref<T | undefined>

  isFinished: Ref<boolean>

  isLoading: Ref<boolean>

  error: ShallowRef<unknown | undefined>
}

export interface UseRequestReturn<T> extends RequestReturn<T> {
  /**
   * 手工触发请求
   */
  execute: (...args: any) => Promise<T>
  then: PromiseLike<RequestReturn<T>>['then']
}

export interface UseRequestOptions<T = any> {
  /**
   * 加载后自动触发请求
   *
   * @default true
   */
  immediate?: boolean
  /**
   * 使用 shallowRef.
   *
   * @default true
   */
  shallow?: boolean
  onError?: (e: unknown) => void
  onSuccess?: (data: T) => void
}

/**
 * 请求composable，非全局性的、组件中的请求可使用此composable方便的使用loading等多种功能
 * @param fetchFn 请求方法
 * @param options 配置
 * @param options.immediate 加载后立即执行请求
 * @param options.shallow 使用 shallowRef
 * @param options.onError 错误回调
 * @param options.onSuccess 成功回调
 */
export default function useRequest<T = any>(fetchFn: (...args: any) => Promise<T>, options: UseRequestOptions<T> = {}): UseRequestReturn<T> {
  const { immediate = true, shallow = true, onSuccess, onError } = options || {}

  const data = shallow ? shallowRef<T>() : ref<T>()
  const isFinished = ref(false)
  const isLoading = ref(false)
  const error = shallowRef<unknown>()

  const loading = (loading: boolean) => {
    isLoading.value = loading
    isFinished.value = !loading
  }

  const execute: UseRequestReturn<T>['execute'] = async (...args) => {
    error.value = undefined
    loading(true)

    return new Promise((resolve, reject) => fetchFn(...args)
      .then((r) => {
        data.value = r
        onSuccess?.(r)
        resolve(r)
      })
      .catch((e: any) => {
        error.value = e
        onError?.(e)
        reject(e)
      })
      .finally(() => loading(false)))
  }

  if (immediate) {
    console.log('xxx', immediate);
    (execute as UseRequestReturn<T>['execute'])().then(undefined, console.error)
  }

  const waitUntilFinished = () =>
    new Promise<RequestReturn<T>>((resolve, reject) => {
      until(isFinished).toBe(true)
        .then(() => resolve({
          data,
          error,
          isFinished,
          isLoading,
        }))
        .catch(reject)
    })

  const then: PromiseLike<RequestReturn<T>>['then'] = (onFulfilled, onRejected) =>
    waitUntilFinished().then(onFulfilled, onRejected)

  return {
    data,
    error,
    isFinished,
    isLoading,
    execute,
    then,
  }
}

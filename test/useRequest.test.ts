import { describe, expect, it, vitest as jest } from 'vitest'
import { ref } from 'vue-demi'
import useRequest from '../src/composables/useRequest'

describe('useRequest', () => {
  it('初始状态及默认自动调用正常', async () => {
    // 创建一个mock的fetchFn函数，返回一个成功的Promise
    const fetchFn = jest.fn().mockResolvedValue('response data')

    // 调用useRequest函数，传入mock的fetchFn和默认选项
    const result = useRequest(fetchFn)

    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('isFinished')
    expect(result).toHaveProperty('isLoading')
    expect(result).toHaveProperty('error')
    expect(result).toHaveProperty('execute')
    expect(result).toHaveProperty('cancel')
    expect(result).toHaveProperty('then')

    // Check initial state
    expect(ref(result.isFinished).value).toBe(false)
    expect(ref(result.isLoading).value).toBe(true)
    expect(ref(result.error).value).toBeUndefined()

    await result.then()

    expect(fetchFn).toHaveBeenCalled()
    expect(ref(result.isFinished).value).toBe(true)
    expect(ref(result.isLoading).value).toBe(false)
    expect(ref(result.error).value).toBeUndefined()
    expect(result.data.value).toBe('response data')
  })

  // it('cancelPrevious配置通过', async () => {
  //   const fetchFn = jest.fn((count) => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve(`response data${count}`)
  //       }, 100)
  //     })
  //   })
  //   const result = useRequest(fetchFn, { cancelPrevious: true })
  //   result.execute(1)
  //   await result.execute(2)
  //   expect(result.data.value).toBe('response data2')
  //   expect(fetchFn).toHaveBeenCalledTimes(2)
  // })

  it('immediate配置通过', () => {
    // 创建一个mock的fetchFn函数，返回一个成功的Promise
    const fetchFn = jest.fn().mockResolvedValue('response data')

    // 调用useRequest函数，传入mock的fetchFn和immediate选项为false
    const result = useRequest(fetchFn, { immediate: false })

    expect(result.data.value).toBeUndefined()
    expect(fetchFn).toHaveBeenCalledTimes(0)
  })

  it('onSuccess调用通过', async () => {
    // 创建一个mock的fetchFn函数，返回一个成功的Promise
    const fetchFn = jest.fn().mockResolvedValue('response data')

    // 创建一个mock的onSuccess回调函数
    const onSuccess = jest.fn()

    // 调用useRequest函数，传入mock的fetchFn和onSuccess选项为mock的onSuccess函数
    const result = useRequest(fetchFn, { onSuccess })

    // 调用execute函数
    await result.execute()

    // 断言onSuccess函数被调用，并且参数为'response data'
    expect(onSuccess).toHaveBeenCalledWith('response data')
  })

  it('onError调用通过', async () => {
    // 创建一个mock的fetchFn函数，返回一个失败的Promise
    const fetchFn = jest.fn().mockRejectedValue(new Error('request error'))

    // 创建一个mock的onError回调函数
    const onError = jest.fn()

    // 调用useRequest函数，传入mock的fetchFn和onError选项为mock的onError函数
    const result = useRequest(fetchFn, { onError })

    try {
      // 调用execute函数，会抛出一个错误
      await result.execute()
    }
    catch (error) {
      // 断言onError函数被调用，并且参数为错误对象
      expect(onError).toHaveBeenCalledWith(error)
    }
  })

  it('请求abort报错处理正常', async () => {
    // 创建一个mock的fetchFn函数，返回一个Promise，但立即抛出一个AbortError
    const fetchFn = jest.fn().mockImplementation(() => {
      throw new DOMException('AbortError', 'AbortError')
    })

    // 调用useRequest函数，传入mock的fetchFn
    const result = useRequest(fetchFn)

    try {
      // 调用execute函数，会抛出一个AbortError
      await result.execute()
    }
    catch (error) {
      // 断言error的值为undefined
      expect(result.error.value).toBeUndefined()
    }
  })

  it('请求抛错处理正常', async () => {
    // 创建一个mock的fetchFn函数，返回一个抛出错误的Promise
    const fetchFn = jest.fn().mockRejectedValue(new Error('Request Error'))

    // 调用useRequest函数，传入mock的fetchFn和默认选项
    const result = useRequest(fetchFn)

    // 等待1秒钟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 断言error的值为抛出的错误
    expect(result.error.value).toEqual(new Error('Request Error'))
  })

  it('isLoading状态正常', async () => {
    // 创建一个mock的fetchFn函数，返回一个延迟1秒后resolve的Promise
    const fetchFn = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('response data'), 1000)))

    // 调用useRequest函数，传入mock的fetchFn和默认选项
    const result = useRequest(fetchFn)

    // 断言isLoading的值为true
    expect(result.isLoading.value).toBe(true)

    // 等待1秒钟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 断言isLoading的值为false
    expect(result.isLoading.value).toBe(false)
  })

  it('isFinished状态正常', async () => {
    // 创建一个mock的fetchFn函数，返回一个延迟1秒后resolve的Promise
    const fetchFn = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('response data'), 1000)))

    // 调用useRequest函数，传入mock的fetchFn和默认选项
    const result = useRequest(fetchFn)

    // 断言isFinished的值为false
    expect(result.isFinished.value).toBe(false)

    // 等待1秒钟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 断言isFinished的值为true
    expect(result.isFinished.value).toBe(true)
  })
})

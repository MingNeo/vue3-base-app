import { describe, expect, it, vitest } from 'vitest'
import useAsyncList from '../src/composables/useAsyncList'

// 使用 20 条记录模拟响应数据
const records = Array.from({ length: 20 }).map((_, index) => ({ id: index + 1, name: `Record ${index + 1}` }))
const mockService = vitest.fn(({ keyword }) => {
  const newData = records.filter(v => !keyword || v.name.includes(keyword))
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ total: newData.length, data: newData })
    }, 10)
  })
})

describe('useAsyncList', () => {
  it('can load data', async () => {
    // 使用模拟的服务和表单 ref 创建 hook 实例
    const { data, pagination, loading, fetchData } = useAsyncList(mockService, { immediate: false })

    // 验证初始状态是否正确
    expect(data.value).toEqual([])
    expect(pagination.value.current).toEqual(1)
    expect(pagination.value.pageSize).toEqual(10)
    expect(pagination.value.total).toEqual(0)
    expect(loading.value).toEqual(false)

    fetchData()
    await nextTick()
    expect(loading.value).toEqual(true)
    // 等待第一次获取完成
    await new Promise(resolve => setTimeout(resolve, 10))

    // 验证数据是否正确加载
    expect(data.value).toEqual(records)
    expect(pagination.value.total).toEqual(records.length)
    expect(loading.value).toEqual(false)
    expect(fetchData).toBeInstanceOf(Function)
  })

  it('search success', async () => {
    // 使用模拟的服务和表单 ref 创建 hook 实例
    const { data, pagination, loading, fetchData } = useAsyncList(mockService, { immediate: false, debounceTime: 0 })

    // 使用关键字搜索并验证数据是否正确过滤
    const keyword = '7'
    expect(loading.value).toEqual(false)
    fetchData({ keyword })
    await nextTick()
    expect(loading.value).toEqual(true)
    expect(mockService).toHaveBeenCalledWith({ pageNo: 1, pageSize: 10, keyword }, { signal: new AbortController().signal })
    // 等待请求完成
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(loading.value).toEqual(false)
    expect(data.value).toEqual([{ id: 7, name: 'Record 7' }, { id: 17, name: 'Record 17' }])
    expect(pagination.value.total).toEqual(2)
    expect(pagination.value.current).toEqual(1)

    // 等待请求完成
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(data.value).toEqual(records)
    expect(pagination.value.total).toEqual(records.length)
    expect(pagination.value.current).toEqual(1)

    // 切换到第二页并验证当前页是否更新为 2
    await pagination.value.onChange(2, 10)
    expect(pagination.value.current).toEqual(2)

    // 验证服务是否使用正确的参数进行调用
    expect(mockService).toHaveBeenCalledWith({ pageNo: 2, pageSize: 10 }, { signal: new AbortController().signal })
  })
})

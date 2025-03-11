import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import useRequest, { type UseRequestOptions } from '../useRequest'

export type UseAsyncListService = (...args: any) => Promise<any>
export interface UseAsyncListOptions extends UseRequestOptions {
  queryData?: Record<string, any> | Ref<Record<string, any>>
  defaultPageSize?: number
  debounceTime?: number
  getTotal?: (data: any) => number
  getList?: (data: any) => ListItemData[]
  rejectOnCancel?: boolean
}

export interface ListItemData {
  [key: string]: any
}

export default function useAsyncList(
  service: UseAsyncListService,
  {
    immediate = true,
    queryData = {},
    debounceTime = 100,
    getTotal = (data: any) => data?.total || 0,
    getList = (data: any) => data?.data || [],
    defaultPageSize = 10,
    rejectOnCancel = false,
    ...options
  }: UseAsyncListOptions = {},
) {
  const { isLoading, execute, error } = useRequest(service, { immediate: false, ...options })

  const searchData = computed(() => {
    const _queryData = { ...toRef(queryData).value }
    return { ..._queryData, pageNo: _queryData.pageNo || 1, pageSize: +(_queryData.pageSize || defaultPageSize) }
  })
  const total = ref(0)
  const dataList = ref<ListItemData[]>([])

  const fetchDataSimple = async (params?: Record<string, any>) => {
    await nextTick()
    const _data = await execute(params ?? { ...searchData.value })
    dataList.value = getList(_data)
    total.value = getTotal(_data)
  }

  const fetchData = useThrottleFn(fetchDataSimple, debounceTime, false, true, rejectOnCancel)

  const list = computed(() => dataList.value)

  onMounted(() => {
    if (immediate)
      fetchData()
  })

  const loadNextPage = async () => {
    if (isRef(queryData))
      (queryData as Ref<Record<string, any>>).value.pageNo += 1
    else
      queryData.pageNo += 1
    await nextTick()
    const _data = await execute(searchData.value)
    dataList.value = [...dataList.value, ...getList(_data)]
  }

  const pagination = computed(() => ({
    current: searchData.value.pageNo,
    pageSize: Number(searchData.value.pageSize),
    total: total.value,
    onChange: (pageNo: number, pageSize?: number) => {
      fetchData({ pageNo, pageSize: pageSize || searchData.value.pageSize })
    },
  }))

  const fetchNewData = async (params?: Record<string, any>) => {
    if (isRef(queryData))
      (queryData as Ref<Record<string, any>>).value.pageNo = 1
    else
      queryData.pageNo = 1
    await nextTick()
    fetchData(params ?? searchData.value)
  }

  return {
    data: list,
    loading: isLoading,
    error,
    pagination,
    fetchData, // 默认请求方法使用debounce处理
    fetchDataSimple, // 不进行debounce处理
    fetchNewData, // 根据新的查询条件请求
    loadNextPage, // 加载下一页，并自动合并
    reset: () => {
      if (isRef(queryData))
        (queryData as Ref<Record<string, any>>).value.pageNo = 1
      else
        queryData.pageNo = 1

      dataList.value = []
      total.value = 0
    },
  }
}

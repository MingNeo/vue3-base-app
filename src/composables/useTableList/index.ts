import { computed } from 'vue'
import type { Ref } from 'vue'
import { debounce } from 'lodash-es'
import useRequest from '../useRequest'

export type UseTableListService = (...args: any) => Promise<any>
export interface UseTableListOptions {
  form?: Ref<any>
  defaultSearchData?: Record<string, any>
  defaultPageSize?: number
  immediate?: boolean
  debounceTime?: number
  getTotal?: (data: any) => number
  getList?: (data: any) => ListItemData[]
  onReset?: () => any
  onSearchDataChange?: (value: any) => void
}

export interface ListItemData {
  [key: string]: any
}

const _dataHandlers = {
  getTotal: (data: any) => data?.value?.total || 0,
  getList: (data: any) => data?.value?.data || [],
}

export default function useTableList(
  service: UseTableListService,
  {
    form,
    immediate = true,
    defaultPageSize = 10,
    defaultSearchData = {},
    getTotal = _dataHandlers.getTotal,
    getList = _dataHandlers.getList,
    onReset = () => undefined,
    onSearchDataChange = (_value: any) => {},
    debounceTime = 100,
  }: UseTableListOptions = {},
) {
  const formRef = isRef(form) ? form : ref()

  // searchState用于存储搜索表单实时的数据
  const searchState = ref<Record<string, any>>({})
  // searchState用于存储请求所用的数据，仅触发搜索按钮或重置时会更新
  const searchData = ref<Record<string, any>>({ ...defaultSearchData, pageNo: defaultSearchData.pageNo || 1, pageSize: +(defaultSearchData.pageSize || defaultPageSize) })

  const updateSearchData = (value: Record<string, any>, merge = false) => {
    searchData.value = merge ? { ...searchData.value, ...value } : value
    onSearchDataChange?.(searchData.value)
  }

  const { data, isLoading, execute } = useRequest(service, { immediate: false })

  const total = computed(() => getTotal(data))
  const list = computed<ListItemData[]>(() => getList(data))

  const baseFetchData = (params?: Record<string, any>) => {
    return execute(params ?? { ...searchData.value })
  }

  const fetchDataSimple = async (params: Record<string, any> = {}, page = {}, merge = true) => {
    updateSearchData({ ...params, ...page }, merge)
    await nextTick()
    baseFetchData()
  }

  // 定义搜索函数
  const fetchData = debounce(fetchDataSimple, debounceTime, { leading: true, trailing: false })

  function bindFormState() {
    // 初始化时将搜索数据绑定到表单组件
    if (formRef) {
      Object.keys(searchData.value).forEach((key) => {
        try {
          if (!['pageNo', 'pageSize'].includes(key))
            formRef.value[key] = searchData.value[key]
        }
        catch (error) {
        }
      })
    }
  }

  bindFormState()

  onMounted(() => {
    if (immediate)
      fetchData()
  })

  const pagination = computed(() => ({
    current: searchData.value.pageNo,
    pageSize: Number(searchData.value.pageSize),
    total: total.value,
    onChange: (newPageNo: any, newPageSize: any) => fetchData({}, { pageNo: newPageNo, pageSize: newPageSize }),
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: number[]) => `${range[0]} - ${range[1]} 条 共 ${total} 条`,
  }))

  const onTableChange = (
    page: { pageSize: number; current: number },
    _filters: any,
    sorter: any,
  ) => {
    fetchData({ sortBy: sorter.field, sortType: sorter.order }, { pageNo: page.current, pageSize: page.pageSize })
  }

  // 如果操作失败后无需返回值、无需别的处理，可以使用此方法包裹简化处理
  const wrapperAction = (service: (...args: any[]) => any) => async (...args: any[]) => {
    await service(...args)
    baseFetchData()
  }

  return {
    searchFormRef: formRef,
    dataSource: list,
    searchState,
    searchData,
    loading: isLoading,
    pagination,
    fetchData, // 默认请求方法使用debounce处理
    fetchDataSimple, // 不进行debounce处理
    onTableChange,
    wrapperAction,
    search: {
      submit: (params: any = {}) => {
        return fetchData(params, { pageNo: 1 })
      },
      reset: () => {
        formRef?.value?.resetFields?.()
        const params = onReset?.()
        updateSearchData({ pageSize: +searchData.value.pageSize, pageNo: 1, ...params })
        fetchData(searchData.value)
      },
    },
  }
}

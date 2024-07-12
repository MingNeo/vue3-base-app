interface IParams {
  // 默认参数
  defaultQuery?: Record<string, any>
  // 数组类型的key
  arrayKeys?: string[]
  numberKeys?: string[]
}

const defaultNumberKeys = ['pageSize', 'pageNo']

/**
 * query 的改动暂不支持 query.key = value 这种形式，请使用 query = { key: value } 或者 query = { ...query, key: value } 这种形式
 */
export default function useQuery({ defaultQuery = {}, arrayKeys = [], numberKeys = [] }: IParams = {}) {
  const router = useRouter()
  const route = useRoute()

  const query = computed<Record<string, any>>({
    get() {
      const routeQuery: any = { ...(route?.query || {}) }
      Object.keys(routeQuery).forEach((key: string) => {
        // 以~开头的value自动转为数组
        if (typeof routeQuery[key] === 'string' && routeQuery[key].indexOf('~') === 0)
          routeQuery[key] = [routeQuery[key].replace('~', '')]
        // 处理number类型key
        if ([...defaultNumberKeys, ...numberKeys].includes(key))
          routeQuery[key] = Array.isArray(routeQuery[key]) ? routeQuery[key].map((item: any) => Number(item)) : Number(routeQuery[key])
        // 处理数组类型key
        if (arrayKeys.includes(key) && !Array.isArray(routeQuery[key]))
          routeQuery[key] = [routeQuery[key]]
      })

      return Object.assign({}, defaultQuery, routeQuery)
    },
    set(value) {
      const newVal = { ...(value || {}) }
      // 如果数据是单条数据的数组，转为~开头的字符串
      for (const [key, val] of Object.entries(newVal)) {
        if (Array.isArray(val) && val.length === 1 && val[0]?.indexOf?.('~') !== 0)
          newVal[key] = [`~${val[0]}`]
      }
      router?.replace({ query: newVal })
    },
  })

  return query
}

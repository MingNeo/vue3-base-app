## useAsyncList

用于管理包含分页和搜索功能的列表数据。

### 使用方法

``` html
<script setup>
import useAsyncList from '@/composables/useAsyncList'

async function fetchData (params) {
  return { data, total }
}

const queryData = ref({
  name: '',
})

const { data, loading, pagination, fetchNewData } = useAsyncList(fetchData, { queryData })
</script>

<template>
  <!-- 伪代码示例，fetchNewData可传入新的查询条件，也可不传，不传则使用queryData的值 -->
  <Filter v-model="queryData" @submit="fetchNewData" />
  <Table
    :columns="columns"
    :data="data"
    :loading="loading"
    :pagination="pagination"
  />
</template>
```

### API

``` ts
const { data, loading, pagination, fetchNewData, loadNextPage } = useAsyncList(service, options)
```

#### Options
| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| queryData | `Record<string, any> \| Ref<Record<string, any>>` | {} | 默认的搜索数据 |
| immediate | boolean | true | 是否在加载时立即获取数据 |
| getTotal | `(data: any) => number` \| `data => data?.total` | 定义如何获取请求返回列表数据的total |
| getList | `(data: any) => any[]` \| `data => data?.data || []` | 定义如何获取请求返回列表数据的total |
| defaultPageSize | number | 10 | 默认每页显示的行数, 如果queryData里不含，则会自动使用该值 |

#### 返回值

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| data | computed<ListData[]> | 当前数据 |
| fetchData | function | 请求并覆盖更新数据  |
| fetchNewData | function | 同fetchData，但强制页面为第1页，很适合query变化了重新请求 |
| loadNextPage | function | 用于加载下一页，并自动追加数据，而非覆盖 |
| loading | boolean | 表示数据是否正在加载 |
| pagination.current | number | 当前页码 |
| pagination.pageSize | number | 每页显示的行数 |
| pagination.total | number | 数据总数 |
| pagination.onChange | function | 当页码改变时的回调函数 |

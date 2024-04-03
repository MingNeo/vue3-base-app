## useTableList

这是一个自定义 Hook，可用于管理包含分页和搜索功能的列表数据。使用 Vue3 的 Composition API 实现。

### 使用方法
需要用到searchFormRef及searchState，searchState也可自己定义，关联form model即可，无需传给该hook
``` html
<script setup>
import useTableList from '~/composables/useTableList'

const {
  searchFormRef,
  searchState,
  dataSource,
  loading,
  pagination,
  search: { submit, reset },
} = useTableList(fetchData, {
  form: formRef,
  immediate: true,
})
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      :model="searchState"
      name="advanced_search"
      class="search-form"
      @finish="search.submit"
    >
      <el-form-item name="name" label="姓名">
        <el-input v-model:value="searchState.name" placeholder="placeholder" />
      </el-form-item>
      <el-button type="primary" html-type="submit">
        搜索
      </el-button>
    </el-form>
    <el-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
    />
  </div>
</template>
```
#### 排序
```vue
<script setup>
import useTableList from '~/composables/useTableList'

const {
  dataSource,
  loading,
  pagination,
  searchData,
  search: { submit, reset },
  onTableChange // 排序需要使用onTableChange
} = useTableList(fetchData)

const searchFields = [/** ... */]
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    sorter: true // 配置sorter
  },
]
</script>

<template>
  <div>
    <SearchForm :fields="searchFields" :search="search" :default-value="searchData" />
    <common-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      @change="onTableChange"
    />
  </div>
</template>
```

### API

| 参数 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| service | function |  | 用于获取表格数据的异步函数 |
| options | object |  | 可选的配置选项 |
| options.form | - |  | form表单实例, 如不传则自动生成 |
| options.defaultSearchData | object | {} | 默认的搜索数据 |
| options.defaultPageSize | number | 10 | 默认每页显示的行数 |
| options.immediate | boolean | true | 是否在加载时立即获取数据 |
| options.getTotal | (data: any) => number | (data: any) => data?.value?.total | 定义如何获取请求返回列表数据的total |
| options.getList | (data: any) => any[] | (data: any) => data?.value?.data || [] | 定义如何获取请求返回列表数据的total |
| options.onReset | () => any | | 自定义清空处理 |

### 返回值

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| searchState | computed<Record<string, any>> | 当前页搜索表单state，可选 |
| dataSource | computed<ListData[]> | 当前页表格数据源 |
| fetchData | Function | 用于手工再触发刷新, 如需重置请求参数并请求可直接调用search.reset |
| loading | boolean | 表示数据是否正在加载 |
| onTableChange | (page: { pageSize: number; current: number; }, _filters: any, sorter: any) => void | 列表页change, 见antdv，通常只有在需要排序时需要用到 |
| pagination.current | number | 当前页码 |
| pagination.pageSize | number | 每页显示的行数 |
| pagination.total | number | 数据总数 |
| pagination.onChange | function | 当页码改变时的回调函数 |
| search.submit | function | 用于提交搜索表单的函数 |
| search.reset | function | 用于重置搜索表单的函数 |
| searchFormRef | ref | 当前搜索表单ref，如果使用SearchForm组件或自行在onReset中处理表单重置操作，则可不使用 |

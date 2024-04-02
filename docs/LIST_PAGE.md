# 如何快速编写一个列表页

1. 页面使用common-page-container 组件统一样式
2. 顶部搜索框, 使用common-search-form组件
3. 列表页主体使用common-list-page-content, 如果需要右上角配置按钮，使用actions
4. 分页表格使用common-table, 行操作按钮在actions列配置，如果需要排序等参见组件具体文档
5. 使用useTableList或useTablePage(url请求参数)自动管理搜索条件、分页请求、loading等。

```vue
<script lang="ts" setup>
import { deleteRegion, getRegionList } from '~/api/xxx'

const { dataSource, search, loading, pagination, fetchData, searchData } = useTablePage(getRegionList)

const searchFields = [{
  label: '名称',
  name: 'regionName',
  type: 'input',
}, {
  label: '国家代码',
  name: 'regionCode',
  type: 'number',
}, {
  label: '别名',
  name: 'regionAlias',
},
{
  label: '区号',
  name: 'areaCode',
}, {
  label: '性别',
  name: 'gender',
  type: 'select',
  fieldProps: {
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
}]

const columns = [
  {
    title: '编码',
    dataIndex: 'regionCode',
    key: 'regionCode',
  },
  {
    title: '名称',
    dataIndex: 'regionName',
    key: 'regionName',
  },
  {
    title: '简称',
    dataIndex: 'regionShortName',
    key: 'regionShortName',
  },
  {
    title: '别名',
    dataIndex: 'regionAlias',
    key: 'regionAlias',
  },
  {
    title: '时区',
    dataIndex: 'timeZone',
    key: 'timeZone',
  },
  {
    title: '语言',
    key: 'regionLanguage',
    dataIndex: 'regionLanguage',
  },
  {
    title: '币种',
    key: 'currency.currencyName',
    dataIndex: 'currency.currencyName',
  },
  {
    title: '操作',
    key: 'actions',
    dataIndex: 'actions',
    width: 150,
    // 如复杂情况，actions可以是一个函数：(record: Record<string, any>, column: Record<string, any>) => Action[]
    actions: [
      {
        text: '详情',
        onClick: (record: any, column: any) => {
          router.push({ path: '/xxx/detail', query: { id: record.id, viewMode: 'true' } })
        },
      },
      {
        text: '编辑',
        onClick: (record: any, column: any) => {
          router.push({ path: '/xxx/detail', query: { id: record.id } })
        },
        // 配置按钮显示隐藏
        hidden: (record: any) => record.status !== 'enabled',
        // 配置按钮权限
        permission: ['xxx:edit'],
      },
      {
        text: '删除',
        onClick: async (record: any) => {
          await deleteRegion(record.id)
          fetchData()
        },
        confirm: true,
        confirmText: '请确认是否删除？',
      }
    ],
  },
]

function handleCreate() {
  router.push({ path: '/xxx/detail' })
}

const actions = [{
  text: '新增',
  onClick: handleCreate,
  type: 'primary',
  icon: 'plus',
}]
</script>

<template>
  <commonpage-container>
    <common-search-form :fields="searchFields" :search="search" :default-value="searchData" />
    <common-list-page-content title="国家(地区)管理" :actions="actions">
      <common-table
        :columns="columns" :data-source="dataSource" class="w-100%" :loading="loading"
        :pagination="pagination"
      />
    </common-list-page-content>
  </commonpage-container>
</template>```

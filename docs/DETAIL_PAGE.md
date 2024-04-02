# 如何快速编写一个详情页： 

1. 页面使用common-page-detail组件统一样式, 包含顶部导航及下面content和footer
2. 通过配置fields直接生成简单表单页面。通过useDetailPage维护请求、数据等操作
3. 复杂页面可通过slot自定义，并可通过v-model:formState管理表单状态


``` vue
<script setup>
import { createRegion, getRegionInfoById, updateRegion } from '~/api/basicConfig/region'
import useDetailPage from '@/composables/useDetailPage'

const { data, loading, onOk } = useDetailPage(getRegionInfoById)

const detailFields = computed(() => [
  {
    label: '编码',
    name: 'regionCode',
    required: true,
  },
  {
    label: '名称',
    name: 'regionName',
  },
  {
    label: '简称',
    name: 'regionShortName',
  },
  {
    label: '别名',
    name: 'regionAlias',
  },
  {
    label: '时区',
    name: 'timeZone',
  },
  {
    label: '语言',
    name: 'regionLanguage',
  },
  {
    label: '币种',
    name: 'currency.currencyName',
  },
])
</script>

<template>
  <common-page-detail
    :loading="loading"
    :view-mode="viewMode"
    :default-value="data"
    :fields="detailFields"
    title="国家(地区)"
    :create-service="createRegion"
    :update-service="updateRegion"
    @ok="onOk"
  />
</template>
```
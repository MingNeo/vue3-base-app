# 如何快速编写一个详情弹窗： 

### 方式一：使用[common-modal-detail组件](../src/components/common/ModalDetail/README.md)
自动管理新建表单、编辑表单、详情

``` vue
<script setup>
import { createRegion, updateRegion } from '~/api/basicConfig/region'
const detailFields = computed(() => [
  {
    label: '币种',
    name: 'currencyName',
    required: true,
  },
  {
    label: '符号',
    name: 'currencySymbol',
  },
  {
    label: '单位',
    name: 'prefixPrice',
  },
  {
    label: '简码',
    name: 'currencyShortName',
  },
])

const modalInfo = ref({ visible: false, viewMode: false, data: {} })

function formatData(record: any) {
  return {
    id: record.id,
    currencySymbol: record.currencySymbol,
    currencyName: record.currencyName,
    currencyShortName: record.currencyShortName,
    prefixAmount: record.prefixAmount,
  }
}

// 列表页上的行操作按钮
function handleShowDetail(record, column) {
  modalInfo.value = { visible: true, viewMode: true, data: formatData(record) }
}

// 列表页上的行操作按钮
function handleEdit(record, column) {
  modalInfo.value = { visible: true, viewMode: false, data: formatData(record) }
}

// 点击提交时，根据类型自动调用createService、updateService，并触发该事件
function onSubmit() {
  // 新增、更新后，触发列表页的数据刷新
  !modalInfo.value.viewMode && refreshPageList()
}
</script>

<template>
  <common-modal-detail
    :key="modalInfo.data?.id"
    v-model:visible="modalInfo.visible"
    :default-value="modalInfo.data"
    :view-mode="modalInfo.viewMode"
    :fields="detailFields"
    title="货币"
    :width="700"
    :create-service="createRegion"
    :update-service="updateRegion"
    @ok="onSubmit"
  />
</template>
```

### 方式二：使用[common-modal-form组件](../src/components/common/ModalForm/README.md)
自行管理提交、创建等
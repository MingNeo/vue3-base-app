# ModalForm
动态生成简单模态框表单及详情弹窗

<demo src="./demos/demo1.vue" />

# 使用方法

下面是一个使用ModalForm组件的示例代码：

```html
<script lang="ts" setup>
const visible = ref(false)

const fields = [
  {
    name: 'name',
    label: 'Name',
    required: true
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    rules: [{ required: true }],
  },
  {
    name: 'address',
    label: 'Address',
    type: 'textarea',
    rules: [{ required: true }],
  },
]

const formData = reactive({
  name: '',
  age: '',
  address: '',
})

function handleCancel() {
  visible.value = false
}

function handleSubmit(value: any) {
  console.log(value)
}
</script>

<template>
  <common-modal-form
    v-model:visible="visible"
    :fields="fields"
    :default-value="formData"
    @update:visible="handleCancel"
    @ok="handleSubmit"
  />
</template>
```

### 表单state
通常情况下，简单无联动的表单弹窗并不需要获取表单实时填写的formState，仅需对点击提交时通过@ok获取的formData进行处理即可。

但对于需要联动或其他需要获取实时填写的表单数据的特殊情况，则有以下几种方法获取表单实时的formState

1、不传入form-state，即ModalForm自行维护表单，仅通过defaultValue等设置默认值，可通过ref获取实时formState。
```vue
<script lang="ts" setup>
const modalFormRef = ref(null)

// 表单数据：modalFormRef.value.formState
</script>

<template>
  <common-modal-form
    ref="modalFormRef"
    v-model:visible="showModal"
    ...
  />
</template>
```

2、使用v-model:form-state定义并绑定表单数据，直接使用formState即可。
```vue
<script lang="ts" setup>
const formState = reactive({
  name: '',
  age: '',
  address: '',
})
</script>

<template>
  <common-modal-form
    v-model:visible="showModal"
    v-model:form-state="formState"
    ...
  />
</template>
```

## 组件属性

### Props

| 属性名         | 类型| 默认值 | 是否必填 | 描述|
| -------------- | ---------------------------------------- | ------ | -------- | ------------------------------------------------------------ |
| title        | string                                 |    | 否       | 模态框的标题                                                 |
| ref          | { formState: Record<string,any> }        |    | 否      | 可通过ref获取弹窗的表单                                       |
| width        | number                                 | 520  | 否       | 宽度                                                         |
| visible      | boolean                                |        | 是       | 控制模态框是否显示                                           |
| defaultValue | any                                    |  | 否       | 表单默认值，变化时会更新表单数据，但表单数据变化不会影响原始传入值 |
| v-model:formState | Record<string, any> |        | 否       | 表单数据，如果需要使用表单数据，可以绑定formState，使用该值时defaultValue无效 |
| viewMode     | boolean                                | false| 否       | 是否为只读模式，如果为true，则不能提交表单，不会调用服务等操作 |
| idKey        | string                                 | "id" | 否       | 提交更新或者创建服务时，作为主键的字段名                       |
| fields       | `<{ name: string; label: string; ... }>[]` |        | 是  | [表单字段列表。具体格式见FormItemsBuilder](../FormItemsBuilder/README.md) |
| column       | number                                 | 1    | 否       | 每行展示的列数                                               |
| namePrefix   | (string | number)[]                                  | []   | 否       | 表单字段的名称前缀 |
| formItemProps| Record<string, any>                    | {}   | 否       | 表单元素选项                                                 |

### Events

| 事件名        | 回调参数  | 描述                                                  |
| ------------- | --------- | ----------------------------------------------------- |
| update:visible | `(visbile: Boolean) => void` | 控制模态框是否显示的事件 |
| ok            | `(formValues: Record<string, any>) => void` | 点击模态框确认按钮后触发的事件 |
| formChange | `(formValues: Record<string, any>) => void` | 表单state变动时触发 |

## 联动
参见 [FormItemsBuilder](../FormItemsBuilder/README.md)

```html
<script lang="ts" setup>
const data = reactive({
  name: '22',
  gender: 'female',
})

const fields = computed(() => [
  {
    label: '姓名',
    name: 'name',
    type: 'input',
    required: true,
    // 数据联动方式1: 使用onChange
    onChange: ({ value }: any) => {
      data.name = value
    },
  },
  {
    label: '性别',
    name: 'gender',
    type: 'select',
    fieldProps: {
      // 数据联动方式2: 使用fieldProps直接设置value值
      value: data.name,
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
      disabled: data.name === 'admin',
    },
  },
  {
    label: '创建时间',
    name: 'createAt',
    type: 'rangePicker',
    col: { span: 16 },
    // field联动
    hidden: data.name === 'admin'
  },
])

// 数据联动方式3: 使用watch更新
watch(data.name, name => name === '张三' && (data.gender = 'male'))
</script>

<template>
  <common-modal-form
    :key="data?.id"
    v-model:visible="modalInfo.visible"
    v-model:form-state="data"
    :view-mode="modalInfo.viewMode"
    :fields="detailFields"
    title="用户"
    :width="700"
    @ok="onEditSubmit"
  />
</template>
```

## Slot

ModalForm组件提供了几个默认插槽`<slot />`，用于显示在模态框内容区域中。

下面是示例代码：

```html
<template>
  <ModalForm v-model:visible="showModal" :fields="fields" v-model:formState="data">
    <template #header>
      <!-- 这里用在表单内容顶部 -->
    </template>

    <template #extra>
      <!-- 这里用在表单内容底部 -->
    </template>

    <template #default="{ data, onChange, formRef }">
      <!-- 如果不使用内置的formItemsBuilder或者希望使用多个，可以在这里自定义，data为表单数据，数据变更后需手工触发onChange -->
        <common-form-items-builder
          :model-value="data"
          :column="props.column || 2"
          :view-mode="props.viewMode"
          :fields="props.fields"
          :form-item-options="props.formItemProps"
          :update-model-value="onChange"
        />
    </template>
  </ModalForm>
</template>
```

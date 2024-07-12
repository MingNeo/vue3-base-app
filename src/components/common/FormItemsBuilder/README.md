---
title: FormItemsBuilder 表单生成器
meta:
  - name: description
---
# FormItemsBuilder

## 简介
一个简单的表单生成器。它接收一组字段定义，根据定义生成表单元素，并使其易于访问。

<demo src="./demos/demo1.vue" />
<br />
<demo src="./demos/demo2.vue" />
<br />
<demo src="./demos/demo3.vue" />
<br />
<demo src="./demos/demo4.vue" />

## 使用方法

基础使用
FormItemsBuilder只生成fields，需自己套用el-form
```html
<script lang="ts" setup>
const data = ref({
  name: '22',
  gender: 'female',
})

const fields = ref([
  {
    label: '姓名',
    name: 'name',
    type: 'input',
    required: true,
    formItemProps: {
      hasFeedback: true,
    },
  },
  {
    label: '性别',
    name: 'gender',
    type: 'select',
    fieldProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
    on: {
      change: (...args) => console.log(args),
    },
  }
])
</script>

<template>
  <el-form ref="formRef" :model="data">
    <FormItemsBuilder v-model="data" :column="3" :fields="fields" />
  </el-form>
</template>
```
### 自由组合
FormItemsBuilder只生成fields，因此具有极大的灵活性。可以生成任意数量的fields，并自由组合。
```html
<script setup>
import FormItemsBuilder from '@/components/common/FormItemsBuilder/index.vue'
import CountrySelectorField from '@/components/common/FormItemsBuilder/demos/CountrySelectorField.vue'

const data = ref({
  name: 'klose',
  age: 12,
  country: '',
})

const fields = ref([
  {
    label: '姓名',
    name: 'name',
    type: 'input',
    required: true,
  },
  {
    label: '年龄',
    name: 'age',
    type: 'number',
  }
])

const fields2 = ref([{
  label: '国家',
  name: 'country',
  type: 'component',
  component: CountrySelectorField,
}])
</script>

<template>
  <el-form ref="formRef" :model="data">
    <FormItemsBuilder v-model="data" :column="3" :fields="fields" />
    <h3>哈哈哈哈哈哈</h3>
    <FormItemsBuilder v-model="data" :column="3" :fields="fields2" />
    <el-button type="primary" html-type="submit">
      submit
    </el-button>
  </el-form>
</template>
```

下面是一个form格式为数组的表单的例子。
为了让form能正常区分多行数据，正确进行校验，需要配置name-prefix。
```html
<script setup>
import FormItemsBuilder from '@/components/common/FormItemsBuilder/index.vue'
import CountrySelectorField from '@/components/common/FormItemsBuilder/demos/CountrySelectorField.vue'

const data = ref({
  users: [{
    name: 'klose',
    age: 12,
    country: '',
  }, {}]
})

const fields = ref([
  {
    label: '姓名',
    name: 'name',
    type: 'input',
    required: true,
  },
  {
    label: '年龄',
    name: 'age',
    type: 'number',
  }
])

const fields2 = ref([{
  label: '国家',
  name: 'country',
  type: 'component',
  component: CountrySelectorField,
}])
</script>

<template>
  <el-form ref="formRef" :model="data">
    <FormItemsBuilder v-model="data.users[0]" :name-prefix="['users', 0]" :column="3" :fields="fields" />
    <h3>哈哈哈哈哈哈</h3>
    <FormItemsBuilder v-model="data.users[1]" :name-prefix="['users', 1]" :column="3" :fields="fields" />
    <el-button type="primary" @click="submit">
      submit
    </el-button>
  </el-form>
</template>
```
### 联动
#### 1、vue方式处理联动
将fields的定义从直接使用数组改为使用computed，即可进行fields联动。

数据的联动则可使用watch监听数据变化、使用onChange等
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
    // field联动，computed中直接进行判断
    hidden: data.name === 'admin'
  },
])

// 数据联动方式3: 使用watch更新
watch(data.name, name => name === '张三' && (data.gender = 'male'))
</script>

<template>
  <common-form-items-builder v-model="data" :fields="fields" />
</template>
```

#### 配置处理联动
如果你仅需要数据类的联动，或使用基于formItemsBuilder封装的上层组件没有暴露formState等，可以使用配置式联动。
配置式联动有局限性，仅能控制field是否显示及数据的变更。而无法直接联动fieldProps、formItemProps等配置。当然，你可以自定义一个变量，同时用onChange事件更新变量值的方式，结合computed来处理fieldProps、formItemProps等配置的联动。

```ts
const fields = [{
  label: '表单项类型',
  name: 'type',
  type: 'select',
  required: true,
  fieldProps: {
    options: [
      { label: '单选', value: 'select' },
      { label: '数字', value: 'number' },
      { label: '文本', value: 'input' },
      { label: '多选', value: 'checkbox' },
    ],
  },
  // 当前值变动时更新表单中的其他值
  onChange: ({ value, formState }) => {
    formState.value.enum = value
  },
}, {
  label: '枚举值',
  name: 'enum',
  type: 'component',
  component: TableField,
  column: 1,
  // hidden使用函数，来进行联动
  hidden: (formValues: any) => !['select', 'checkbox'].includes(formValues.type),
  fieldProps: {
    columns: [{ title: '枚举值选项名称', key: 'value', dataIndex: 'value', name: 'value' }],
  },
}]
```

## API清单
在上面的示例代码中，我们将FormItemsBuilder作为一个自定义组件来使用，并传递必要的props和v-model绑定。
该组件支持以下属性：

| 属性 | 类型 | 默认值 | 是否必须 | 描述 |
|------|-----|-------|---------|-------|
| fields | Field[] | [] | 是 | 定义每个表单元素的数组。|
| modelValue | `Record<string, any>` | {} | 否 | 组件的双向绑定值。可以直接使用v-model|
| namePrefix | `(string \| number)[]` | [] | 否 | 如果每个字段都有一个前缀，则传入这个数组, 如希望field的值是formData.users[0].xxx， 则可传入['users', 0] |
| column | Number | 3 | 否 | 每行显示多少个表单元素。|
| mode | String | edit | 否 | 使用组件的模式。`edit`表示编辑，`view`表示查看。|
| formItemProps | `Record<string, any>` | - | 否 | 全局统一FormItem的配置, 如果在column中配置，则会进行浅合并 |

#### Field
每个表单元素的定义。

| 属性 | 类型 | 描述 |
|------|-----|---------|
| name | String | 字段名称,使用v-model绑定 |
| label | String | 表单元素的标签文本 |
| type | String | 表单元素的类型。现在支持`input`, `select`, `radio`, `checkbox`, `datePicker`, `rate`, `rangePicker`, `timePicker`, `cascader`, `slider`, `switch`, `treeSelect`, `number`, `text` 及 `component`. |
| required | Boolean | 是否为必填项 |
| rules | Rule[] | 自定义验证规则，数组中包含每条规则的对象。如未指定，默认值为生成的基本验证规则。见Element-plus Form |
| fieldProps | `Record<string, any>` | Field 组件自身的配置项如`options`等,见Element-plus 各Form Field |
| formItemProps | `Record<string, any>` | FormItem的配置, 见Element-plus Form.Item |
| hidden | Boolean \| (formState: FormState) => Boolean | 是否隐藏，可直接配置变量或通过函数处理 |
| on | `Record<string, (...args: any[]) => void>` | field事件 |
| customRender | `(text: any, item: Field, formState: Record<string, any>) => string` | 自定义渲染文本，仅viewMode模式下或text field可用。复杂情况下请使用component类型并自定义Field |
| valueKey | string | 指定value字段名，用于component类型，一般field是'value', 但如嵌入table等特殊组件时，可以指定为'dataSource'等 |
| row | Object | 见Element-plus Row组件 |
| col | Object | 见Element-plus Col组件, 如果设置了col，则不遵循全局的column，由该field配置控制field显示的宽度 |
| col.span | number | 栅格占位格数, 总栈格数24，如默认三列的表单中，希望单个field占两列，则设置{ col: { span: 16 } } |

#### 自定义事件：

| 事件名 | 触发条件 |
|--------|----------|
| update:modelValue | 表单变更时触发 |
| change | 表单变更时触发 |

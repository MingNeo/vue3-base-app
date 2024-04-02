<script setup>
import FormItemsBuilder from '~/components/common/FormItemsBuilder/index.vue'
import CountrySelectorField from '~/components/common/FormItemsBuilder/demos/CountrySelectorField.vue'

const data = ref({
  name: '',
  gender: 'female',
  phone: '',
})

const treeData = ref([
  {
    title: '部门1',
    value: '0-0',
    children: [
      {
        title: '部门1-1',
        value: '0-0-0',
      },
    ],
  },
  {
    title: '部门2',
    value: '0-1',

    children: [
      {
        title: '部门2-1',
        value: '0-1-0',
        disabled: true,
      },
      {
        title: '部门2-2',
        value: '0-1-1',
      },
      {
        title: '部门2-3',
        value: '0-1-2',
      },
    ],
  },
])

const formItemProps = {
  labelCol: { style: { width: '60px' }, labelAlign: 'left' },
}

const isViewMode = ref(false)

const fields = computed(() => [
  {
    label: '姓名',
    name: 'name',
    type: 'input',
    required: true,
    formItemProps: {
      hasFeedback: !isViewMode.value,
    },
  },
  {
    label: '年龄',
    name: 'age',
    type: 'number',
    column: 3,
  },
  {
    label: '电话',
    name: 'phone',
    type: 'input',
    column: 3,
    rules: [{
      pattern: PHONE_NUMBER_REGEX,
      message: '请输入正确的电话号码',
    }, {
      required: true,
      message: '请输入电话号码',
    }],
  },
  {
    label: '性别',
    name: 'gender',
    type: 'select',
    column: 3,
    fieldProps: {
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
      disabled: data.value.phone === '133',
    },
    on: {
      // eslint-disable-next-line no-console
      change: (...args) => console.log(args),
    },
  },
  {
    label: '注册时间',
    name: 'createAt',
    type: 'datePicker',
  },
  {
    label: '部门',
    name: 'tree',
    type: 'treeSelect',
    fieldProps: {
      treeData: treeData.value,
      treeCheckable: true,
      allowClear: true,
      showCheckedStrategy: 'SHOW_PARENT',
    },
  },
  {
    label: '国家',
    name: 'country',
    type: 'component',
    component: CountrySelectorField,
  },
])

function toggleMode() {
  isViewMode.value = !isViewMode.value
}
</script>

<template>
  <el-card title="基础表单">
    <p>
      {{ JSON.stringify(data) }}
    </p>
    <a class="block" @click="toggleMode">
      {{ !isViewMode ? '改为查看模式' : '改为编辑模式' }}
    </a>
    <el-form ref="formRef" :model="data">
      <FormItemsBuilder v-model="data" :column="1" :view-mode="isViewMode" :fields="fields" :form-item-options="formItemProps" />
      <el-button class="m-t-10px" type="primary" html-type="submit">
        submit
      </el-button>
    </el-form>
  </el-card>
</template>

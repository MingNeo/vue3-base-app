<script lang="ts" setup>
const showModal = ref(false)

const fields = [
  {
    name: 'name',
    label: '用户名',
    required: true,
  },
  {
    name: 'age',
    label: '年龄',
    type: 'number',
    required: true,
  },
  {
    name: 'address',
    label: '地址',
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
  showModal.value = false
}

function handleSubmit(value: any) {
  // eslint-disable-next-line no-console
  console.log(value)
  showModal.value = false
}
</script>

<template>
  <el-button @click="showModal = true">
    创建用户
  </el-button>
  <common-modal-form
    v-model:visible="showModal"
    title="创建用户"
    :fields="fields"
    :default-value="formData"
    @update:visible="handleCancel"
    @ok="handleSubmit"
  />
</template>

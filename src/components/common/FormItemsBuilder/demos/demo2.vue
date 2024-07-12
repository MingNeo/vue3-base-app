<script setup>
import FormItemsBuilder from '@/components/common/FormItemsBuilder/index.vue'

const data = ref({
  users: [{
    name: '',
    gender: 'female',
    phone: '13222222222',
  }],
})

const fields = computed(() => [
  {
    label: '姓名',
    name: 'name',
    type: 'input',
    required: true,
  },
  {
    label: '电话',
    name: 'phone',
    type: 'input',
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
      disabled: data.value.users[0].phone === '133',
    },
  },
])

const viewMode = ref(false)

function toggleMode() {
  viewMode.value = !viewMode.value
}

function removeUser(index) {
  data.value.users.splice(index, 1)
}

function addUser() {
  data.value.users.push({})
}
</script>

<template>
  <el-card title="动态多行表单">
    <p>
      {{ JSON.stringify(data) }}
    </p>
    <a class="inline-block mb-[10px]" @click="toggleMode">
      {{ !viewMode ? '改为查看模式' : '改为编辑模式' }}
    </a>

    <el-form :model="data">
      <div
        v-for="(user, index) in data.users"
        :key="index"
        class="flex mb-2"
      >
        <FormItemsBuilder
          v-model="data.users[index]" class="flex-1" :name-prefix="['users', index]" :column="3" :view-mode="viewMode" :fields="fields"
        />
        <a v-if="!viewMode" class="ml-[20px] h-[32px] leading-[32px]" @click="removeUser(index)">delete</a>
      </div>
      <el-button v-if="!viewMode" type="dashed" block @click="addUser">
        Add
      </el-button>
      <el-button v-if="!viewMode" type="primary" html-type="submit">
        submit
      </el-button>
    </el-form>
  </el-card>
</template>

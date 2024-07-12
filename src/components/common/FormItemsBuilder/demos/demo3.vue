<script setup>
import FormItemsBuilder from '@/components/common/FormItemsBuilder/index.vue'
import CountrySelectorField from '@/components/common/FormItemsBuilder/demos/CountrySelectorField.vue'
import useSteps from '@/composables/useSteps'

const formRef = ref()

const data = ref({
  name: '',
  gender: '',
  phone: '',
})

const fields1 = ref([
  {
    label: '姓名',
    name: 'name',
    type: 'input',
    // required: true,
    rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  },
])

const fields2 = ref([
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
    },
  },
])

const fields3 = ref([{
  label: '国家',
  name: 'country',
  type: 'component',
  component: CountrySelectorField,
}])

const { steps, currentKey: activeKey, next, prev, isBefore, isAfter } = useSteps(Array.from({ length: 3 }).fill('').map((v, i) => ({ title: `第${i}步`, value: i })), 0)

async function goToNext() {
  if (activeKey.value === 0) {
    const result = await formRef.value.validateField(fields1.value.map(v => v.name), valid => valid)

    if (!result)
      return
  }

  next()
}

function test(...args) {
  // eslint-disable-next-line no-console
  console.log('test', args)
}
</script>

<template>
  <el-card title="Steps表单示例">
    <p>
      {{ JSON.stringify(data) }}
    </p>

    <el-steps :active="activeKey">
      <el-step v-for="item in steps" :key="item.value" :title="item.title" />
    </el-steps>

    <div class="p-[20px]">
      <el-form ref="formRef" :model="data" @validate="test">
        <FormItemsBuilder v-if="activeKey === 0" v-model="data" :column="2" :fields="fields1" />
        <FormItemsBuilder v-if="activeKey === 1" v-model="data" :column="2" :fields="fields2" />
        <FormItemsBuilder v-if="activeKey === 2" v-model="data" :column="2" :fields="fields3" />
        <div class="mt-[20px] text-right">
          <el-button v-if="isBefore" class="mr-[8px]" @click="prev">
            上一步
          </el-button>
          <el-button v-if="isAfter" type="primary" @click="goToNext">
            下一步
          </el-button>
          <el-button
            v-else
            type="primary"
            @click="ElMessage.success('Processing complete!')"
          >
            完成
          </el-button>
        </div>
      </el-form>
    </div>
  </el-card>
</template>

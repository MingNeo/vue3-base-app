<script lang="ts" setup>
const props = defineProps<{
  modelValue?: any
  viewMode?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'change'])

/**
 * 示例SearchForm 自定义field
 */

function getSelectData() {
  const data = [
    { value: 'china', label: '中国' },
    { value: 'usa', label: '美国' },
  ]
  return data
}

const countryOptions = ref<any[]>([])

// 初始化国家选项数据
selectData()

async function selectData() {
  try {
    countryOptions.value = await getSelectData()
  }
  catch (error) {
    console.error(error)
  }
}

function handleOnChange(newValue: any) {
  emit('change', newValue)
  emit('update:modelValue', newValue)
}

const current = computed(() => countryOptions.value.find((item: any) => item.value === props.modelValue))
</script>

<template>
  <template v-if="$props.viewMode">
    {{ current }}
  </template>
  <el-select v-else :value="modelValue" :options="countryOptions" @change="handleOnChange">
    <el-option v-for="option in countryOptions" :key="option.value" :value="option.value" :label="option.label" />
  </el-select>
</template>

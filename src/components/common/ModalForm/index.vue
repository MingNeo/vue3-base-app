<script lang="ts" setup>
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  width?: number
  visible: boolean
  loading?: boolean
  defaultValue?: any
  formState?: Record<string, any> // 用于v-model绑定表单state
  viewMode?: boolean
  fields?: any
  column?: number
  namePrefix?: (string | number)[]
  formItemProps?: Record<string, any>
}>(), { defaultValue: {} })

const emit = defineEmits(['update:visible', 'ok', 'cancel', 'update:formState', 'formChange'])

const formRef = ref()

const localFormState = ref(unbind(props.defaultValue) || {})

const formState = computed({
  get: () => {
    return props.formState ?? localFormState.value
  },
  set: (value) => {
    localFormState.value = value
    emit('update:formState', value)
    emit('formChange', value)
  },
})

watch(() => props.visible, (val) => {
  localFormState.value = val ? (unbind(props.defaultValue) || {}) : {}
}, { deep: true })

watch(
  () => props.defaultValue,
  val => (formState.value = unbind(val)),
  { deep: true },
)

const visible = computed({
  get: () => props.visible,
  set: value => emit('update:visible', value),
})

const handleOk = async () => {
  try {
    if (!props.viewMode) {
      await formRef.value.validate()
      emit('ok', formState.value)
    }
    visible.value = false
  }
  catch (error) {
    console.error('error', error)
  }
}

const handleCancel = () => {
  visible.value = false
  emit('cancel')
  formState.value = {}
}

const handleDataChange = (value: any) => {
  formState.value = value
}

const handleAfterClose = () => {
  formState.value = props.defaultValue
}

defineExpose({
  formState,
})
</script>

<template>
  <common-modal
    :visible="visible"
    :width="props.width"
    :title="props.title"
    destroy-on-close
    ok-text="提交"
    cancel-text="取消"
    :after-close="handleAfterClose"
    :footer="props.viewMode ? null : undefined"
    v-bind="$attrs"
    @ok="handleOk"
    @cancel="handleCancel"
    @update:visible="handleCancel"
  >
    <el-spin :spinning="props.loading">
      <el-form ref="formRef" :model="formState" layout="vertical">
        <slot name="header" />
        <slot :data="formState" :on-change="handleDataChange" :form-ref="formRef">
          <common-form-items-builder
            :model-value="formState"
            :column="props.column || 2"
            :view-mode="props.viewMode"
            :fields="props.fields"
            :form-item-options="props.formItemProps"
            :name-prefix="props.namePrefix"
            @update:model-value="handleDataChange"
          />
        </slot>
        <slot name="extra" />
      </el-form>
    </el-spin>
  </common-modal>
</template>

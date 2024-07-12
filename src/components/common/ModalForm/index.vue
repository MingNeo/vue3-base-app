<script lang="ts" setup>
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  width?: number
  modelValue?: boolean
  loading?: boolean
  defaultValue?: any
  formState?: Record<string, any> // 用于v-model绑定表单state
  viewMode?: boolean
  fields?: any
  column?: number
  namePrefix?: (string | number)[]
  formItemProps?: Record<string, any>
}>(), { defaultValue: {} })

const emit = defineEmits(['update:modelValue', 'ok', 'cancel', 'update:formState', 'formChange'])

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

watch(() => props.modelValue, (val) => {
  localFormState.value = val ? (unbind(props.defaultValue) || {}) : {}
}, { deep: true })

watch(
  () => props.defaultValue,
  val => (formState.value = unbind(val)),
  { deep: true },
)

async function handleOk() {
  try {
    if (!props.viewMode) {
      await formRef.value.validate()
      emit('ok', formState.value)
    }
    emit('update:modelValue', false)
  }
  catch (error) {
    console.error('error', error)
  }
}

function handleCancel() {
  emit('update:modelValue', false)
  emit('cancel')
  formState.value = {}
}

function handleDataChange(value: any) {
  formState.value = value
}

function handleBeforeClose(done: any) {
  nextTick(() => {
    formState.value = props.defaultValue
  })
  done()
}

defineExpose({
  formState,
})
</script>

<template>
  <common-modal
    :model-value="modelValue"
    :width="props.width"
    :title="props.title"
    destroy-on-close
    :before-close="handleBeforeClose"
    v-bind="$attrs"
    @update:model-value="handleCancel"
  >
    <div v-loading="props.loading">
      <el-form ref="formRef" :model="formState" layout="vertical" label-position="left">
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
    </div>

    <template #footer>
      <slot name="footer" :close="handleCancel" :ok="handleOk">
        <div class="dialog-footer flex justify-center gap-[8px]">
          <common-button @click="handleCancel">
            取消
          </common-button>
          <common-button type="primary" @click="handleOk">
            提交
          </common-button>
        </div>
      </slot>
    </template>
  </common-modal>
</template>

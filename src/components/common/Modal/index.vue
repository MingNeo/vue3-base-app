<script lang="ts" setup>
defineProps<{
  title?: string
  modelValue?: boolean
  showFooter?: boolean
}>()

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <el-dialog v-bind="$attrs" :model-value="modelValue" :show-close="false" align-center @update:model-value="emit('update:modelValue', $event)">
    <template #header="{ close }">
      <slot name="header" :close="close">
        <header class="relative">
          <span class="h-[30px]">{{ title }}</span>
          <div class="absolute top-[-18px] right-[-15px] w-12 h-12 flex justify-center items-center text-[24px] cursor-pointer">
            <icon icon="icon-park-outline:close-small" @click="close" />
          </div>
        </header>
      </slot>
    </template>

    <template v-if="showFooter" #footer>
      <div class="dialog-footer flex justify-center gap-[8px]">
        <common-button @click="emit('update:modelValue', false)">
          取消
        </common-button>
        <common-button type="primary">
          提交
        </common-button>
      </div>
    </template>

    <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
      <slot :name="key" v-bind="slotProps || {}" />
    </template>
  </el-dialog>
</template>

<style lang="scss">
.el-dialog {
  --el-overlay-color-lighter: rgba(0, 0, 0, 0.3);
  --el-dialog-width: 50%;
  --el-dialog-border-radius: 8px;
}
</style>

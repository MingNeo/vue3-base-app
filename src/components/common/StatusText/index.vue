<script lang="ts" setup>
const { status, config } = defineProps<{
  config: Record<string, any>
  status: string
}>()
</script>

<template>
  <div class="status-text flex items-center">
    <span class="dot w-2 h-2 rounded-[50%] mr-1" :style="{ backgroundColor: config[status]?.color }" />
    <span class="text text-[14px] color-[#333]">
      <slot>{{ config[status]?.text }}</slot>
    </span>
  </div>
</template>

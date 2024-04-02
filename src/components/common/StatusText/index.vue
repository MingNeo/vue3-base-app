<script lang="ts" setup>
const { status, config } = defineProps<{
  config: Record<string, any>
  status: string
}>()
</script>

<template>
  <div class="status-text">
    <span class="dot" :style="{ backgroundColor: config[status]?.color }" />
    <span class="text">
      <slot>{{ config[status]?.text }}</slot>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.status-text {
  display: flex;
  align-items: center;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 4px;
  }

  .text {
    font-size: 14px;
    color: #333;
  }
}
</style>

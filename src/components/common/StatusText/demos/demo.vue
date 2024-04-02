<script lang="ts" setup>
const statusConfig = reactive({
  ready: {
    text: '准备就绪',
    color: '#4CAF50',
  },
  error: {
    text: '错误',
    color: '#F44336',
  },
  warning: {
    text: '警告',
    color: '#FFC107',
  },
})
</script>

<template>
  <div>
    <common-status-text :config="statusConfig" status="ready" />
    <common-status-text :config="statusConfig" status="error" />
    <common-status-text :config="statusConfig" status="warning" />
  </div>
</template>

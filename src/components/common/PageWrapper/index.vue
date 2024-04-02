<script setup lang="ts">
const { meta } = defineProps<{ meta?: any }>()
const permissionStore = usePermissionStore()
const hasPermission = computed(() => permissionStore.checkHasAuth(meta))
</script>

<template>
  <div v-if="hasPermission" class="page-wrapper">
    <slot />
  </div>
  <div v-else class="flex-grow p-8">
    <!-- 也可以permission页面配置路由独立跳转403页面 -->
    无权限访问
  </div>
</template>

<style scoped lang="scss">
.page-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
}
</style>

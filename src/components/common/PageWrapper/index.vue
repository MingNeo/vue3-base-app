<script setup lang="ts">
const currentRoute = useRouter().currentRoute
const permissionStore = usePermissionStore()
const hasPermission = computed(() => permissionStore.checkHasAuth(currentRoute.value.meta))
</script>

<template>
  <div v-if="hasPermission" class="page-wrapper flex-1 flex flex-col overflow-auto h-full">
    <slot />
  </div>
  <div v-else class="flex-grow p-5">
    <!-- 也可以permission页面配置路由独立跳转403页面 -->
    无权限访问
  </div>
</template>

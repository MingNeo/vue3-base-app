<script setup lang="ts">
const currentRoute = useRouter().currentRoute
const permissionStore = usePermissionStore()
const hasPermission = computed(() => permissionStore.checkHasAuth(currentRoute.value.meta))
</script>

<template>
  <div v-if="hasPermission" class="page-wrapper flex-1 flex flex-col overflow-auto h-full">
    <slot />
  </div>
  <div v-else class="flex-grow p-5 flex items-center justify-center text-gray-500">
    <!-- 也可以permission页面配置路由独立跳转403页面 -->
    <div class="text-center">
      <p class="text-lg font-medium">
        无权限访问
      </p>
      <p class="mt-2 text-sm">
        请联系管理员获取相应权限
      </p>
    </div>
  </div>
</template>

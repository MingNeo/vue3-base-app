<script setup>
</script>

<template>
  <div class="flex flex-col basic-container">
    <common-header />
    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边栏 -->
      <div class="bg-gray-800">
        <CommonSideBar />
      </div>
      <!-- 主要内容区 -->
      <common-page-wrapper :meta="useRouter().currentRoute.value.meta">
        <RouterView />
      </common-page-wrapper>
    </div>
  </div>
</template>

<style scoped lang="scss">
.basic-container {
  height: 100%;
}
</style>

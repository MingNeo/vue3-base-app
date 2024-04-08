<script setup>
</script>

<template>
  <div class="flex flex-col basic-container">
    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边栏 -->
      <div class="bg-gray-800">
        <CommonSideBar />
      </div>
      <!-- 主要内容区 -->
      <common-page-wrapper>
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

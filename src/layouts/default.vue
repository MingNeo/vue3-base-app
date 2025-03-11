<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col h-full basic-container">
    <common-header-bar />
    <div class="flex flex-1 overflow-hidden h-[calc(100vh-40px)] md:h-[calc(100vh-50px)]">
      <!-- 主要内容区 -->
      <common-page-wrapper>
        <RouterView />
      </common-page-wrapper>
    </div>
  </div>
</template>

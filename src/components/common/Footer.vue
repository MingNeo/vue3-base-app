<script lang="ts" setup>
const { isMobile } = useScreenSize()
</script>

<template>
  <!-- pc端 -->
  <footer v-if="!isMobile" class="h-10 w-full flex items-center justify-center bg-gray-100">
    PC Footer
  </footer>
  <!-- 移动端 -->
  <footer v-else class="h-10 w-full flex items-center justify-center bg-gray-100">
    Mobile Footer
  </footer>
</template>

<style lang="scss" scoped>
</style>

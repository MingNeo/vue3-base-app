<script lang="ts" setup>
const { isMobile } = useScreenSize()

const active = ref(0)
</script>

<template>
  <!-- pc端 -->
  <footer v-if="!isMobile" class="h-10 w-full flex items-center justify-center bg-gray-100">
    PC Footer
  </footer>
  <!-- 移动端 -->
  <footer v-else class="h-10 w-full flex items-center justify-center bg-gray-100">
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o">
        标签
      </van-tabbar-item>
      <van-tabbar-item icon="search">
        标签
      </van-tabbar-item>
      <van-tabbar-item icon="friends-o">
        标签
      </van-tabbar-item>
      <van-tabbar-item icon="setting-o">
        标签
      </van-tabbar-item>
    </van-tabbar>
  </footer>
</template>

<style lang="scss" scoped>
</style>

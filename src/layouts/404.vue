<script setup lang="ts">
const router = useRouter()
const goback = () => router.back()
</script>

<template>
  <div class="w-[100vw] h-[100vh] flex items-center justify-center">
    <div class="w-[40vw] h-[200px] flex items-center flex-col">
      <div class="text-center">
        当前页面不存在
      </div>
      <a @click="goback">
        返回
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const goback = () => router.back()
</script>

<template>
  <div class="w-[100vw] h-[100vh] flex items-center justify-center">
    <div class="text-center">
      <div class="text-[60px] font-bold">
        404
      </div>
      <div class="text-gray-500 mb-2">
        当前页面不存在
      </div>
      <button
        class="bg-blue-500 text-white px-4 py-1 rounded-md"
        @click="goback"
      >
        返回
      </button>
    </div>
  </div>
</template>

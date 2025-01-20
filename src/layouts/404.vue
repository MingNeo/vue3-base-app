<script setup lang="ts">
const router = useRouter()
const goback = () => router.back()
</script>

<template>
  <div class="w-[100vw] h-[100vh] flex items-center justify-center">
    <el-empty description="当前页面不存在">
      <el-button type="primary" @click="goback">
        返回
      </el-button>
    </el-empty>
  </div>
</template>

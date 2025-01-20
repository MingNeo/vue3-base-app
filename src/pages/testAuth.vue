<template>
  <!-- 主要内容区 -->
  <div class="flex-grow p-8">
    <div class="flex gap-4 mb-5">
      需要具体权限的测试页
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: basic
  title: 权限测试页
  permission: [test]
</route>

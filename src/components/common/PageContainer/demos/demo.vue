<template>
  <common-page-container
    title="货币管理"
    show-header
    :actions="[{ text: '新增', type: 'primary', onClick: () => {} }]"
  >
    <el-card title="内容1">
      一段测试文本
    </el-card>
    <el-card :style="{ marginTop: '20px' }" title="内容2">
      一段测试文本
    </el-card>
  </common-page-container>
</template>

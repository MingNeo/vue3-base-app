<script setup lang="ts">
import { useHead } from '@vueuse/head'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { getInfo } from './api/user'

dayjs.locale('zh-cn')

// https://github.com/vueuse/head
useHead({
  title: '基础工程vue',
  meta: [
    { name: 'description', content: '基础工程vue' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
  script: [],
})

onMounted(() => {
  getInfo()
})
</script>

<template>
  <div id="app">
    <!-- eslint-disable-next-line vue/attribute-hyphenation -->
    <el-config-provider :locale="zhCn">
      <RouterView />
    </el-config-provider>
  </div>
</template>

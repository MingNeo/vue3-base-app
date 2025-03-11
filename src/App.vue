<script setup lang="ts">
import type { message } from './utils/message'
import { useHead } from '@vueuse/head'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

declare global {
  interface Window {
    $message: typeof message
  }
}

dayjs.locale('zh-cn')

const isDark = useDark()
const preferredDark = usePreferredDark()

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

const userStore = useUserStore()
onMounted(() => {
  userStore.getInfo()
})
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

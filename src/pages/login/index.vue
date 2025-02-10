<route lang="yaml">
meta:
  layout: blank
</route>

<script setup>
import QuickLogin from './components/quickLogin.vue'

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()

async function handleSubmitSuccess() {
  await userStore.getInfo()
  const redirect = ['404', '/403'].includes(route.query.redirect) ? '' : route.query.redirect
  router.push(redirect || '/')
}
</script>

<template>
  <!-- 主要内容区 -->
  <div class="w-[100vw] h-[100vh] p-5 flex justify-center items-center relative">
    <div class="w-100 shadow p-10 rounded-[10px] bg-white">
      <QuickLogin @success="handleSubmitSuccess" />
      <!-- <Icon class="w-10 h-10" icon="local:douyin" />
      <Icon class="w-10 h-10" icon="local:wechat" /> -->
    </div>
  </div>
</template>

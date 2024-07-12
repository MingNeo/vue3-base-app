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
  <div class="w-[100vw] h-[100vh] p-5 flex relative page">
    <div class="absolute right-20 top-[50%] w-100 shadow p-10 rounded-[10px] bg-white content-wrapper">
      <QuickLogin @success="handleSubmitSuccess" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background-image: linear-gradient(to bottom, rgba(255, 0, 0, 0), rgba(96, 165, 250, 1));
}

.content-wrapper {
  transform: translateY(-50%);
}
</style>

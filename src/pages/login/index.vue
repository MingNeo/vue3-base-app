<route lang="yaml">
meta:
  layout: blank
</route>

<script setup>
import QuickLogin from './components/quickLogin.vue'

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()

const handleSubmitSuccess = async () => {
  await userStore.getInfo()
  const redirect = ['404', '/403'].includes(route.query.redirect) ? '' : route.query.redirect
  router.push(redirect || '/')
}
</script>

<template>
  <!-- 主要内容区 -->
  <div class="w-100vw h-100vh p-8 flex relative page">
    <div class="w-400px shadow p-40px b-rd-10px bg-white content-wrapper">
      <QuickLogin @success="handleSubmitSuccess" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background-image: linear-gradient(to bottom, rgba(255, 0, 0, 0), rgba(96, 165, 250, 1));
}

.content-wrapper {
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
}
</style>

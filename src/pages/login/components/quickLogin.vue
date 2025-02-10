<script setup lang="ts">
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const phone = ref('')
const code = ref('')
const countdown = useCountdown(60)

async function handleSubmit() {
  if (!phone.value || !code.value) {
    window.$message.error('请输入手机号和验证码')
    return
  }

  loading.value = true
  try {
    await userStore.login({
      phone: phone.value,
      code: code.value,
    })
    window.$message.success('登录成功')
    router.push('/')
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

async function getCode() {
  if (!phone.value) {
    window.$message.error('请输入手机号')
    return
  }

  try {
    await userStore.getCaptcha(phone.value)
    window.$message.success('验证码已发送')
    countdown.start()
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="w-full max-w-sm mx-auto">
    <h2 class="text-2xl font-bold text-center mb-8">
      快速登录
    </h2>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
        <common-input
          v-model="phone"
          type="text"
          placeholder="请输入手机号"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
        <div class="flex gap-4">
          <common-input
            v-model="code"
            type="text"
            placeholder="请输入验证码"
          />
          <common-button class="w-25" :disabled="!!countdown.isCounting" @click="getCode">
            {{ countdown.isCounting ? `${countdown.current.value}s` : '获取验证码' }}
          </common-button>
        </div>
      </div>

      <common-button
        type="primary"
        class="w-full"
        :loading="loading"
        @click="handleSubmit"
      >
        登录
      </common-button>
      <div class="text-center">
        <a
          class="text-sm text-blue-600 hover:text-blue-500 cursor-pointer"
          @click="router.push('/register')"
        >
          没有账号？去注册
        </a>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
</style>

<route lang="yaml">
  meta:
    layout: blank
  </route>

<script setup lang="ts">
const router = useRouter()
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  code: '',
})
const countdown = useCountdownTime(60)

async function handleSubmit() {
  if (!form.username || !form.password || !form.confirmPassword || !form.phone || !form.code) {
    message.error('请填写完整信息')
    return
  }

  if (form.password !== form.confirmPassword) {
    message.error('两次密码不一致')
    return
  }

  loading.value = true
  try {
    // 调用注册接口
    message.success('注册成功')
    router.push('/login')
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

async function getCode() {
  if (!form.phone) {
    message.error('请输入手机号')
    return
  }

  try {
    await getCaptcha()
    message.success('验证码已发送')
    countdown.start()
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg mt-20 p-6 max-w-sm mx-auto">
    <h2 class="text-2xl font-bold text-center mb-8">
      注册账号
    </h2>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
        <common-input
          v-model="form.username"
          type="text"
          placeholder="请输入用户名"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
        <common-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
        <common-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
        <common-input
          v-model="form.phone"
          type="text"
          placeholder="请输入手机号"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
        <div class="flex gap-4">
          <common-input
            v-model="form.code"
            type="text"
            placeholder="请输入验证码"
          />
          <common-button :disabled="!!countdown.isCounting" class="w-25" @click="getCode">
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
        注册
      </common-button>

      <div class="text-center">
        <a
          class="text-sm text-blue-600 hover:text-blue-500 cursor-pointer"
          @click="router.push('/login')"
        >
          已有账号？去登录
        </a>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.register-form {
  width: 100%;
}
</style>

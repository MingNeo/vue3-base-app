<script setup lang="ts">
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const phone = ref('')
const code = ref('')

const countdown = useCountdown(60)
const isCounting = computed(() => countdown.isCounting.value)
const errors = reactive({
  phone: '',
  code: '',
})

async function handleSubmit() {
  if (!phone.value || !code.value) {
    errors.phone = '请输入手机号'
    errors.code = '请输入验证码'
    return
  }

  loading.value = true
  try {
    await userStore.quickLogin({
      phone: phone.value,
      code: code.value,
    })
    message.success('登录成功')
    await userStore.getInfo()
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
    errors.phone = '请输入手机号'
    return
  }

  try {
    await userStore.getCaptcha(phone.value)
    message.success('验证码已发送')
    countdown.start()
  }
  catch (error) {
    console.error(error)
  }
}

watch(phone, (val, oldVal) => {
  if (!val && oldVal) {
    errors.phone = '请输入手机号'
  }
  else if (val) {
    errors.phone = ''
  }
})

watch(code, (val, oldVal) => {
  if (!val && oldVal) {
    errors.code = '请输入验证码'
  }
  else if (val) {
    errors.code = ''
  }
})
</script>

<template>
  <div class="mx-auto max-w-sm w-full py-8 px-4">
    <h2 class="mb-8 text-center text-2xl font-bold">
      快速登录
    </h2>
    <div class="flex items-center gap-1">
      <input v-model="phone" class="flex-1 bg-gray-100 px-2 h-10 rounded-md" :class="{ 'ring-2 !ring-red-500': errors.phone }" type="text" placeholder="请输入手机号">
    </div>
    <p class="h-[18px] text-[12px] text-red-500">
      {{ errors.phone || '' }}
    </p>

    <div class="flex items-center gap-1">
      <input v-model="code" class="flex-1 bg-gray-100 px-2 h-10 rounded-md" :class="{ 'ring-2 !ring-red-500': errors.code }" type="text" placeholder="请输入验证码">
      <button class="h-10 w-25 text-nowrap text-sm bg-gray-100 rounded-md" :disabled="!!isCounting" @click="getCode">
        {{ isCounting ? `${countdown.current.value}s` : '获取验证码' }}
      </button>
    </div>
    <p class="h-[18px] text-[12px] text-red-500">
      {{ errors.code || '' }}
    </p>

    <button
      type="submit"
      class="block mt-6 h-10 w-full rounded-md bg-primary text-white active:scale-[98%] hover:bg-primary/80"
      :loading="loading"
      @click.stop="handleSubmit"
    >
      登录
    </button>

    <div class="text-center mt-4">
      <a
        class="cursor-pointer text-sm text-blue-600 hover:text-blue-500"
        @click="router.push('/register')"
      >
        没有账号？去注册
      </a>
    </div>
  </div>
</template>

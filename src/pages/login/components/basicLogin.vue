<script setup>
const emit = defineEmits(['success'])

const formState = reactive({
  username: 'testUser',
  password: 'Admin@123456',
  remember: true,
})

// 表单验证状态
const errors = reactive({
  username: '',
  password: '',
})

const userStore = useUserStore()

function validateForm() {
  errors.username = ''
  errors.password = ''
  if (!formState.remember) {
    errors.remember = '请勾选隐私协议'
    return false
  }
  if (!formState.username) {
    errors.username = '请输入用户名'
    return false
  }
  if (!formState.password) {
    errors.password = '请输入密码'
    return false
  }
  return true
}

async function handleSubmit(e) {
  e.preventDefault()
  if (!validateForm())
    return

  try {
    await userStore.login(formState)
  }
  catch (error) {
    message.error(`登录失败！${error.message}`)
    return
  }

  emit('success')
}
</script>

<template>
  <div class="rounded-lg bg-white px-4 py-8">
    <h1 class="mb-5 text-center text-[26px] font-medium">
      登录
    </h1>

    <form @submit="handleSubmit">
      <div class="relative w-full">
        <input
          id="userName" v-model="formState.username" type="text"
          class="peer dark:autofill:shadow-autofill block w-[260px] w-full border border-gray-300 rounded-md border-solid px-3 py-2 outline-none dark:text-white placeholder:opacity-0 focus:ring-1 focus:ring-[#1f293733] dark:peer-focus:text-primary dark:placeholder:text-neutral-300"
          :class="{ 'border-red-500': errors.username }"
        >
        <label
          v-show="!formState.username" for="userName"
          class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[5px] text-[#999] leading-[2.15] transition-all duration-200 ease-out peer-active:scale-[0.8] peer-focus:scale-[0.8] peer-focus:bg-white dark:text-neutral-400 peer-focus:leading-[1] motion-reduce:transition-none peer-active:-translate-y-[1.15rem] peer-focus:-translate-y-[0.6rem] dark:peer-focus:text-primary"
        >Username
        </label>
      </div>
      <p class="h-5 text-[12px] text-red-500">
        {{ errors.username || '' }}
      </p>

      <div class="relative w-full">
        <input
          id="password" v-model="formState.password" type="password"
          class="peer dark:autofill:shadow-autofill block w-[260px] w-full border border-gray-300 rounded-md border-solid px-3 py-2 outline-none dark:text-white placeholder:opacity-0 focus:ring-1 focus:ring-[#1f293733] dark:peer-focus:text-primary dark:placeholder:text-neutral-300"
          :class="{ 'border-red-500': errors.password }"
        >
        <label
          v-show="!formState.password" for="password"
          class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[5px] text-[#999] leading-[2.15] transition-all duration-200 ease-out peer-active:scale-[0.8] peer-focus:scale-[0.8] peer-focus:bg-white dark:text-neutral-400 peer-focus:leading-[1] motion-reduce:transition-none peer-active:-translate-y-[1.15rem] peer-focus:-translate-y-[0.6rem] dark:peer-focus:text-primary"
        >Password
        </label>
      </div>
      <p class="h-5 text-[12px] text-red-500">
        {{ errors.password || '' }}
      </p>

      <button
        type="submit"
        class="block h-10 w-full rounded-md bg-primary text-white active:scale-[98%] hover:bg-primary/80"
      >
        登录
      </button>

      <div class="mt-4 flex items-center gap-1 text-sm">
        <label class="flex cursor-pointer items-center gap-1">
          <input
            v-model="formState.remember" type="checkbox"
            class="h-4 w-4 border-gray-300 rounded text-blue-500 focus:ring-blue-500"
          >
          <span>我已阅读并同意</span>
        </label>
        <a href="" class="text-blue-500 hover:text-blue-600">《用户协议》</a>
        和
        <a href="" class="text-blue-500 hover:text-blue-600">《隐私政策》</a>
      </div>

      <div class="mt-4 flex justify-between text-sm">
        <a href="" class="text-blue-500 hover:text-blue-600">注册</a>
        <a href="" class="text-blue-500 hover:text-blue-600">忘记密码</a>
      </div>
    </form>
  </div>
</template>

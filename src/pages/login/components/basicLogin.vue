<script setup>
const emit = defineEmits(['success'])

const formState = reactive({
  username: 'testUser2',
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
  let isValid = true
  errors.username = ''
  errors.password = ''

  if (!formState.username) {
    errors.username = '请输入用户名'
    isValid = false
  }
  if (!formState.password) {
    errors.password = '请输入密码'
    isValid = false
  }
  return isValid
}

async function handleSubmit(e) {
  e.preventDefault()

  if (!validateForm())
    return

  try {
    await userStore.login(formState)
  }
  catch (error) {
    alert(`登录失败！${error.message}`)
    return
  }

  emit('success')
}
</script>

<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h1 class="mb-5 text-[30px] text-center font-medium">
      登录
    </h1>

    <form class="space-y-4" @submit="handleSubmit">
      <div>
        <input
          v-model="formState.username"
          type="text"
          placeholder="请输入账号"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.username }"
        >
        <p v-if="errors.username" class="mt-1 text-sm text-red-500">
          {{ errors.username }}
        </p>
      </div>

      <div>
        <input
          v-model="formState.password"
          type="password"
          placeholder="请输入密码"
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.password }"
        >
        <p v-if="errors.password" class="mt-1 text-sm text-red-500">
          {{ errors.password }}
        </p>
      </div>

      <button
        type="submit"
        class="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        登录
      </button>

      <div class="text-sm flex items-center gap-1">
        <label class="flex items-center gap-1 cursor-pointer">
          <input
            v-model="formState.remember"
            type="checkbox"
            class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          >
          <span>我已阅读并同意</span>
        </label>
        <a href="" class="text-blue-500 hover:text-blue-600">《用户协议》</a>
        和
        <a href="" class="text-blue-500 hover:text-blue-600">《隐私政策》</a>
      </div>

      <div class="flex justify-between text-sm">
        <a href="" class="text-blue-500 hover:text-blue-600">注册</a>
        <a href="" class="text-blue-500 hover:text-blue-600">忘记密码</a>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script setup>
const emit = defineEmits(['success'])

const formState = reactive({
  username: 'testUser2',
  code: 'Admin@123456',
  remember: true,
})

const rules = ref({
  username: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  }],
  code: [{
    required: true,
    message: '请输入验证码',
    trigger: 'blur',
  }],
})

const userStore = useUserStore()

const { start, formattedTime, isCounting } = useCountdown(60)
async function handleGetCaptcha() {
  start()
  try {
    await userStore.getCaptcha()
  }
  catch (error) {
    return ElMessage.error(`获取验证码失败！${error.message}`)
  }
}

async function handleSubmit(values) {
  try {
    await userStore.login(values)
  }
  catch (error) {
    return ElMessage.error(`登录失败！${error.message}`)
  }

  emit('success')
}
</script>

<template>
  <div class="bg-white">
    <div class="mb-6 text-[30px] text-center">
      登录
    </div>
    <el-form
      :model="formState"
      class="login-form"
      :rules="rules"
      @finish="handleSubmit"
    >
      <el-form-item prop="username">
        <el-input v-model="formState.username" placeholder="请输入账号" />
      </el-form-item>

      <el-form-item prop="code">
        <el-input v-model="formState.code" show-password placeholder="验证码">
          <template #append>
            <div v-if="isCounting">
              <span>{{ formattedTime }}秒后重发</span>
            </div>
            <div v-else @click="handleGetCaptcha">
              <a href="javascript:;">获取验证码</a>
            </div>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="mt-[10px] w-full !h-10" type="primary" @click="handleSubmit">
          登录
        </el-button>
      </el-form-item>
      <div class="text-[13px] flex items-center gap-[4px]">
        <el-checkbox v-model:checked="formState.remember" />
        我已阅读并同意 <a href="">《用户协议》</a> 和 <a href="">《隐私政策》</a>
      </div>
      <div class="flex justify-between text-[13px]">
        <a href="">注册</a>
        <a href="">忘记密码</a>
      </div>
    </el-form>
  </div>
</template>

  <style lang="scss" scoped>
  </style>

<route lang="yaml">
  meta:
    layout: blank
  </route>

<script setup>
const formState = reactive({
  username: '',
  code: '',
  password: '',
  confirmPassword: '',
  agree: false,
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
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  }],
  confirmPassword: [{
    required: true,
    message: '请确认密码',
    trigger: 'blur',
  }, {
    validator: (rule, value) => {
      if (value !== formState.password)
        throw new Error('两次输入的密码不一致')
      return Promise.resolve()
    },
    trigger: 'blur',
  }],
  agree: [{
    validator: (rule, value) => {
      if (!value)
        throw new Error('请阅读并同意用户协议和隐私政策')
      return Promise.resolve()
    },
    trigger: 'change',
  }],
})

const userStore = useUserStore()
const router = useRouter()

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
    await userStore.register(values)
    ElMessage.success('注册成功！')
    router.push('/login')
  }
  catch (error) {
    return ElMessage.error(`注册失败！${error.message}`)
  }
}
</script>

<template>
  <div class="bg-white p-8 rounded-lg shadow-md w-[400px] mx-auto mt-[100px]">
    <div class="mb-6 text-[30px] text-center">
      注册
    </div>
    <el-form
      :model="formState"
      class="register-form"
      :rules="rules"
      @finish="handleSubmit"
    >
      <el-form-item prop="username">
        <el-input v-model="formState.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item prop="code">
        <el-input v-model="formState.code" placeholder="验证码">
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

      <el-form-item prop="password">
        <el-input
          v-model="formState.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <el-input
          v-model="formState.confirmPassword"
          type="password"
          placeholder="请确认密码"
          show-password
        />
      </el-form-item>

      <el-form-item prop="agree">
        <div class="text-[13px] flex items-center gap-[4px]">
          <el-checkbox v-model="formState.agree" />
          我已阅读并同意 <a href="">《用户协议》</a> 和 <a href="">《隐私政策》</a>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button class="mt-[10px] w-full !h-10" type="primary" @click="handleSubmit">
          注册
        </el-button>
      </el-form-item>

      <div class="text-[13px] text-center">
        已有账号？<router-link to="/login" class="text-primary">
          立即登录
        </router-link>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.register-form {
  width: 100%;
}
</style>

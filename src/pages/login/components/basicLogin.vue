<script setup>
const emit = defineEmits(['success'])

const formState = reactive({
  username: 'testUser2',
  password: 'Admin@123456',
  remember: true,
})

const rules = ref({
  username: [{
    required: true,
    message: '请输入用户名',
    trigger: 'change',
  }],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'change',
  }],
})

const userStore = useUserStore()

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
    <div class="mb-5 text-[30px] text-center">
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

      <el-form-item prop="password">
        <el-input v-model="formState.password" show-password placeholder="请输入密码" />
      </el-form-item>

      <el-form-item>
        <el-button class="mt-[10px] w-full" type="primary" @click="handleSubmit">
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

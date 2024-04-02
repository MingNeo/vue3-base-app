<route lang="yaml">
meta:
  layout: blank
</route>

<script setup>
const router = useRouter()
const route = useRoute()
const formState = reactive({
  username: 'testUser2',
  password: 'Admin@123456',
  remember: true,
})

const rules = ref({
  username: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  }],
})

const userStore = useUserStore()

const handleSubmit = async (values) => {
  try {
    await userStore.login(values)
  }
  catch (error) {
    return ElMessage.error(`登录失败！${error.message}`)
  }

  await userStore.getInfo()
  const redirect = ['404', '/403'].includes(route.query.redirect) ? '' : route.query.redirect
  router.push(redirect || '/')
}
</script>

<template>
  <!-- 主要内容区 -->
  <div class="w-100vw h-100vh p-8 flex relative page">
    <div class="w-400px shadow p-40px b-rd-10px bg-white content-wrapper">
      <div class="marginb20 text-30px text-center">
        登录
      </div>
      <el-form
        :model="formState"
        class="login-form"
        :rules="rules"
        @finish="handleSubmit"
      >
        <el-form-item name="username">
          <el-input v-model:value="formState.username" placeholder="请输入账号" />
        </el-form-item>

        <el-form-item name="password">
          <el-input v-model:value="formState.password" show-password placeholder="请输入密码" />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model:checked="formState.remember">
            记住密码
          </el-checkbox>
          <el-button class="m-t-10px" type="primary" @click="handleSubmit">
            登录
          </el-button>
        </el-form-item>
        <div class="flex justify-between">
          <a href="">注册</a>
          <a href="">忘记密码</a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background-image: linear-gradient(to bottom, rgba(255,0,0,0), rgba(96, 165, 250, 1));
}
.content-wrapper {
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
}
</style>

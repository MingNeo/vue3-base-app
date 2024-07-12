<script setup lang="ts">
const user = useUserStore()

const router = useRouter()
function gotoLogin() {
  router.push(`/login?redirect=${window.location.pathname}`)
}
</script>

<template>
  <header class="flex justify-between items-center px-5 h-14 shadow bg-white z-20">
    <div class="logo cursor-pointer" @click="$router.push('/manage')">
      Admin
    </div>
    <div class="right">
      <el-dropdown v-if="user.info.id">
        <span class="el-dropdown-link">
          用户名
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button v-else type="primary" @click="gotoLogin">
        登录/注册
      </el-button>
    </div>
  </header>
</template>

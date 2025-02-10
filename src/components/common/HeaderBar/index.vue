<script setup lang="ts">
const user = useUserStore()
const router = useRouter()

function gotoLogin() {
  router.push(`/login?redirect=${window.location.pathname}`)
}

const showDropdown = ref(false)
function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}
</script>

<template>
  <header class="flex justify-between items-center px-5 h-14 shadow bg-white z-20">
    <div class="logo cursor-pointer" @click="$router.push('/manage')">
      Admin
    </div>
    <div class="right">
      <div v-if="user.info.id" class="relative">
        <button
          class="flex items-center space-x-1 hover:bg-gray-100 px-3 py-2 rounded-md"
          @click="toggleDropdown"
        >
          <span>用户名</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-if="showDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            个人中心
          </a>
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            退出登录
          </a>
        </div>
      </div>
      <button
        v-else
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        @click="gotoLogin"
      >
        登录/注册
      </button>
    </div>
  </header>
</template>

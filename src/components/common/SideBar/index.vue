<script setup lang="ts">
const sideMenuStore = useSideMenuStore()

const activeKey = computed(() => sideMenuStore.selectedKey)
const openKeys = computed(() => sideMenuStore.openKeys)

function toggleSubmenu(key: string) {
  const index = openKeys.value.indexOf(key)
  if (index > -1)
    openKeys.value.splice(index, 1)
  else
    openKeys.value.push(key)
}
</script>

<template>
  <div class="bg-white w-[220px] flex flex-col h-[100%]">
    <div class="flex-1 overflow-y-auto w-full">
      <nav class="space-y-1">
        <template v-for="item in sideMenuStore.showMenus" :key="item.key">
          <!-- Submenu -->
          <div v-if="item.children" class="menu-item">
            <div
              class="w-full flex items-center justify-between px-4 py-2 text-gray-600 hover:bg-gray-100"
              @click="toggleSubmenu(item.key)"
            >
              <span>{{ item.title }}</span>
              <svg
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': openKeys.includes(item.key) }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div v-show="openKeys.includes(item.key)" class="pl-4">
              <a
                v-for="subItem in item.children"
                :key="subItem.key"
                class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                :class="{ 'bg-gray-100': activeKey === subItem.key }"
                @click="subItem.path && $router.push(subItem.path)"
              >
                {{ subItem.title }}
              </a>
            </div>
          </div>

          <!-- Single menu item -->
          <a
            v-else
            class="block px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
            :class="{ 'bg-gray-100': activeKey === item.key }"
            @click="item.path && $router.push(item.path)"
          >
            {{ item.title }}
          </a>
        </template>
      </nav>
    </div>
  </div>
</template>

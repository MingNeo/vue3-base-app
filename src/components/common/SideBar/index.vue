<script setup lang="ts">
const sideMenuStore = useSideMenuStore()
</script>

<template>
  <div class="bg-white w-[220px] flex flex-col h-[100%]">
    <div class="flex-1 overflow-y-auto w-full">
      <el-menu
        :default-active="sideMenuStore.selectedKey"
        :default-openeds="sideMenuStore.openKeys"
        class="w-full h-full"
        :collapse="sideMenuStore.collapsed"
        v-bind="$attrs"
      >
        <template v-for="(item) in sideMenuStore.showMenus">
          <el-sub-menu v-if="item.children" :key="`sub-menu-${item.key}`" :index="item.key">
            <template #title>
              {{ item.title }}
            </template>
            <el-menu-item v-for="(subItem) in item.children" :key="subItem.key" @click="subItem.path && $router.push(subItem.path)">
              {{ subItem.title }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :key="item.key" @click="item.path && $router.push(item.path)">
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

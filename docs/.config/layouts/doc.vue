<script setup>
const sideMenuStore = useSideMenuStore()
</script>

<template>
  <div class="flex flex-col basic-container">
    <div class="header flex justify-between p-h-24px shadow bg-white items-center"></div>
    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边栏 -->
      <div class="sidebar">
        <div class="flex flex-col h-100%">
          <template v-for="(category, index) in sideMenuStore.showMenus" :key="index">
            <el-list size="small" :data-source="category.children">
              <template #header>
                <div v-if="category.title" class="side-bar-header m-t-15px">{{ category.title }}</div>
              </template>
              <template #renderItem="{ item }">
                <el-list-item :class="`side-bar-item ${sideMenuStore.selectedKeys[0] === item.path ? 'active' : ''}`" @click="item.path && $router.push(item.path)">
                  {{ item.title }}
                </el-list-item>
              </template>
            </el-list>
          </template>
        </div>
      </div>
      <!-- 主要内容区 -->
      <div class="page-content" :key="$route.path">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: calc(100vh - 51px);
  > div {
    margin: 0 auto !important;
  }
}

.header {
  height: 50px;
  margin-bottom: 1px;
  box-shadow: 0px 2px 6px -5px rgba(0, 0, 0, 0.04), 0px 2px 6px rgba(0, 0, 0, 0.06);
}

.sidebar {
  background-color: #fff;
  border-right: 1px solid #e8e8e8;
  overflow: auto;
  height: calc(100vh - 51px);

  .side-bar-header {
    padding: 0 10px 0 20px;
  }
  .side-bar-item {
    cursor: pointer;
    border: none;
    padding: 10px 10px 10px 20px;
    &.active {
      color: #1890ff;
      background-color: #e6f7ff;
    }
  }
}
</style>

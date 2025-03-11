<script lang="ts" setup>
import useAsyncList from '@/composables/useAsyncList'

async function fetchData(params) {
  const start = (params.pageNo - 1) * params.pageSize
  return { data: Array.from({ length: 10 }).fill(0).map((_, index) => ({ id: index + start, name: `name${index + start}` })), total: 100 }
}

const queryData = ref({
  name: '',
  pageNo: 1,
})

const { data, loading, pagination, fetchNewData, loadNextPage } = useAsyncList(fetchData, { queryData })

const inputRef = ref<HTMLInputElement | null>(null)

const { isSoftKeyboardShow, onFocus, onBlur } = useMobileInput({ inputRef })
</script>

<template>
  <div class="h-full relative">
    <div class="h-full max-h-full pb-14 overflow-y-auto">
      <h1>欢迎来到测试页面 {{ isSoftKeyboardShow }}</h1>
      <div>
        <button class="btn" @click="fetchNewData()">
          重新请求
        </button>
      </div>
      <div v-if="!loading">
        <p v-for="item in data" :key="item.id">
          {{ item.name }}
        </p>
        <p> 第{{ pagination.current }} 页，每页{{ pagination.pageSize }} 条，共{{ pagination.total }} 条</p>
        <button class="btn" @click="loadNextPage">
          加载更多
        </button>
      </div>
      <div v-else>
        <p>加载中...</p>
      </div>
    </div>

    <input ref="inputRef" class="absolute bottom-0 left-0 w-full h-10 mb-2" placeholder="请输入内容" type="text" @focus="onFocus" @blur="onBlur">
  </div>
</template>

<style lang="scss" scoped>
</style>

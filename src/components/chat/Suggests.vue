<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
})

withDefaults(defineProps<{
  suggests: string[]
  loading: boolean
}>(), {
  isLast: false,
  suggests: () => [],
})

const emit = defineEmits(['clickSuggest'])
</script>

<template>
  <CommonLoadingBar
    v-if="loading"
    :dot-size="8"
    class="mb-3 !justify-center !bg-[#F5F5F5] !dark:bg-[#FFFFFF0d] w-22 h-11 rounded-3"
  />
  <template v-else-if="suggests?.length">
    <div
      v-for="(item, i) in suggests" :key="i"
      class="flex items-center mb-3 border text-[14px] text-left color-black border-border-grey line-height-[24px] rounded-[12px] px-3 py-[11px] cursor-pointer mr-[12px]
    dark:hover:color-[#fff] dark:hover:bg-[#ffffff1a]
    hover:bg-[#ecf1ff] hover:border-[#ecf1ff] hover:color-primary"
      @click="() => emit('clickSuggest', { content: item })"
    >
      <span class="leading-[20px]">{{ item }}</span>
    </div>
  </template>
</template>

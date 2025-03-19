<script lang="ts" setup>
const props = withDefaults(defineProps<{
  content: string
  status: string
  header?: string
}>(), { header: '' })
const showCursor = computed(() => props.status === 'outputting' && !!props.content)
</script>

<template>
  <div class="flex flex-col items-start">
    <template v-if="$slots.loading && status !== 'idle'">
      <slot name="loading" />
    </template>
    <div
      v-else
      class="markdown-content text-base tracking-[1px] text-wrap"
      :class="`${showCursor ? 'show-cursor' : ''}`"
      v-html="content"
    />
  </div>
</template>

<style lang="scss">
@import '@/styles/markdown.scss';
</style>

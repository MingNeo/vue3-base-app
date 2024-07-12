<script setup lang="ts">
const props = withDefaults(defineProps<{ height?: number | string }>(), {
  height: 'auto',
})

const height = computed(() => typeof props.height === 'string' ? props.height : `${props.height}px`)
</script>

<template>
  <el-image class="common-image rounded-1" :style="{ height }" />
</template>

<style lang="scss">
.common-image {
  object-fit: cover;
}
</style>

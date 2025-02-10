<script setup lang="ts">
const props = withDefaults(defineProps<{
  height?: number | string
  src?: string
  alt?: string
}>(), {
  height: 'auto',
  alt: '',
})

const height = computed(() => typeof props.height === 'string' ? props.height : `${props.height}px`)
</script>

<template>
  <div class="image-wrapper" :style="{ height }">
    <img
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover rounded"
      @error="$emit('error')"
      @load="$emit('load')"
    >
  </div>
</template>

<style lang="scss">
.image-wrapper {
  position: relative;
  width: 100%;
  background-color: #f5f5f5;
  object-fit: cover;
}
</style>

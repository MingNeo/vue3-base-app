<script setup lang="ts">
interface IconTypes {
  type: string
  fill?: string
  size?: number
  [x: string]: any
}
const props = defineProps<IconTypes>()
const size = computed(() => props.size ? `${props.size}px` : '1em')
</script>

<template>
  <iconpark-icon class="iconpark-icon" :name="props.type" v-bind="$attrs" :size="size" :color="fill || 'currentColor'" />
</template>

<style scoped>
.iconpark-icon {
  line-height: 1;
}
</style>

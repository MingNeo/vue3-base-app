<script lang="ts" setup>
const props = defineProps<{
  dotSize?: number
}>()

const dotSize = computed(() => `${props.dotSize || 6}px`)

const slots = useSlots()
const hasRightSlot = computed(() => !!slots.right)
const hasLeftSlot = computed(() => !!slots.default)
</script>

<template>
  <div class="loading flex justify-between items-center rounded-1.5 bg-bg-white p-1 px-3" v-bind="$attrs">
    <span v-if="hasLeftSlot">
      <slot />
    </span>
    <div class="flex space-x-1">
      <div class="w-1.5 h-1.5 bg-[#3258fb] rounded-full dot" style="animation-delay: 0s;" :style="{ width: dotSize, height: dotSize }" />
      <div class="w-1.5 h-1.5 bg-[#3258fb] rounded-full dot" style="animation-delay: 0.5s;" :style="{ width: dotSize, height: dotSize }" />
      <div class="w-1.5 h-1.5 bg-[#3258fb] rounded-full dot" style="animation-delay: 1s;" :style="{ width: dotSize, height: dotSize }" />
    </div>
    <span v-if="hasRightSlot" class="text-center flex-1 pl-2">
      <slot name="right" />
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .loading {
    @keyframes fade {

      0%,
      20% {
        opacity: 0;
      }

      50% {
        opacity: 1;
      }

      100% {
        opacity: 0;
      }
    }

    .dot {
      animation: fade 1.5s ease-in infinite;
    }
  }
</style>

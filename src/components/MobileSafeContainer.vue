<script setup lang="ts">
const props = defineProps<{
  top: boolean
  bottom: boolean
}>()
const { isMobile } = useScreenSize()
</script>

<template>
  <div v-if="isMobile" class="mobile-safe-container" :class="[{ 'mobile-safe-container__top': props.top, 'mobile-safe-container__bottom': props.bottom }]">
    <slot />
  </div>
  <slot v-else />
</template>

<style lang="scss" scoped>
.mobile-safe-container {
  &__top {
    padding-top: constant(safe-area-inset-top); /* 兼容 iOS < 11.2 */
    padding-top: env(safe-area-inset-top); /* 兼容 iOS >= 11.2 */
  }
  &__bottom {
    padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
    padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
  }
}
</style>

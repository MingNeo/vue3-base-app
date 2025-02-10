<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'primary' | 'default' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
})
</script>

<template>
  <button
    class="rounded-md font-medium transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[
      type === 'primary' ? 'bg-blue-500 hover:bg-blue-600 text-white'
      : type === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white'
        : 'border border-gray-300 hover:bg-gray-50 text-gray-700',
      size === 'small' ? 'px-3 py-1 text-sm'
      : size === 'large' ? 'px-6 py-3 text-lg'
        : 'px-4 py-2 text-base',
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

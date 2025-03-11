<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'

interface Props extends InputHTMLAttributes {
  modelValue: string | number
  size?: 'small' | 'medium' | 'large'
}

const { modelValue, size = 'medium' } = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
  (event: 'focus', evt: FocusEvent): void
  (event: 'blur', evt: FocusEvent): void
}>()

function handleInput(evt: Event) {
  const value = (evt.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    class="w-full border rounded-md transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    :class="[
      size === 'small' ? 'px-3 py-1 text-sm'
      : size === 'large' ? 'px-4 py-3 text-lg'
        : 'px-4 py-2 text-base',
      disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
    ]"
    @input="handleInput"
  >
</template>

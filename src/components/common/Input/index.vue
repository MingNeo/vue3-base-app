<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: 'text' | 'password' | 'number'
  placeholder?: string
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  error?: boolean
  errorMessage?: string
}

const { type = 'text', modelValue, placeholder = '', disabled = false, size = 'medium', error = false, errorMessage = '' } = defineProps<Props>()

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
  <div>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full border rounded-md transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      :class="[
        error ? 'border-red-500' : 'border-gray-300',
        size === 'small' ? 'px-3 py-1 text-sm'
        : size === 'large' ? 'px-4 py-3 text-lg'
          : 'px-4 py-2 text-base',
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
      ]"
      @input="handleInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
    <p v-if="error && errorMessage" class="mt-1 text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>

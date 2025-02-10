<script setup lang="ts">
interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

const { modelValue, options, placeholder = '请选择', disabled = false } = withDefaults(defineProps<{
  modelValue: string | number
  options: Option[]
  placeholder?: string
  disabled?: boolean
}>(), {
  placeholder: '请选择',
  disabled: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number): void
  (event: 'change', value: string | number): void
}>()

const isOpen = ref(false)
const selectedOption = computed(() =>
  options.find(opt => opt.value === modelValue),
)

const selectRef = ref<HTMLElement>()

function handleSelect(option: Option) {
  if (option.disabled)
    return

  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

function toggleDropdown() {
  if (!disabled)
    isOpen.value = !isOpen.value
}

// 修改点击外部关闭下拉框的实现
onClickOutside(selectRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div ref="selectRef" class="relative">
    <button
      type="button"
      class="w-full border rounded-md px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      :class="[
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50',
        isOpen ? 'border-blue-500' : 'border-gray-300',
      ]"
      @click="toggleDropdown"
    >
      <span :class="{ 'text-gray-400': !selectedOption }">
        {{ selectedOption?.label || placeholder }}
      </span>
      <span class="absolute inset-y-0 right-0 flex items-center pr-2">
        <svg
          class="h-5 w-5 text-gray-400"
          :class="{ 'transform rotate-180': isOpen }"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
    >
      <div
        v-for="option in options"
        :key="option.value"
        class="px-4 py-2 cursor-pointer"
        :class="[
          option.disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100',
          option.value === modelValue ? 'bg-blue-50 text-blue-600' : 'text-gray-900',
        ]"
        @click="handleSelect(option)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

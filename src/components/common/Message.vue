<script setup lang="ts">
const { offset = 60, duration = 2500 } = defineProps<{
  title: string
  content?: string
  type: 'success' | 'error' | 'info' | 'warning' | 'loading'
  duration?: number
  offset?: number
}>()

const visible = ref(false)

function open() {
  visible.value = true
  setTimeout(() => {
    close()
  }, duration)
}

function close() {
  visible.value = false
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <div
    v-if="visible" class="fixed left-1/2 z-999 max-w-4/5 min-w-[300px] flex items-center justify-center rounded-md p-4 text-sm -translate-x-1/2"
    :style="{ top: `${offset}px` }"
    :class="{ 'message-in': visible, 'animate-fade-out': !visible, 'bg-blue-50': type === 'info', 'bg-green-50': type === 'success', 'bg-yellow-50': type === 'warning', 'bg-red-50': type === 'error' }"
  >
    <span v-if="type === 'info'" class="i-carbon-information-filled h-5 w-5 text-blue-400" />
    <span v-else-if="type === 'success'" class="i-carbon-checkmark-filled h-5 w-5 text-green-400" />
    <span v-else-if="type === 'warning'" class="i-carbon-warning-filled h-5 w-5 text-yellow-400" />
    <span v-else-if="type === 'error'" class="i-carbon-close-filled h-5 w-5 text-red-400" />
    <p class="ml-3 flex-1 font-medium" :class="{ 'text-blue-700': type === 'info', 'text-green-700': type === 'success', 'text-yellow-700': type === 'warning', 'text-red-700': type === 'error' }">
      {{ title }}
    </p>
    <button type="button" class="inline-flex rounded-md p-1.5 text-gray-400 -mx-1.5 -my-1.5 hover:bg-[#ffffff99] focus:outline-none">
      <span class="i-carbon-close h-5 w-5" />
    </button>
  </div>
</template>

<style>
.message-in {
  animation: message-in 0.35s ease-in-out 1;
}

@keyframes message-in {
  from {
    transform: translate3d(-50%, -100%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
}
</style>

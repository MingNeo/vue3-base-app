<script setup lang="ts">
const { show, title, width, showClose = true } = withDefaults(defineProps<{
  show: boolean
  title?: string
  width?: string
  showClose?: boolean
}>(), {
  title: '',
  width: '500px',
  showClose: true,
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'close'): void
}>()

function handleClose() {
  emit('update:show', false)
  emit('close')
}

// 点击遮罩层关闭
function handleOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('modal-overlay'))
    handleClose()
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="handleOverlayClick"
    >
      <div
        class="bg-white rounded-lg shadow-xl relative"
        :style="{ width }"
        @click.stop
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-medium">
            {{ title }}
          </h3>
          <button
            v-if="showClose"
            class="text-gray-400 hover:text-gray-600"
            @click="handleClose"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-4">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="px-6 py-4 border-t">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

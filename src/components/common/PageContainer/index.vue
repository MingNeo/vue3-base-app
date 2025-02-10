<script lang="ts" setup>
interface Action {
  text: string
  type?: 'primary' | 'default'
  onClick: () => void
}

const props = withDefaults(defineProps<{
  title?: string
  actions?: Action[]
  loading?: boolean
  showHeader?: boolean
}>(), { showHeader: false })

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div
      v-if="props.showHeader"
      class="flex justify-between items-center px-6 py-4 bg-white border-b"
    >
      <div class="flex items-center">
        <h1 class="text-xl font-medium">
          <slot name="title">
            {{ title }}
          </slot>
        </h1>
      </div>

      <div class="flex items-center space-x-4">
        <slot name="headerActions">
          <template v-if="actions">
            <button
              v-for="action in actions"
              :key="action.text"
              class="px-4 py-2 rounded-md"
              :class="[
                action.type === 'primary'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50',
              ]"
              @click="action.onClick"
            >
              {{ action.text }}
            </button>
          </template>
        </slot>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto p-6 relative">
      <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
      </div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-container {
  position: relative;
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>

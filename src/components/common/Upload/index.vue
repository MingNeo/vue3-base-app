<script lang="ts" setup>
const props = withDefaults(defineProps<{
  multiple?: boolean
  accept?: string
}>(), {
  multiple: false,
  accept: 'image/*',
})

const emit = defineEmits<{
  (e: 'change', files: File[]): void
  (e: 'error'): void
  (e: 'preview', url: string): void
}>()

const previewUrl = ref('')
const showPreview = ref(false)

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files?.length)
    return

  const files = Array.from(target.files)
  emit('change', files)

  // Preview for single image
  if (files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result)
        previewUrl.value = e.target.result as string
    }
    reader.readAsDataURL(files[0])
  }
}

function openPreview(url: string) {
  previewUrl.value = url
  showPreview.value = true
  emit('preview', url)
}
</script>

<template>
  <div class="upload-container">
    <label class="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
      <input
        type="file"
        class="hidden"
        :multiple="multiple"
        :accept="accept"
        @change="handleFileChange"
      >
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </label>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="relative max-w-3xl max-h-[90vh]">
        <img :src="previewUrl" class="max-w-full max-h-[90vh] object-contain">
        <button
          class="absolute top-4 right-4 text-white hover:text-gray-300"
          @click="showPreview = false"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

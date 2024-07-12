<script lang="ts" setup>
// import type { UploadFile } from ''

interface UploadFile {
  name: string
  url: string
  type: string
  status: string
  response: { result: string }
}

interface PropsTypes {
  accept?: string
  limit?: { limitSize?: number, limitNum: number }
  multiple?: boolean
  viewMode?: boolean
  files?: UploadFile | UploadFile[]
  action?: string
  withCredentials?: boolean
}

const props = withDefaults(defineProps<PropsTypes>(), {
  accept: '.doc,.docx,.pdf,.jpg,.png,.xlsx',
  action: '/api/misc/oss/upload',
  multiple: true,
  withCredentials: true,
})

const emits = defineEmits(['update:files'])

const defaultLimit = computed(() => ({ limitSize: props.limit?.limitSize ?? 50, limitNum: !props.multiple ? 1 : (props.limit?.limitNum ?? 10) }))

const uploadFiles = ref<UploadFile[]>([])
const isUploading = ref<boolean>(false)

watchEffect(() => {
  uploadFiles.value = props.multiple ? (props.files || []) as UploadFile[] : ([props.files as UploadFile].filter(Boolean))
})

async function handleUploadChange({ fileList = [] }: { fileList: UploadFile[] }) {
  uploadFiles.value = fileList
  isUploading.value = fileList.some(({ status }) => status === 'uploading')

  if (!isUploading.value) {
    const addImageList = fileList.filter(({ response }) => !!response?.result).map(item => ({ name: item.name, url: item.response.result, type: item.type }))
    const uploadedImageList = fileList.filter(({ url }) => !!url).map(item => ({ name: item.name, url: item.url, type: item.type }))
    const imageList = [...uploadedImageList, ...addImageList]
    emits('update:files', props.multiple ? imageList : imageList[0])
  }
}
</script>

<template>
  <div class="upload-container" v-bind="$attrs">
    <common-origin-upload
      v-model:file-list="uploadFiles"
      list-type="picture-card"
      :action="action"
      :accept="accept"
      :multiple="multiple"
      :max-count="defaultLimit.limitNum"
      :with-credentials="withCredentials"
      :disabled="isUploading"
      v-bind="$attrs"
      @change="handleUploadChange"
    >
      <slot>
        <div v-if="uploadFiles.length < defaultLimit.limitNum">
          <div class="ant-upload-text">
            上传
          </div>
        </div>
      </slot>
    </common-origin-upload>
    <slot name="tips">
      <p>支持扩展名: {{ accept }}</p>
      <p>
        单个文件不超过{{ defaultLimit.limitSize || 50 }}M
        <span v-if="props.multiple">，数量不超过{{ defaultLimit.limitNum }}个</span>
      </p>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.upload-container {
  p {
    margin: 0;
    padding: 0;

    &:first-child {
      margin-bottom: 2px;
    }
  }
}
</style>

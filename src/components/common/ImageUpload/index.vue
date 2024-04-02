<script setup lang="ts">
import type { ImageUploadProps } from './types'

const props = withDefaults(defineProps<ImageUploadProps>(), {
  action: '/api/misc/oss/upload',
  name: 'file',
  accept: 'image/png, image/jpeg',
  limitSize: 20,
})
const emit = defineEmits(['update:value', 'change'])

const value = ref<any>(formatValue(props.value, props.multiple))
const uploading = ref(false)

watch(() => props.value, (v) => {
  value.value = formatValue(v, props.multiple)
})

const handleBeforeUpload: any = (_, fileList) => {
  const sizeLimit = fileList.some(({ size }) => size / 1024 / 1024 > props.limitSize)
  if (sizeLimit)
    ElMessage.warning(`图片大小不能超过${props.limitSize}M`)

  return !sizeLimit
}

const handleUploadChange = async ({ fileList = [] }: { fileList: any[] }) => {
  const filterFileList = fileList.filter(({ status, url }) => !!url || !!status)
  value.value = filterFileList
  const isUploading = filterFileList.some(({ status }) => status === 'uploading')
  uploading.value = isUploading
  if (!isUploading) {
    const addImageList = filterFileList.filter(({ response }) => !!response?.result).map(item => ({ name: item.name, url: item.response.result }))
    const uploadedImageList = filterFileList.filter(({ url }) => !!url).map(item => ({ name: item.name, url: item.url }))
    const imageList = [...uploadedImageList, ...addImageList]
    emit('update:value', props.multiple ? imageList.map(({ url }) => url) : imageList[0]?.url)
  }
}

const maxLength = computed(() => props.multiple ? props.maxLength : 1)

const uploadable = computed(() => {
  return !maxLength.value || (value.value?.length || 0) < maxLength.value
})
</script>

<script lang="ts">
function formatValue(value?: string | string[], multiple?: boolean) {
  return multiple ? ((value as string[])?.map(url => ({ url })) || []) : (value ? [{ url: value }] : [])
}
</script>

<template>
  <common-origin-upload
    v-if="!readonly"
    v-bind="$attrs" v-model:file-list="value" :action="action" :name="name" :accept="accept"
    :disabled="uploading" list-type="picture-card"
    :max-count="maxLength" :before-upload="handleBeforeUpload" @change="handleUploadChange"
  >
    <div v-if="uploadable" class="common-upload">
      <IconParkPlus size="18" />
      上传
    </div>
    <template #removeIcon>
      <common-icon type="guanbiclose-one-9644abf4" :size="16" />
    </template>
  </common-origin-upload>
  <template v-else>
    <el-image-preview-group v-if="value?.length">
      <div v-for="(item, index) in value" :key="index" class="common-image-upload-preview">
        <el-image :src="item.url" />
      </div>
    </el-image-preview-group>
    <template v-else>
      -无-
    </template>
  </template>
</template>

<style scoped lang="scss">
.common-single-image {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  &-delete {
    position: absolute;
    top: -8px;
    right: -8px;
    color: #8A9199;
  }
}

.common-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

<style lang="scss">
.common-single-image {
  .ant-image {
    height: 100%;

    .ant-image-img {
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }
}

.common-image-upload-preview {
  display: inline-block;
  margin: 0 8px 8px 0;
  overflow: hidden;
  width: 102px;
  height: 102px;
  border-radius: 4px;
}

.ant-upload {
  &.ant-upload-select-picture-card {
    width: 72px;
    height: 72px;

    &>.ant-upload {
      padding: 0;
    }
  }
}

.ant-upload-list-picture-card-container {
  width: 72px;
  height: 72px;
}

.ant-upload-list-picture-card {
  .ant-upload-list-item {
    padding: 0px;
    border: none;

    .ant-upload-list-item-info {
      overflow: hidden;
      border-radius: 4px;

      .ant-upload-list-item-thumbnail {
        img {
          object-fit: cover;
        }
      }
    }

    .ant-upload-list-item-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      opacity: 1;

      &>a {
        opacity: 0;
      }

      .ant-upload-list-item-card-actions-btn {
        position: absolute;
        top: -8px;
        right: -15px;
        width: auto;
        height: auto;
        color: #8A9199;
        border: none;
        box-shadow: none;
        opacity: 1;
      }
    }

    &:hover {
      .ant-upload-list-item-actions {
        &>a {
          opacity: 1;
        }
      }
    }
  }
}
</style>

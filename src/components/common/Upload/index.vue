<script lang="ts" setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

interface ProUpload extends Partial<UploadProps> {
}

const props = withDefaults(defineProps<ProUpload>(), {
  listType: 'picture-card',
})

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
</script>

<template>
  <el-upload
    v-bind="props"
    :on-preview="props.onPreview || handlePictureCardPreview"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image">
  </el-dialog>
</template>

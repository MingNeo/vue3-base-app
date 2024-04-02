<script lang="ts" setup>
const preview = reactive({ visible: false, url: '' })

const handlePreview = (file: any) => {
  if (isImageUrl(file)) {
    preview.url = file.url
    preview.visible = true
  }
  else {
    window.open(file.url, '_blank')
  }
}
</script>

<template>
  <el-upload v-bind="$attrs" :on-preview="handlePreview">
    <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
      <slot :name="key" v-bind="slotProps || {}" />
    </template>
  </el-upload>
  <el-dialog v-model="preview.visible">
    <img w-full :src="preview.url" alt="Preview Image">
  </el-dialog>
</template>

<template>
  <el-dialog v-bind="$attrs">
    <template #header="{ close }">
      <common-icon type="close" @click="close" />
    </template>
    <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
      <slot :name="key" v-bind="slotProps || {}" />
    </template>
  </el-dialog>
</template>

<style lang="scss">
</style>

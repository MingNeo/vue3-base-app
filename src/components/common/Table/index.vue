<script setup lang="ts">
interface Column {
  key: string
  title: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  render?: (row: any) => any
}

withDefaults(defineProps<{
  columns: Column[]
  data: any[]
  loading?: boolean
  bordered?: boolean
  stripe?: boolean
}>(), {
  loading: false,
  bordered: false,
  stripe: false,
})
</script>

<template>
  <div class="relative overflow-x-auto">
    <table class="w-full text-sm text-left" :class="{ 'border border-gray-200': bordered }">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="{ width: col.width }"
            class="px-6 py-3"
            :class="[
              col.align === 'center' ? 'text-center'
              : col.align === 'right' ? 'text-right'
                : 'text-left',
            ]"
          >
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="index"
          class="bg-white border-b hover:bg-gray-50"
          :class="{ 'bg-gray-50': stripe && index % 2 === 1 }"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="px-6 py-4"
            :class="[
              col.align === 'center' ? 'text-center'
              : col.align === 'right' ? 'text-right'
                : 'text-left',
            ]"
          >
            <template v-if="col.render">
              {{ col.render(row) }}
            </template>
            <template v-else>
              {{ row[col.key] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
    </div>
  </div>
</template>

<style scoped>
.table-wrapper {
  position: relative;
  overflow-x: auto;
}
</style>

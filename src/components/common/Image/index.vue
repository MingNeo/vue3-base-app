<script setup lang="ts">
const props = defineProps<{
  src: string | any
}>()

const formatedSrc = computed(() => typeof props.src !== 'string' || props.src.startsWith('data:') ? props.src : getCdnUrl(props.src))
</script>

<template>
  <img :src="formatedSrc" v-bind="$attrs">
</template>

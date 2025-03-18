import { onMounted, onUnmounted, type Ref, ref } from 'vue'

type Handler = (event: MouseEvent) => void

/**
 * 检测点击目标元素以外区域的 hook
 * @param handler 点击外部时的回调函数
 * @param elementRef 目标元素的 ref, 也可以使用返回的 elementRef
 */
export function useClickOutside(
  handler: Handler,
  elementRef?: Ref<HTMLElement | undefined>,
) {
  const _elementRef = ref<HTMLElement | undefined>(elementRef?.value)

  const listener = (event: MouseEvent) => {
    // 如果元素不存在，或者点击的是元素内部，则不触发回调
    if (!_elementRef.value || _elementRef.value.contains(event.target as Node))
      return

    handler(event)
  }

  onMounted(() => {
    _elementRef.value = elementRef?.value
    document.addEventListener('click', listener)
  })

  onUnmounted(() => {
    document.removeEventListener('click', listener)
  })

  return { elementRef: _elementRef }
}

type ScrollElement = HTMLDivElement | null
interface ScrollReturn {
  scrollRef: Ref<ScrollElement>
  scrollToBottom: (force?: boolean) => Promise<void>
}

export function useScrollToBottom(): ScrollReturn {
  const scrollRef = ref<ScrollElement>(null)
  const lastScrollTops = ref<any[]>([])
  const disableAutoScroll = ref(false)

  const scrollToBottom = async () => {
    await nextTick()
    if (scrollRef.value)
      scrollRef.value.scrollTo({ left: 0, top: scrollRef.value.scrollHeight, behavior: ('smooth') }) // 平滑滚动
  }

  const scrollToBottomAuto = async (force = false) => {
    if (force) {
      disableAutoScroll.value = false
      scrollToBottom()
      return
    }

    if (scrollRef.value) {
      if (lastScrollTops.value[1] < lastScrollTops.value[0])
        disableAutoScroll.value = true

      if (!disableAutoScroll.value)
        scrollRef.value.scrollTo({ left: 0, top: scrollRef.value.scrollHeight, behavior: ('smooth') }) // 平滑滚动

      else if (scrollRef.value.scrollHeight - scrollRef.value.scrollTop - scrollRef.value.clientHeight < 50)
        disableAutoScroll.value = false
    }
  }

  useEventListener(scrollRef, 'scroll', () => {
    lastScrollTops.value = [lastScrollTops.value[1] || 0, scrollRef.value?.scrollTop || 0]
  })

  return {
    scrollRef,
    scrollToBottom: scrollToBottomAuto,
  }
}

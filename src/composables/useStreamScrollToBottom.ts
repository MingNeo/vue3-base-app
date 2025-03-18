export function useStreamScrollToBottom(content: Ref<string>, autoScroll = true) {
  const { scrollRef, scrollToBottom } = useScrollToBottom()

  watch(() => content, (val, oldVal) => {
    autoScroll && val && val !== oldVal && scrollToBottom()
  })

  return { scrollRef, scrollToBottom }
}
